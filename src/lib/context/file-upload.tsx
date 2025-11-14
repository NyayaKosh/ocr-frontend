import React, { createContext, Dispatch } from "react";

export interface FileUploadContextValue {
    files: File[];
    setFiles: Dispatch<React.SetStateAction<File[]>>;
}

export const FileUploadContext = createContext<FileUploadContextValue | null>(
    null
);

export function useFileUploadContext() {
    const context = React.useContext(FileUploadContext);
    if (!context) {
        throw new Error(
            "useFileUploadContext must be used within a FileUploadProvider"
        );
    }
    return context;
}
