import { ChevronDownIcon, FileText, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { CellContext } from "@tanstack/react-table";
import { DocumentType } from "@/types/documets";
import ConfirmDialog from "../confirm-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutateData } from "@/utils/fetch-data";
import toast from "react-hot-toast";
import { QueryKeys } from "@/utils/QueryKeys";
import DownloadFile from "./document-download";
import DocumentView from "./document-viewver";

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
            <DownloadFile id={pk} title={title} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="pl-2!">
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DocumentView documentId={pk}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileText />
                            Open Document
                        </DropdownMenuItem>
                    </DocumentView>

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
