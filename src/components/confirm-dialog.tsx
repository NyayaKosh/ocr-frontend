import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Variant = "default" | "destructive" | "success" | "info" | "warning";

type ConfirmModalProps<T> = {
    children?: ReactNode;
    title: string;
    message: string;
    data: T;
    variant?: Variant;
    confirmText?: string;
    cancelText?: string;
    callback?: (data: T) => void;
    cancelCallback?: (data: T) => void;
    trigger?: ReactNode;
    verify?: string;
    childrenAsTrigger?: boolean;
};

export default function ConfirmDialog<T>({
    children,
    title,
    message,
    data,
    variant = "default",
    confirmText = "Confirm",
    cancelText = "Cancel",
    callback,
    cancelCallback,
    verify,
    trigger,
    childrenAsTrigger,
}: ConfirmModalProps<T>) {
    const [open, setOpen] = useState(false);
    const [allowed, setAllowed] = useState(() => {
        if (verify) {
            return false;
        } else {
            return true;
        }
    });

    const handleConfirm = () => {
        callback?.(data);
        setOpen(false);
    };

    const handleCancel = () => {
        cancelCallback?.(data);
        setOpen(false);
    };

    const variantStyles: Record<
        Variant,
        { confirm: "default" | "destructive" | "outline"; title: string }
    > = {
        default: { confirm: "default", title: "text-foreground" },
        destructive: { confirm: "destructive", title: "text-red-600" },
        success: { confirm: "default", title: "text-green-600" },
        info: { confirm: "default", title: "text-blue-600" },
        warning: { confirm: "default", title: "text-yellow-600" },
    };

    const styles = variantStyles[variant];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {childrenAsTrigger ? children : trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className={styles.title}>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                {childrenAsTrigger ? null : children}
                {verify && (
                    <>
                        <Label>
                            Please write{" "}
                            <strong className="">&quot;{verify}&quot;</strong>{" "}
                            below to confirm.
                        </Label>
                        <Input
                            onChange={(e) => {
                                setAllowed(e.target.value === verify);
                            }}
                            placeholder={verify}
                            className="text-red-500 border-red-500"
                        />
                    </>
                )}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" onClick={handleCancel}>
                            <X /> {cancelText}
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={!allowed}
                        variant={styles.confirm}
                        onClick={handleConfirm}
                    >
                        <Trash /> {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
