"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { useFileUploadContext } from "@/lib/context/file-upload";
import { useImageEditorStore } from "@/lib/store";
import { Loader, RotateCcw, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function RotateAction() {
    const { setRotation, rotation } = useImageEditorStore();

    return (
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setRotation((rotation - 90 + 360) % 360)}
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
                        onClick={() => setRotation((rotation + 90) % 360)}
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate Right</TooltipContent>
            </Tooltip>
        </div>
    );
}

export function RotateImage({ file }: { file: File }) {
    const { setFiles } = useFileUploadContext();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = () => setImageUrl(reader.result as string);
        reader.readAsDataURL(file);
    }, [file]);

    const rotateImage = useCallback(
        async (newRotation: number) => {
            if (!imageUrl) return;

            setIsProcessing(true);
            const img = new Image();
            img.src = imageUrl;

            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const angle = (newRotation * Math.PI) / 180;
            const width = img.width;
            const height = img.height;

            // Adjust canvas dimensions for 90/270-degree rotations
            if (newRotation % 180 !== 0) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            ctx?.translate(canvas.width / 2, canvas.height / 2);
            ctx?.rotate(angle);
            ctx?.drawImage(img, -width / 2, -height / 2);

            const rotatedDataUrl = canvas.toDataURL("image/png");
            const res = await fetch(rotatedDataUrl);
            const blob = await res.blob();
            const rotatedFile = new File([blob], file.name, {
                type: "image/png",
            });

            setFiles((prev) => {
                const index = prev.findIndex((f) => f.name === file.name);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = rotatedFile;
                    return updated;
                }
                return prev;
            });

            setImageUrl(rotatedDataUrl); // update local preview
            setRotation(newRotation); // store current angle
            setIsProcessing(false);
        },
        [imageUrl, file, setFiles]
    );

    const handleRotateClick = () => {
        const newRotation = (rotation + 90) % 360;
        rotateImage(newRotation);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRotateClick}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <Loader />
                    ) : (
                        <RotateCw className="h-4 w-4" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate</TooltipContent>
        </Tooltip>
    );
}
