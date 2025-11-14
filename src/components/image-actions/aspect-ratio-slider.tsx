"use client";

import { Button } from "@/components/ui/button";
import { useImageEditorStore } from "@/lib/store";
import { Crop } from "lucide-react";

const aspectRatios = [
    { label: "A4", value: 210 / 297 },
    { label: "Letter", value: 8.5 / 11 },
    { label: "Legal", value: 8.5 / 14 },
    { label: "16:9", value: 16 / 9 },
];

export default function AspectRatioSelector() {
    const { aspect, setAspect } = useImageEditorStore();

    return (
        <div className="flex flex-wrap gap-2">
            {aspectRatios.map((r) => (
                <Button
                    key={r.label}
                    size="sm"
                    variant={aspect === r.value ? "default" : "outline"}
                    onClick={() => setAspect(r.value)}
                >
                    <Crop className="h-3 w-3 mr-1" />
                    {r.label}
                </Button>
            ))}
        </div>
    );
}
