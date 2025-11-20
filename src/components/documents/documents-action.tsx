import { ChevronDownIcon, Download, Loader2, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@radix-ui/react-progress";
import { axiosClient } from "@/utils/axios-handler";
import React from "react";
import { CellContext } from "@tanstack/react-table";
import { DocumentType } from "@/types/documets";
import ConfirmDialog from "../confirm-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutateData } from "@/utils/fetch-data";
import toast from "react-hot-toast";
import { QueryKeys } from "@/utils/QueryKeys";
// import { revalidatePath } from "next/cache";

export function DocumentAction(props: CellContext<DocumentType, unknown>) {
    const { pk, title } = props.row.original;
    const client = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (id: number) => {
            toast.loading(`${title} is deleting.`, { id: title });
            return mutateData({
                url: `/ocr/documents/${id}/`,
                method: "DELETE",
            });
        },
        onSuccess() {
            toast.success(`${title} is deleted successfully.`);
            client.invalidateQueries({ queryKey: [QueryKeys.DOCUMENTS] });
            // revalidatePath("/documents", "page");
        },
        onError() {
            toast.error(`Failed to delete ${title}`);
        },
        onSettled() {
            toast.dismiss(title);
        },
    });

    return (
        <ButtonGroup>
            <DownloadFile {...props} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="!pl-2">
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="[--radius:1rem]">
                    <DropdownMenuGroup>
                        <ConfirmDialog
                            callback={mutate}
                            data={pk}
                            variant="destructive"
                            title="Delete Document"
                            message="Are you sure you want to delete this document? This action cannot be undone."
                            childrenAsTrigger={true}
                        >
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                variant="destructive"
                            >
                                <TrashIcon />
                                Delete Document
                            </DropdownMenuItem>
                        </ConfirmDialog>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    );
}

const DownloadFile = ({ row }: CellContext<DocumentType, unknown>) => {
    const id = row.getValue("pk") as string;
    const filename = (row.getValue("title") as string)
        .trim()
        .replaceAll(" ", "-");

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
        >
            <Download className="h-4 w-4" />
            Download
        </Button>
    );
};
