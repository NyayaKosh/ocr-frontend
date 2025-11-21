import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { DocumentType } from "@/types/documets";
import { useFetchQuery } from "@/utils/query.hook";
import { QueryKeys } from "@/utils/QueryKeys";
import React from "react";
import DownloadFile from "./document-download";
import { FileText, Calendar, SquareArrowOutUpRightIcon, X } from "lucide-react";
import Link from "next/link";

export default function DocumentView({
    documentId,
    children,
}: {
    documentId: number;
    children: React.ReactNode;
}) {
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const { data: documentDetails, refetch } = useFetchQuery<DocumentType>({
        queryKey: [QueryKeys.DOCUMENTS, documentId],
        url: `/ocr/documents/${documentId}/`,
        options: {
            enabled: isOpen,
            staleTime: 50000,
        },
    });

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            refetch();
        }
        if (!open) {
            setIsFullscreen(false);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds < 60) return "just now";
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;

            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year:
                    date.getFullYear() !== now.getFullYear()
                        ? "numeric"
                        : undefined,
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                className={`flex flex-col gap-0 p-0 border-0 transition-all duration-300 ${
                    isFullscreen
                        ? "w-screen h-screen max-w-none"
                        : "w-4xl min-w-3xl md:w-[600px] lg:w-[800px] xl:w-[900px] 2xl:w-[1000px] h-screen"
                }`}
            >
                <SheetHeader className=" border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-start justify-between w-full gap-4">
                        <div className="flex-1 min-w-0">
                            <SheetTitle className="text-xl truncate">
                                {documentDetails?.title || "Document"}
                            </SheetTitle>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FileText className="w-4 h-4 shrink-0" />
                                    <span>
                                        {documentDetails?.total_pages || 0}{" "}
                                        pages
                                    </span>
                                </div>
                                {documentDetails?.uploaded_at && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 shrink-0" />
                                        <span>
                                            {formatDate(
                                                documentDetails.uploaded_at
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div
                    className={`flex-1 overflow-hidden ${
                        isFullscreen ? "p-4" : "p-4"
                    }`}
                >
                    <div
                        className={`w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-sm ${
                            isFullscreen ? "" : ""
                        }`}
                    >
                        <iframe
                            src={documentDetails?.file}
                            className="w-full h-full border-0"
                            title={documentDetails?.title || "Document Viewer"}
                        />
                    </div>
                </div>

                <SheetFooter className=" border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between w-full gap-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {documentDetails?.is_processed ? (
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                    Processed
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                    Processing
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={documentDetails?.file || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="ghost">
                                    <SquareArrowOutUpRightIcon /> Open new tab
                                </Button>
                            </Link>
                            <DownloadFile
                                id={documentId}
                                title={documentDetails?.title || "Document"}
                            />
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
