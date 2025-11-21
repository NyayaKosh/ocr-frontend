import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@radix-ui/react-progress";
import { axiosClient } from "@/utils/axios-handler";
import React from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function DownloadFile({
    id,
    title,
    className,
}: {
    id: number;
    title: string;
    className?: string;
}) {
    const filename = title.trim().replaceAll(" ", "-");

    const [downloading, setDownloading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            setProgress(0);

            const client = await axiosClient();

            // Step 1: Get the signed URL from the API
            const urlResponse = await client.get(
                `/ocr/documents/${id}/download/`
            );

            // Check if file is available
            if (urlResponse.status === 202) {
                // File not available (still processing or deleted)
                throw new Error(
                    urlResponse.data.message ||
                        "File is not available yet. Please try again later."
                );
            }

            const { download_url, filename: serverFilename } = urlResponse.data;

            if (!download_url) {
                throw new Error("No download URL provided");
            }

            setProgress(25);

            // Step 2: Download the file directly from the signed S3 URL
            // Use fetch to download directly from S3 (bypasses CORS since it's a signed URL)
            const fileResponse = await fetch(download_url, {
                method: "GET",
            });

            if (!fileResponse.ok) {
                if (fileResponse.status === 404) {
                    throw new Error(
                        "File not found in storage. It may have been deleted or not processed yet."
                    );
                }
                throw new Error(
                    `Download failed with status ${fileResponse.status}`
                );
            }

            setProgress(75);
            const blob = await fileResponse.blob();
            setProgress(90);

            // Step 3: Create download link
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;

            const fileName = serverFilename || `${filename}.pdf`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);

            setProgress(100);
            toast.success("Download completed successfully!");
        } catch (error) {
            console.error("Download failed:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Download failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setDownloading(false);
            setProgress(0);
        }
    };

    if (downloading) {
        return (
            <Button variant="outline" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
                {progress > 0 ? `${progress}%` : "Downloading..."}
                {downloading && progress > 0 && progress < 100 && (
                    <div className="w-24">
                        <Progress value={progress} className="h-1" />
                    </div>
                )}
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            onClick={handleDownload}
            disabled={downloading}
            className={cn(className)}
        >
            <Download className="h-4 w-4" />
            Download
        </Button>
    );
}
