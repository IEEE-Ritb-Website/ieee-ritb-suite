
export function UploadToCloudinary(filePath: string, publicId: string): Promise<string> {
    // TODO: Separate out these logics to upload file
    // This is a mock function. In a real-world scenario, you would use Cloudinary's SDK to upload the file.
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`https://res.cloudinary.com/demo/image/upload/${publicId}`);
        }, 1000);
    });
}

export function GetCloudinaryFileUrl(publicId: string, options: { width?: number; height?: number; crop?: string } = {}): string {
    const baseUrl = "https://res.cloudinary.com/demo/image/upload/";
    const transformations = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    const transformationString = transformations.length > 0 ? transformations.join(",") + "/" : "";
    return `${baseUrl}${transformationString}${publicId}`;
}
