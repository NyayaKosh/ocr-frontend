export type DocumentStatusType = {
    document: number;
    status: string;
    updated_at: string;
    message: string;
}

export type DocumentType = {
    file: string;
    pk: number;
    title: string;
    is_processed: boolean;
    total_pages: number;
    uploaded_at: string;
    file_stage: string;
}