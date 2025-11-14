"use client";

import React from "react";
import { File } from "lucide-react";
import { DocumentScannerWrapper } from "@/components/document-scanner-upload";
import { FileUploadContext } from "@/lib/context/file-upload";
import { UploadedSortableView } from "@/components/image-sortable";
import { FileUpload } from "@/components/ui/file-upload";
import useUploadFiles from "@/utils/upload.hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileProgress } from "@/components/file-progress";
import { AnimatePresence, motion } from "framer-motion";

export default function DocumentScannerPage() {
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
        <FileUploadContext.Provider value={{ files, setFiles }}>
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
                <div>
                    <DocumentScannerWrapper />

                    <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
                            <File /> Scanned Files
                        </h2>
                        <UploadedSortableView />
                        <FileProgress
                            callback={() => setUploadedFileId(null)}
                            uploadedId={uploadedId as string}
                        />

                        {/* ✅ Animated Presence */}
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
                                        {files.length === 1
                                            ? "image"
                                            : "images"}{" "}
                                        •{" "}
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
                                            {isUploading
                                                ? `Uploading ${progress}%`
                                                : "Start OCR"}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </FileUpload>
        </FileUploadContext.Provider>
    );
}
