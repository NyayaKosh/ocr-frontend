"use client";

import { create } from "zustand";

interface ImageEditorState {
    crop: { x: number; y: number };
    zoom: number;
    rotation: number;
    aspect?: number;
    setCrop: (crop: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    setRotation: (rotation: number) => void;
    setAspect: (aspect?: number) => void;
    reset: () => void;
}

export const useImageEditorStore = create<ImageEditorState>((set) => ({
    crop: { x: 0, y: 0 },
    zoom: 1,
    rotation: 0,
    aspect: 210 / 297,
    setCrop: (crop) => set({ crop }),
    setZoom: (zoom) => set({ zoom }),
    setRotation: (rotation) => set({ rotation }),
    setAspect: (aspect) => set({ aspect }),
    reset: () =>
        set({
            crop: { x: 0, y: 0 },
            zoom: 1,
            rotation: 0,
            aspect: 210 / 297,
        }),
}));
