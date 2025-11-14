"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ScanTextIcon, X, CameraIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useFileUploadContext } from "@/lib/context/file-upload";

type Prediction = {
    class: string;
    score: number;
    bbox: [number, number, number, number];
};

type CocoSsdModel = {
    detect: (
        input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
    ) => Promise<Prediction[]>;
};

export default function DocumentScannerUpload({
    setClose,
}: {
    setClose: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastCaptureRef = useRef<number>(0);
    const animationRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);
    const modelRef = useRef<CocoSsdModel | null>(null);

    const { setFiles } = useFileUploadContext();

    const handleImageChange = (file: File) => {
        setFiles((prev) => {
            if (prev.some((f) => f.name === file.name)) return prev;
            return [...prev, file];
        });
    };

    async function setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                return new Promise<void>((resolve) => {
                    videoRef.current!.onloadedmetadata = () => resolve();
                });
            }
        } catch {
            toast.error("Camera access denied");
        }
    }

    function handleCapture(blob: Blob) {
        const file = new File([blob], `document-${Date.now()}.jpg`, {
            type: "image/jpeg",
        });
        handleImageChange(file);
        toast.success("📸 Document captured");
    }

    // ✅ Manual capture button handler
    function handleManualCapture() {
        if (!videoRef.current || !canvasRef.current) {
            toast.error("Camera not ready");
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (blob) handleCapture(blob);
            },
            "image/jpeg",
            0.9
        );
    }

    async function detectFrame() {
        if (!videoRef.current || !canvasRef.current || !modelRef.current)
            return;

        const predictions: Prediction[] = await modelRef.current!.detect(
            videoRef.current
        );
        const docPred = predictions.find(
            (p) =>
                ["book", "cell phone", "laptop", "document"].includes(
                    p.class
                ) && p.score > 0.7
        );

        if (docPred && Date.now() - lastCaptureRef.current > 5000) {
            lastCaptureRef.current = Date.now();

            const [x, y, width, height] = docPred.bbox;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(
                videoRef.current,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
            );

            canvas.toBlob(
                (blob) => {
                    if (blob) handleCapture(blob);
                },
                "image/jpeg",
                0.9
            );
        }

        animationRef.current = requestAnimationFrame(detectFrame);
    }

    useEffect(() => {
        let active = true;

        (async () => {
            await setupCamera();
            const cocoSsd = await import("@tensorflow-models/coco-ssd");
            await import("@tensorflow/tfjs");
            modelRef.current = await cocoSsd.load();
            if (active) detectFrame();
        })();

        return () => {
            active = false;
            if (animationRef.current)
                cancelAnimationFrame(animationRef.current);
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    return (
        <div className="space-y-3">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded border shadow"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* ✅ Manual trigger button */}
            <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setClose()}>
                    <X className="mr-1" /> Close
                </Button>
                <Button onClick={handleManualCapture} className="">
                    <CameraIcon className="mr-1" /> Capture
                </Button>
            </div>
        </div>
    );
}

export function DocumentScannerWrapper() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
            {!open ? (
                <>
                    <h2 className="text-lg font-semibold">
                        📄 Document Capture
                    </h2>
                    <p className="text-gray-600 text-sm text-center">
                        Use your camera to scan and upload documents.
                    </p>
                    <Button onClick={() => setOpen(true)}>
                        <ScanTextIcon className="mr-2" /> Start Scanner
                    </Button>
                </>
            ) : (
                <div className="w-full space-y-2">
                    <DocumentScannerUpload setClose={() => setOpen(false)} />
                </div>
            )}
        </div>
    );
}
