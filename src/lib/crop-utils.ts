export type PixelCrop = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop,
    rotation = 0
): Promise<string> {
    const image = await createImage(imageSrc);
    const radians = (rotation * Math.PI) / 180;

    // Create a canvas large enough to handle rotation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(radians);
    ctx.translate(-safeArea / 2, -safeArea / 2);
    ctx.drawImage(
        image,
        safeArea / 2 - image.width / 2,
        safeArea / 2 - image.height / 2
    );

    // Extract cropped image data
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // Create a new canvas exactly sized to the crop box
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    const croppedCtx = croppedCanvas.getContext("2d")!;
    // Ensure transparency (no black padding)
    croppedCtx.putImageData(data, 0, 0);

    // Export as PNG (preserves transparency)
    return croppedCanvas.toDataURL("image/png");
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (err) => reject(err));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });
}

export const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime || "image/png" });
};
