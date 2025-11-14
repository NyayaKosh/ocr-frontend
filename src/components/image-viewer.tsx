import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export function ImageViewer({
    file,
    children,
}: {
    file: File;
    children: React.ReactNode;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[44rem] sm:h-[44rem]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative w-full h-[32rem]">
                    <Image
                        src={URL.createObjectURL(file)}
                        alt="Uploaded Image"
                        fill
                        className="object-contain rounded-md"
                    />
                </div>
                {/* <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
}
