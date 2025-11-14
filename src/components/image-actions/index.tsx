"use client";

import { useImageEditorStore } from "@/lib/store";
import Cropper from "react-easy-crop";
import RotateAction from "./rotate";
import ResetAction from "./rese";
import AspectRatioSelector from "./aspect-ratio-slider";
import ZoomSlider from "./zoom-slider";

export function ImageEditor({ imageUrl }: { imageUrl: string }) {
    const { crop, zoom, rotation, aspect, setCrop, setZoom, setRotation } =
        useImageEditorStore();

    return (
        <div className="space-y-4">
            <div className="relative w-full h-[60vh] bg-neutral-100 rounded-lg overflow-hidden">
                <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    cropShape="rect"
                />
            </div>

            <div className="flex justify-between flex-wrap gap-3 border p-3 rounded-md bg-muted/30">
                <RotateAction />
                <ResetAction />
                <AspectRatioSelector />
            </div>

            <div className="flex gap-4 flex-wrap">
                <ZoomSlider />
                {/* <RotationSlider /> optional */}
            </div>
        </div>
    );
}
