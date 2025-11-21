"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileWarning, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchQuery } from "@/utils/query.hook";
import { DocumentStatusType } from "@/types/documets";
import { QueryKeys } from "@/utils/QueryKeys";
import { Presence } from "./presence";
import UploadedInfoCard from "./uploaded-info-card";

export function FileProgress({
    uploadedId,
    callback,
}: {
    uploadedId: string;
    callback: (result: DocumentStatusType[]) => void;
}) {
    const [isChecking, setChecking] = React.useState(false);
    const [isCheckFailed, setCheckFailed] = React.useState(false);

    const { data = [] } = useFetchQuery<DocumentStatusType[]>({
        queryKey: [QueryKeys.DOCUMENT_STATUS, uploadedId],
        url: `/ocr/document-status/${uploadedId}`,
        options: {
            enabled: !!uploadedId,
            refetchInterval(query) {
                if (query?.state.error) {
                    setChecking(false);
                    setCheckFailed(true);
                    return false;
                }

                const res = query?.state?.data;
                if (!res) {
                    setChecking(false);
                    return false;
                }

                const status = res[res.length - 1].status;
                if (["SUCCESS", "FAILED", "ERROR"].includes(status)) {
                    setChecking(false);
                    if (["FAILED", "ERROR"].includes(status)) {
                        setCheckFailed(true);
                    }
                    return false;
                }

                setChecking(true);
                return 3000;
            },
            refetchIntervalInBackground: true,
        },
    });

    const currentStatus = data[data.length - 1]?.status;
    return (
        <Presence present={!!uploadedId}>
            <div
                data-state={!!uploadedId ? "open" : "closed"}
                className="mt-6 flex flex-col gap-5 w-full max-w-2xl mx-auto data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in px-4"
            >
                {currentStatus !== "SUCCESS" && (
                    <>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
                            Document Processing Status
                        </h4>

                        <div className="relative border-gray-200 dark:border-gray-700 pl-6">
                            <AnimatePresence>
                                {data?.map((item) => (
                                    <motion.div
                                        key={item.status}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="relative flex items-center gap-3 mb-4"
                                    >
                                        <div
                                            className={cn(
                                                "absolute -left-[1.15rem] w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                                "bg-green-500 border-green-500 text-white"
                                            )}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 ms-3">
                                            {item.status}
                                        </p>
                                    </motion.div>
                                ))}

                                {isChecking && (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="relative flex items-center gap-3 mb-4"
                                    >
                                        <div className="absolute -left-[1.15rem] w-6 h-6 rounded-full flex items-center justify-center border-2 border-blue-500 text-blue-500 animate-pulse">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 ms-3">
                                            Processing...
                                        </p>
                                    </motion.div>
                                )}

                                {isCheckFailed && (
                                    <motion.div
                                        key="failed"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="relative flex items-center gap-3 mb-4"
                                    >
                                        <div className="absolute -left-[1.15rem] w-6 h-6 rounded-full flex items-center justify-center border-2 border-red-500 text-red-500">
                                            <FileWarning className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                                Failed to process document
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {!isChecking &&
                                    !isCheckFailed &&
                                    data.length === 0 && (
                                        <motion.div
                                            key="pending"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative flex items-center gap-5"
                                        >
                                            <div className="absolute -left-[1.15rem] w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-400 text-gray-500">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <p className="text-sm text-gray-500 ms-3">
                                                Waiting to start processing...
                                            </p>
                                        </motion.div>
                                    )}
                            </AnimatePresence>
                        </div>

                        {currentStatus && currentStatus !== "SUCCESS" && (
                            <div
                                className={cn(
                                    "rounded-xl px-4 py-3 text-sm font-medium text-center shadow-sm transition-colors",
                                    currentStatus === "FAILED" ||
                                        currentStatus === "ERROR"
                                        ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800"
                                        : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
                                )}
                            >
                                {currentStatus === "FAILED" ||
                                currentStatus === "ERROR"
                                    ? "❌ Something went wrong while processing your document."
                                    : "⏳ Document is being processed..."}
                            </div>
                        )}
                    </>
                )}

                {currentStatus === "SUCCESS" && (
                    <UploadedInfoCard
                        callback={callback}
                        documentId={uploadedId}
                    />
                )}
            </div>
        </Presence>
    );
}
