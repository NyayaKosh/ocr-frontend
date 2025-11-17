import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomNavbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import OneTapComponent from "@/components/one-tap-login";
import RootQueryClient from "@/utils/query-client";
import { cn } from "@/lib/utils";
import Image from "next/image";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: {
        default: "Nyayakosh | Smart OCR | Scan & Convert Documents Easily",
        template: "%s | Smart OCR",
    },
    description:
        "Upload or scan your documents instantly and convert them into searchable OCR PDFs. Fast, accurate, and privacy-focused OCR for your business and personal use.",
    keywords: [
        "OCR",
        "document scanner",
        "image to text",
        "PDF converter",
        "text extraction",
        "AI OCR tool",
    ],
    authors: [{ name: "Smart OCR Team", url: "https://nyayakosh.com" }],
    metadataBase: new URL("https://nyayakosh.com"),
    openGraph: {
        title: "Smart OCR | Scan & Convert Documents Easily",
        description:
            "Convert scanned images into searchable text. Upload or scan directly from your device.",
        url: "https://nyayakosh.com",
        siteName: "Smart OCR",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Smart OCR Dashboard",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Smart OCR | Fast Document Conversion",
        description:
            "Turn your scanned documents into searchable text with Smart OCR.",
        creator: "@nyayakosh",
        images: ["/logo-sm.png"],
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/logo-sm.png",
    },
    manifest: "/site.webmanifest",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    alternates: {
        canonical: "https://nyayakosh.com",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
            </head>
            <body
                className={cn(
                    geistSans.variable,
                    geistMono.variable,
                    "antialiased bg-linear-to-b from-white via-gray-50 to-gray-100 text-gray-900 min-h-screen flex flex-col"
                )}
            >
                {/* Navbar */}
                <header className="sticky top-0 z-40 backdrop-blur-md border-b">
                    <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                        <CustomNavbar />
                    </div>
                </header>

                {/* Main content */}
                <RootQueryClient>
                    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <OneTapComponent />
                        {children}
                    </main>
                </RootQueryClient>

                {/* Footer */}
                <footer className="border-t border-gray-200 py-4 mt-auto bg-white/50">
                    <div className="container mx-auto text-sm text-gray-500 flex items-center justify-between gap-4">
                        <div className="">
                            <Image
                                src="/logo.png"
                                alt="Nyayakosh"
                                width={120}
                                height={40}
                                priority
                            />
                        </div>
                        <div className="">
                            © {new Date().getFullYear()} Nyayakosh. All rights
                            reserved.
                        </div>
                    </div>
                </footer>

                {/* Toast notifications */}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    }}
                />

                {/* Schema Markup */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "nyayakosh",
                            url: "https://nyayakosh.com",
                            logo: "https://nyayakosh.com/logo.png",
                            sameAs: [
                                "https://twitter.com/nyayakosh",
                                "https://linkedin.com/company/nyayakosh",
                            ],
                        }),
                    }}
                />
            </body>
        </html>
    );
}
