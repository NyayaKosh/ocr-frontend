import { useFetchQuery } from "@/utils/query.hook";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "./ui/card";
import { motion } from "framer-motion";
import { CheckCircle, PartyPopper, X } from "lucide-react";
import React from "react";
import { QueryKeys } from "@/utils/QueryKeys";
import { DocumentStatusType, DocumentType } from "@/types/documets";
import { Button } from "./ui/button";
import Link from "next/link";
import DownloadFile from "./documents/document-download";

const documentStages = ["Searchable", "Indexing", "Bookmarking"];

export default function UploadedInfoCard({
    documentId,
    callback,
}: {
    documentId: string;
    callback: (result: DocumentStatusType[]) => void;
}) {
    const { data: documentDetails } = useFetchQuery<DocumentType>({
        queryKey: [QueryKeys.DOCUMENTS, documentId],
        url: `/ocr/documents/${documentId}/`,
    });

    const documentName = documentDetails?.title || "Document";
    const totalPages = documentDetails?.total_pages || 0;
    const uploadedAt = documentDetails?.uploaded_at || 0;

    const date = new Date(uploadedAt);
    const uploadedAtFormatted = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    return (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 120,
            }}
            className="w-full"
        >
            <Card className="shadow-none">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 rounded-full bg-green-100 dark:bg-green-900/40">
                                <PartyPopper className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-green-900 dark:text-green-100">
                                    Document Processed Successfully! ✨
                                </CardTitle>
                                <CardDescription className="text-green-700/70 dark:text-green-400/70 mt-1">
                                    Your document is ready download
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="">
                    <div className="mb-6">
                        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Things we have done
                        </h5>
                        <div className="space-y-2">
                            {documentStages?.map((item, idx) => (
                                <motion.div
                                    key={`${item}-${idx}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: idx * 0.1,
                                    }}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Document Details */}
                    <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border dark:border-green-900/30 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Document Name
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white wrap-break-word">
                                    {documentName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Total Pages
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {totalPages}{" "}
                                    {totalPages === 1 ? "page" : "pages"}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Processed On
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {uploadedAtFormatted}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-between  gap-3 flex-col sm:flex-row">
                    <Button
                        onClick={() => callback([])}
                        variant="ghost"
                        className=""
                    >
                        <X className="w-4 h-4 gap-1" />
                        Close
                    </Button>
                    <div className=" flex items-center gap-2">
                        <Link href={`/documents`}>
                            <Button
                                // onClick={handleViewDocument}
                                variant="ghost"
                                className=""
                            >
                                <PartyPopper className="w-4 h-4 gap-2" />
                                View Document
                            </Button>
                        </Link>
                        <DownloadFile
                            id={Number(documentId)}
                            title={documentName}
                        />
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
