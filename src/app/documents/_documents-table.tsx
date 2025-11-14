"use client";

import * as React from "react";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    CheckCircle2Icon,
    XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DocumentType } from "@/types/documets";
import { CheckCircle2, Loader2, XCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/page-state";
import { DocumentAction } from "@/components/documents/documents-action";

export const columns: ColumnDef<DocumentType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        accessorKey: "pk",
        header: "ID",
        cell: ({ row }) => <div>{row.getValue("pk")}</div>,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Title
                {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "file_stage",
        header: "Stage",
        cell: ({ row }) => {
            const stage = row.getValue("file_stage") as string;

            const stageMap: Record<
                string,
                { label: string; icon: React.ReactNode; className: string }
            > = {
                UPLOADED: {
                    label: "Uploaded",
                    icon: (
                        <ArrowUpCircle className="h-4 w-4 mr-1 text-blue-500" />
                    ),
                    className: "bg-blue-100 text-blue-700 border-blue-300",
                },
                PROCESSING: {
                    label: "Processing",
                    icon: (
                        <Loader2 className="h-4 w-4 mr-1 text-yellow-500 animate-spin" />
                    ),
                    className:
                        "bg-yellow-100 text-yellow-700 border-yellow-300",
                },
                COMPLETED: {
                    label: "Completed",
                    icon: (
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                    ),
                    className: "bg-green-100 text-green-700 border-green-300",
                },
                FAILED: {
                    label: "Failed",
                    icon: <XCircle className="h-4 w-4 mr-1 text-red-600" />,
                    className: "bg-red-100 text-red-700 border-red-300",
                },
            };

            const { label, icon, className } =
                stageMap[stage] ??
                ({
                    label: stage,
                    icon: null,
                    className: "bg-gray-100 text-gray-700 border-gray-300",
                } as const);

            return (
                <Badge
                    variant="outline"
                    className={`flex items-center px-2 py-1 text-xs font-medium rounded-full border ${className}`}
                >
                    {icon}
                    {label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "is_processed",
        header: "Processed",
        cell: ({ row }) => {
            const isProcessed = row.getValue("is_processed") as boolean;
            return (
                <div
                    className={
                        isProcessed
                            ? "text-green-600/70 font-medium"
                            : "text-red-500/70 font-medium"
                    }
                >
                    {isProcessed ? <CheckCircle2Icon /> : <XCircleIcon />}
                </div>
            );
        },
    },
    {
        accessorKey: "total_pages",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Pages
                {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-start">{row.getValue("total_pages")}</div>
        ),
    },
    {
        accessorKey: "uploaded_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Uploaded At
                {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("uploaded_at") as string);
            return <div>{date.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "file",
        header: "File",
        cell: (context) => <DocumentAction {...context} />,
    },
];

export default function DocumentTable({ data }: { data: DocumentType[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,

        state: {
            sorting,
            rowSelection,
        },
    });
    // const selectedDocs = table
    //     .getSelectedRowModel()
    //     .rows.map((r) => r.original);

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-md border transition-all">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <EmptyState title="No documents found." />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

