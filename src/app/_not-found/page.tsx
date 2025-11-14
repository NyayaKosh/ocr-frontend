import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-3xl w-full text-center py-20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 mx-auto shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
                        <path d="M7 9V7a5 5 0 0 1 9.9-1" />
                        <path d="M17 11l4 4" />
                        <circle cx="11" cy="13" r="3" />
                    </svg>
                </div>

                <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                    404
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                    We can&apos;t find the page you&apos;re looking for.
                </p>

                <p className="max-w-xl mx-auto text-sm text-gray-500 dark:text-gray-400 mb-8">
                    The link may be broken, the page may have moved, or it may
                    never have existed. Try going back to the homepage or reach
                    out if you think this is a mistake.
                </p>

                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-transform text-white px-4 py-2 font-medium shadow"
                    >
                        Home
                    </Link>

                    <Link
                        href="/contact-us"
                        className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        Contact us
                    </Link>
                </div>

                <div className="mt-12">
                    <svg
                        viewBox="0 0 878 250"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full max-w-2xl mx-auto opacity-80"
                        aria-hidden="true"
                    >
                        <rect
                            x="0"
                            y="0"
                            width="878"
                            height="250"
                            rx="20"
                            fill="#EEF2FF"
                        />
                        <g transform="translate(40,36)">
                            <rect
                                x="0"
                                y="0"
                                width="220"
                                height="150"
                                rx="8"
                                fill="#fff"
                                stroke="#E6E9F2"
                            />
                            <rect
                                x="16"
                                y="18"
                                width="188"
                                height="12"
                                rx="6"
                                fill="#EEF2FF"
                            />
                            <rect
                                x="16"
                                y="40"
                                width="120"
                                height="10"
                                rx="5"
                                fill="#F3F4F6"
                            />
                            <rect
                                x="16"
                                y="60"
                                width="160"
                                height="10"
                                rx="5"
                                fill="#F3F4F6"
                            />
                            <rect
                                x="16"
                                y="80"
                                width="80"
                                height="10"
                                rx="5"
                                fill="#F3F4F6"
                            />

                            <g transform="translate(260,20)">
                                <circle
                                    cx="70"
                                    cy="56"
                                    r="56"
                                    fill="#fff"
                                    stroke="#E6E9F2"
                                />
                                <path
                                    d="M40 56c0-17 13-30 30-30s30 13 30 30-13 30-30 30-30-13-30-30z"
                                    fill="#EDE9FE"
                                />
                                <path
                                    d="M86 86l40 40"
                                    stroke="#C7D2FE"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="12"
                                    fill="#C7D2FE"
                                />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </main>
    );
}
