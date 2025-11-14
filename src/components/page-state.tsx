"use client";

import * as React from "react";
import { IconFolderCode } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

/**
 * A versatile empty state component for displaying
 * no-data or placeholder screens with optional
 * custom content and footer.
 */
interface EmptyStateProps {
    title?: string;
    description?: string;
    /** Main icon for the empty state */
    icon?: React.ReactNode;
    /** Content below the description (e.g., actions, buttons) */
    children?: React.ReactNode;
    /** Optional footer area (e.g., additional links, info) */
    footerComponent?: React.ReactNode;
    /** Additional classNames for container */
    className?: string;
}

export function EmptyState({
    title = "No data available",
    description = "There’s nothing to display here yet.",
    icon,
    children,
    footerComponent,
    className,
}: EmptyStateProps) {
    return (
        <Empty className={cn("text-center", className)}>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    {icon ?? (
                        <IconFolderCode className="h-10 w-10 text-muted-foreground" />
                    )}
                </EmptyMedia>
                {title && <EmptyTitle>{title}</EmptyTitle>}
                {description && (
                    <EmptyDescription>{description}</EmptyDescription>
                )}
            </EmptyHeader>

            {children && <EmptyContent>{children}</EmptyContent>}

            {footerComponent && (
                <div className="mt-4 flex justify-center">
                    {footerComponent}
                </div>
            )}
        </Empty>
    );
}
