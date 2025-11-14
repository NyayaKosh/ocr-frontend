"use client";

import * as React from "react";
import * as Sortable from "@/components/ui/sortable";
import {
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadList,
} from "./ui/file-upload";
import { Button } from "./ui/button";
import { GripVertical, X } from "lucide-react";
import { ImageCropViewer } from "./image-editor";
import { useFileUploadContext } from "@/lib/context/file-upload";
import Image from "next/image";
import { RotateImage } from "./image-actions/rotate";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ImageCard } from "./image-card";

export function UploadedSortableView() {
    const { files, setFiles } = useFileUploadContext();
    return (
        <Sortable.Root
            value={files}
            onValueChange={setFiles}
            getItemValue={(item) => item.name}
            orientation="mixed"
        >
            <Sortable.Content>
                <FileUploadList
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    orientation="vertical"
                >
                    {files.map((file, index) => (
                        <ImageCardOld
                            key={`${file.name} + ${index}`}
                            image={file}
                            index={index}
                            asChild
                        />
                    ))}
                </FileUploadList>
            </Sortable.Content>
            <Sortable.Overlay>
                {(activeItem) => {
                    const file = files.find(
                        (file) => file.name === activeItem.value
                    );

                    if (!file) return null;

                    return (
                        <ImageCard image={file} index={files.indexOf(file)} />
                    );
                }}
            </Sortable.Overlay>
        </Sortable.Root>
    );
}

interface ImageCardProps
    extends Omit<
        React.ComponentPropsWithoutRef<typeof Sortable.Item>,
        "value"
    > {
    image: File;
    index: number;
}

function ImageCardOld({ image, ...props }: ImageCardProps) {
    return (
        <Sortable.Item value={image.name} {...props} asChild>
            <FileUploadItem key={image.name} value={image} className="h-fit">
                <div className="flex w-full items-center gap-2">
                    <div className="relative flex-shrink-0 w-full sm:w-60 overflow-hidden rounded-lg border">
                        <Image
                            src={URL.createObjectURL(image)}
                            alt={image.name}
                            width={300}
                            height={200}
                            className="object-cover w-full h-40 sm:h-48 transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                            Page #{props.index + 1}
                        </div>
                    </div>

                    <div className="">
                        <div className="">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Sortable.ItemHandle asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 cursor-move"
                                        >
                                            <GripVertical />
                                        </Button>
                                    </Sortable.ItemHandle>
                                </TooltipTrigger>
                                <TooltipContent>Move Image</TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <FileUploadItemDelete asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7"
                                        >
                                            <X />
                                        </Button>
                                    </FileUploadItemDelete>
                                </TooltipTrigger>
                                <TooltipContent>Remove Image</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="">
                            <ImageCropViewer file={image} />
                        </div>
                        <div className="">
                            <RotateImage file={image} />
                        </div>
                    </div>
                </div>
                <FileUploadItemMetadata className="" />
            </FileUploadItem>
        </Sortable.Item>
    );
}
