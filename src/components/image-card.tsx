"use client";

import * as React from "react";
import * as Sortable from "@/components/ui/sortable";
import {
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
} from "./ui/file-upload";
import { Button } from "./ui/button";
import { GripVertical, X } from "lucide-react";
import { ImageCropViewer } from "./image-editor";
import Image from "next/image";
import { RotateImage } from "./image-actions/rotate";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ImageCardProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof Sortable.Item>,
        "value"
    > {
    image: File;
    index?: number;
}

export function ImageCard({ image, index, ...props }: ImageCardProps) {
    return (
        <Sortable.Item value={image.name} {...props} asChild>
            <FileUploadItem
                key={image.name}
                value={image}
                className="group relative h-fit w-full overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
            >
                <div className="flex flex-col sm:flex-row w-full gap-4 p-3">
                    {/* Image Preview */}
                    <div className="relative flex-shrink-0 w-full sm:w-60 overflow-hidden rounded-lg border">
                        <Image
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            width={300}
                            height={200}
                            className="object-cover w-full h-40 sm:h-48 transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                            Page #{(index ?? 0) + 1}
                        </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="flex flex-col justify-between w-full">
                        <div>
                            <FileUploadItemMetadata className="text-sm text-muted-foreground" />
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-3 sm:mt-0">
                            {/* Sort Handle */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Sortable.ItemHandle asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 hover:bg-accent cursor-move"
                                        >
                                            <GripVertical className="size-4" />
                                        </Button>
                                    </Sortable.ItemHandle>
                                </TooltipTrigger>
                                <TooltipContent>Reorder</TooltipContent>
                            </Tooltip>

                            {/* Crop */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 hover:bg-accent"
                                    >
                                        <ImageCropViewer file={image} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Crop</TooltipContent>
                            </Tooltip>

                            {/* Rotate */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 hover:bg-accent"
                                    >
                                        <RotateImage file={image} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Rotate</TooltipContent>
                            </Tooltip>

                            {/* Delete */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <FileUploadItemDelete asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="size-8"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </FileUploadItemDelete>
                                </TooltipTrigger>
                                <TooltipContent>Remove</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </FileUploadItem>
        </Sortable.Item>
    );
}
