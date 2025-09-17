import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createArticle = async (title: string, content: string, tag: string,subTag:string) => {
    return await prisma.article.create({
        data: {
            title: title,
            content: content,
            tag: tag,
            subTag:subTag,
        }
    });
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { title, content, tag,subTag } = body;

    try {
        const data = await createArticle(title, content, tag,subTag);
        return { status: 'success', data };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});
