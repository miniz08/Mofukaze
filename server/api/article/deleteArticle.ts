import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteArticle = async (id:number) => {
    return await prisma.article.delete({
        where: {
            id: id // 这里的 `id` 是要删除的记录的唯一标识符
          }
    });
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id } = body;

    try {
        const data = await deleteArticle(id);
        return { status: 'success', data };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});