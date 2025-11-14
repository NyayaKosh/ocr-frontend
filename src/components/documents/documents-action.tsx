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
import { useMutation } from "@tanstack/react-query";
import { mutateData } from "@/utils/fetch-data";
import toast from "react-hot-toast";

export function DocumentAction(props: CellContext<DocumentType, unknown>) {
    const { pk, title } = props.row.original;

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

            const response = await client.get(
                `/ocr/documents/${id}/download/`,
                {
                    responseType: "blob",
                    onDownloadProgress: (event) => {
                        if (event.total) {
                            const percent = Math.round(
                                (event.loaded * 100) / event.total
                            );
                            setProgress(percent);
                        }
                    },
                }
            );

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const disposition = response.headers["content-disposition"];
            const fileName =
                disposition && disposition.includes("filename=")
                    ? disposition.split("filename=")[1].replace(/"/g, "")
                    : `${filename}.pdf`;

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
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
