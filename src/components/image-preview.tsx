import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useFileUploadContext } from "@/lib/context/file-upload";

export default function ImagePreview() {
    const { files, setFiles } = useFileUploadContext();

    if (!files || files.length === 0) {
        return <p className="text-gray-500 text-sm">No files scanned yet.</p>;
    }

    const handleRemove = (index: number) => {
        setFiles((pre) => pre.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-wrap gap-3 mt-2">
            {files.map((file, i) => {
                const url = URL.createObjectURL(file);
                return (
                    <div key={`preview-${i}`} className="relative group">
                        <Button
                            asChild
                            onClick={() => handleRemove(i)}
                            className=" size-7 rounded-full absolute -right-2 -top-2 invisible group-hover:visible grid place-content-center"
                        >
                            <div className="rounded-full">
                                <X />
                            </div>
                        </Button>
                        <Image
                            width={100}
                            height={400}
                            src={url}
                            alt={`preview-${i}`}
                            className="w-32 h-32 object-cover rounded border"
                        />
                    </div>
                );
            })}
        </div>
    );
}
