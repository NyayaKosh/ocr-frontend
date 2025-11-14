"use client";

import { Button } from "@/components/ui/button";
import { useImageEditorStore } from "@/lib/store";
import { RefreshCcw } from "lucide-react";

export default function ResetAction() {
    const { reset } = useImageEditorStore();

    return (
        <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCcw className="h-4 w-4 mr-1" />
            Reset
        </Button>
    );
}
