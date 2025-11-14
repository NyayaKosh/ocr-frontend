"use client";

import { Upload, ScanLineIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-6 py-12 sm:px-10 lg:px-16 bg-gradient-to-b from-white via-gray-50 to-gray-100">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
                >
                    OCR Your Documents Effortlessly
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-gray-600 text-base sm:text-lg leading-relaxed"
                >
                    Upload or scan documents instantly to extract text using
                    AI-powered OCR. Create searchable, editable PDFs in seconds.
                </motion.p>
            </section>

            {/* Action Cards */}
            <section
                className="grid w-full max-w-4xl gap-8 sm:grid-cols-1 md:grid-cols-2 mb-16"
                aria-label="Document Options"
            >
                {/* Upload Card */}
                <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Link href="/document-upload" aria-label="Upload Document">
                        <div className="group border border-gray-200 bg-white hover:border-primary hover:shadow-md transition-all duration-200 rounded-2xl p-8 flex flex-col items-center text-center h-full">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-300 group-hover:border-primary mb-4">
                                <Upload className="size-7 text-gray-500 group-hover:text-primary transition-colors" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Upload Images
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Upload scanned images to create searchable PDFs
                                and add bookmarks.
                            </p>
                            <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                Start Upload
                                <ChevronRight className="size-4 ml-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Link href="/document-scan" aria-label="Scan Document">
                        <div className="group border border-gray-200 bg-white hover:border-primary hover:shadow-md transition-all duration-200 rounded-2xl p-8 flex flex-col items-center text-center h-full">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mb-4">
                                <ScanLineIcon className="size-7 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Scan your Documents
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Use your device’s camera to scan documents
                                directly. Ensure good lighting for the best OCR
                                results.
                            </p>
                            <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                                Start Scanning
                                <ChevronRight className="size-4 ml-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
        </main>
    );
}
