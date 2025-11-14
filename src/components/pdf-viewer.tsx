"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export function PDFViewer({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number>(0);

    return (
        <div className="flex flex-col items-center p-4">
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
}
