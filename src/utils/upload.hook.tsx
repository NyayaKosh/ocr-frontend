import { FileUploadProps } from "@/components/ui/file-upload";
import React from "react";
import { toast } from "sonner";
import { axiosClient } from "./axios-handler";
import { AxiosError } from "axios";
import formatFileSize from "./size-format";

export default function useUploadFiles() {
    const [isUploading, setIsUploading] = React.useState(false);
    const [files, setFiles] = React.useState<File[]>([]);
    const [progress, setProgress] = React.useState<number>(0);
    const [documentName, setDocumentName] = React.useState("");
    const [uploadedId, setUploadedFileId] = React.useState<string | null>(null);

    const onUpload: NonNullable<FileUploadProps["onUpload"]> =
        React.useCallback(
            async (files, { onProgress }) => {
                if (!documentName.trim()) {
                    toast.error("Please fill document name.");
                    return;
                }

                try {
                    setIsUploading(true);
                    setProgress(0);

                    const formData = new FormData();
                    files.forEach(
                        (file) =>
                            !file.name.endsWith(".svg") &&
                            formData.append("files", file)
                    );
                    formData.append("document_name", documentName);

                    const client = await axiosClient();
                    const response = await client.post(
                        "/ocr/upload",
                        formData,
                        {
                            withXSRFToken: true,
                            withCredentials: true,
                            onUploadProgress: (event) => {
                                if (event.total) {
                                    const percent = Math.round(
                                        (event.loaded * 100) / event.total
                                    );
                                    setProgress(percent);
                                    files.forEach((file) =>
                                        onProgress(file, percent)
                                    );
                                }
                            },
                        }
                    );

                    const res = response.data;
                    setUploadedFileId(res?.document.pk);
                    setFiles([]);
                    setDocumentName("");

                    toast.success("All files uploaded successfully!");
                } catch (error) {
                    if (error instanceof Error === false) {
                        toast.error("Upload failed", {
                            description: "Something went wrong",
                        });
                        return;
                    }
                    if (error instanceof AxiosError === false) {
                        toast.error("Upload failed", {
                            description: error.message,
                        });
                        return;
                    }
                    toast.error("Upload failed", {
                        description:
                            error?.response?.data?.detail ||
                            error.message ||
                            "Something went wrong",
                    });
                } finally {
                    setIsUploading(false);
                    setProgress(0);
                }
            },
            [documentName]
        );

    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name}" has been rejected`,
        });
    }, []);

    const totalSize = React.useMemo(() => {
        return formatFileSize(files.reduce((acc, file) => acc + file.size, 0));
    }, [files]);

    return {
        onUpload,
        isUploading,
        files,
        setFiles,
        progress,
        documentName,
        setDocumentName,
        uploadedId,
        setUploadedFileId,
        onFileReject,
        totalSize,
    };
}
