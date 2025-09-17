import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCollection = async (title: string, content: string, tag: string,imageUrl:string) => {
    return await prisma.collection.create({
        data: {
            title: title,
            content: content,
            tag: tag,
            imageUrl:imageUrl,
        }
    });
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { title, content, tag,imageUrl } = body;

    try {
        const data = await createCollection(title, content, tag, imageUrl);
        return { status: 'success', data };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});
