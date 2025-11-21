"use client";

import { Loader, Upload, UploadCloudIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Input } from "./ui/input";
import { FileProgress } from "./file-progress";
import { UploadedSortableView } from "./image-sortable";
import { FileUploadContext } from "@/lib/context/file-upload";
import { AnimatePresence, motion } from "framer-motion";
import useUploadFiles from "@/utils/upload.hook";
import { cn } from "@/lib/utils";

export default function UploadFiles() {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const {
        onUpload,
        isUploading,
        files,
        setFiles,
        onFileReject,
        documentName,
        progress,
        setDocumentName,
        totalSize,
        uploadedId,
        setUploadedFileId,
    } = useUploadFiles();
    return (
        <>
            <FileUploadContext.Provider value={{ files, setFiles }}>
                <div className="relative pb-28">
                    <FileUpload
                        accept="image/*"
                        maxFiles={150}
                        maxSize={4 * 1024 * 1024}
                        className=""
                        onUpload={onUpload}
                        onValueChange={setFiles}
                        onFileReject={onFileReject}
                        multiple
                        value={files}
                        disabled={isUploading}
                    >
                        <div className="space-y-4">
                            {/* Dropzone */}
                            <FileUploadDropzone className="border border-blue-300 bg-blue-50/50 rounded-md p-6 hover:bg-blue-50 transition-colors">
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <div className="flex items-center justify-center rounded-full border p-2.5">
                                        <Upload className="size-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-sm">
                                        Drag & drop images here
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Or click to browse (max 150 files, up to
                                        4MB each)
                                    </p>
                                </div>
                                <FileUploadTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-fit"
                                    >
                                        Browse files
                                    </Button>
                                </FileUploadTrigger>
                            </FileUploadDropzone>
                            <UploadedSortableView />
                        </div>
                    </FileUpload>

                    <AnimatePresence>
                        {files.length > 0 && (
                            <motion.div
                                key="bottom-bar"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 18,
                                }}
                                className="fixed bottom-0 left-0 right-0 border-t bg-background/70 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
                            >
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span className="font-medium text-foreground">
                                        {files.length}
                                    </span>{" "}
                                    {files.length === 1 ? "image" : "images"} •{" "}
                                    <span className="font-medium text-foreground">
                                        {totalSize}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                    <Input
                                        value={documentName}
                                        placeholder="Document Name"
                                        ref={inputRef}
                                        className={cn(
                                            "w-full sm:w-auto",
                                            !documentName.trim() &&
                                                files.length > 0
                                                ? "border border-red-400"
                                                : ""
                                        )}
                                        disabled={isUploading}
                                        onChange={(e) =>
                                            setDocumentName(e.target.value)
                                        }
                                    />
                                    <Button
                                        onClick={() =>
                                            onUpload(files, {
                                                onProgress: () => {},
                                                onSuccess: () => {},
                                                onError: () => {},
                                            })
                                        }
                                        disabled={
                                            isUploading ||
                                            files.length === 0 ||
                                            !documentName.trim()
                                        }
                                        className="w-full sm:w-auto"
                                    >
                                        {!isUploading && <UploadCloudIcon />}
                                        {isUploading && <Loader />}
                                        {isUploading &&
                                            `Uploading ${progress}%`}
                                        {!isUploading && "Start OCR"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </FileUploadContext.Provider>

            {/* <iframe
                src="https://ftgzbbikyfkzsidvswig.storage.supabase.co/storage/v1/s3/ocr-testing/documents/d.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=eaa0c54e40e2a25978204c7adca14f5c%2F20251121%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20251121T004557Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d66c0b8ca42f79b5ac999bb3a0068cf0d2355a416b42cd7fade6a3c8a081f415"
                className="w-full h-screen"
            ></iframe> */}

            <FileProgress
                callback={() => setUploadedFileId(null)}
                uploadedId={uploadedId as string}
            />
        </>
    );
}
