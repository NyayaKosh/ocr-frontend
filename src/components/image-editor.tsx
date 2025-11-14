"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { dataURLtoFile } from "@/lib/crop-utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Crop as CropIcon,
    Pen,
    RefreshCcw,
    RotateCcw,
    RotateCw,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { useFileUploadContext } from "@/lib/context/file-upload";

export function ImageCropViewer({ file }: { file: File }) {
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 50,
        height: 50,
        x: 25,
        y: 25,
    });
    const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const imgRef = useRef<HTMLImageElement | null>(null);
    const { setFiles } = useFileUploadContext();

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = () => setImageUrl(reader.result as string);
        reader.readAsDataURL(file);
    }, [file]);

    const getCroppedImage = useCallback(
        async (image: HTMLImageElement, crop: Crop, rotation = 0, zoom = 1) => {
            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const pixelRatio = window.devicePixelRatio;
            const radians = (rotation * Math.PI) / 180;

            const cropWidth = crop.width! * scaleX * zoom;
            const cropHeight = crop.height! * scaleY * zoom;

            canvas.width = cropWidth * pixelRatio;
            canvas.height = cropHeight * pixelRatio;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = "high";

            // Move to center and rotate
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(radians);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            ctx.drawImage(
                image,
                crop.x! * scaleX,
                crop.y! * scaleY,
                crop.width! * scaleX,
                crop.height! * scaleY,
                0,
                0,
                cropWidth,
                cropHeight
            );

            return new Promise<string>((resolve) => {
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                }, "image/jpeg");
            });
        },
        []
    );

    const handleCrop = async () => {
        if (!imgRef.current || !completedCrop) return;
        setIsProcessing(true);
        const croppedUrl = await getCroppedImage(
            imgRef.current,
            completedCrop,
            rotation,
            zoom
        );
        if (!croppedUrl) {
            setIsProcessing(false);
            return;
        }

        const croppedFile = dataURLtoFile(croppedUrl, file.name);

        setFiles((prev) => {
            const index = prev.findIndex((f) => f.name === file.name);
            if (index !== -1) {
                const newFiles = [...prev];
                newFiles[index] = croppedFile;
                return newFiles;
            }
            return prev;
        });

        setIsProcessing(false);
        setOpen(false);
    };

    const resetEdits = () => {
        setCrop({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
        setAspect(undefined);
        setRotation(0);
        setZoom(1);
    };

    const aspectRatios = [
        { label: "Free", value: undefined },
        { label: "A4", value: 210 / 297 },
        { label: "16:9", value: 16 / 9 },
        { label: "1:1", value: 1 },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                    <Pen className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-background">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>
                        Crop, rotate, and zoom freely or use preset ratios for
                        perfect alignment.
                    </DialogDescription>
                </DialogHeader>

                {/* Editor Area */}
                <div className="relative flex justify-center bg-muted/30 rounded-md p-4 max-h-[70vh] overflow-hidden">
                    {imageUrl && (
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            keepSelection
                            minWidth={10}
                        >
                            <img
                                ref={imgRef}
                                src={imageUrl}
                                alt="Crop target"
                                style={{
                                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                                    transition: "transform 0.15s ease-out",
                                    maxHeight: "70vh",
                                    objectFit: "contain",
                                }}
                            />
                        </ReactCrop>
                    )}
                </div>

                {/* Toolbar */}
                <TooltipProvider>
                    <div className="flex flex-wrap items-center justify-between gap-3 border rounded-md p-3 bg-muted/30 mt-4">
                        {/* Left controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setRotation(
                                                (r) => (r - 90 + 360) % 360
                                            )
                                        }
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Rotate Left</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setRotation((r) => (r + 90) % 360)
                                        }
                                    >
                                        <RotateCw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Rotate Right</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetEdits}
                                    >
                                        <RefreshCcw className="h-4 w-4" /> Reset
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset All</TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Right controls - Aspect ratios */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {aspectRatios.map((opt) => (
                                <Button
                                    key={opt.label}
                                    size="sm"
                                    variant={
                                        aspect === opt.value
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setAspect(opt.value)}
                                    className="flex items-center gap-1"
                                >
                                    <CropIcon className="h-3 w-3" />
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </TooltipProvider>

                {/* Sliders */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-3 w-full sm:w-1/2">
                        <ZoomOut className="h-4 w-4 text-muted-foreground" />
                        <Slider
                            min={0.5}
                            max={2.5}
                            step={0.1}
                            value={[zoom]}
                            onValueChange={(val) => setZoom(val[0])}
                        />
                        <ZoomIn className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Rotation Slider */}
                    <div className="flex items-center gap-3 w-full sm:w-1/2">
                        <RotateCw className="h-4 w-4 text-muted-foreground" />
                        <Slider
                            min={0}
                            max={360}
                            step={1}
                            value={[rotation]}
                            onValueChange={(val) => setRotation(val[0])}
                        />
                        <span className="text-sm text-muted-foreground w-10 text-right">
                            {rotation}°
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCrop} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
