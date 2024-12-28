import { v2 as cloudinary } from 'cloudinary';

export const CloudUpload = async (fileUrl: string | undefined): Promise<string> => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_URL,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!fileUrl) {
        throw new Error("File URL is undefined or empty.");
    }

    const uploadResult = await cloudinary.uploader.upload(fileUrl);

    const generatedUrl: string = await cloudinary.url(uploadResult?.public_id, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto",
            },
            {
                width: 1200,
                height: 1200,
            }
        ]
    })
    return generatedUrl;
};