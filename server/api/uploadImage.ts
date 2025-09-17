import { readBody } from 'h3';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

export default async (req) => {
  try {
    const body = await readBody(req); // Parse the request body
    const { image, title } = body;

    if (!image || !title) {
      return { statusCode: 400, status: 'fail', message: 'Missing image or title' };
    }

    // Ensure title is safe for use in file paths
    const safeTitle = title.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '_');

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const filePath = resolve(`D:\\web\\I Cant get no\\nuxt3+prisma - 副本\\public\\img\\cover\\${safeTitle}.jpeg`);

    await writeFile(filePath, Buffer.from(base64Data, 'base64'));

    return { status: 'success', message: 'Image uploaded successfully', filePath };
  } catch (err) {
    console.error('Error saving the image:', err);
    return { statusCode: 500, status: 'fail', message: 'Error saving the image' };
  }
};
 