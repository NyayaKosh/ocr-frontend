"use client";

import { Slider } from "@/components/ui/slider";
import { useImageEditorStore } from "@/lib/store";
import { ZoomIn, ZoomOut } from "lucide-react";

export default function ZoomSlider() {
    const { zoom, setZoom } = useImageEditorStore();

    return (
        <div className="flex items-center gap-3 w-full sm:w-1/2">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(val) => setZoom(val[0])}
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
        </div>
    );
}
