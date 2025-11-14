import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentTableSkeleton() {
    const columns = 8;
    const row = 9;

    return (
        <div className="w-full p-6">
            <div className="overflow-hidden rounded-md border transition-all">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-8 w-full" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Array.from({ length: row }).map((_, rowIdx) => (
                            <TableRow key={rowIdx}>
                                {Array.from({ length: columns }).map(
                                    (_, cellIdx) => (
                                        <TableCell key={cellIdx}>
                                            <Skeleton className="h-10 w-full" />
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
