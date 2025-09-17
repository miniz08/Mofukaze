import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteCollection = async (id:number) => {
    return await prisma.collection.delete({
        where: {
          id: id // 这里的 `id` 是要删除的记录的唯一标识符
          }
    });
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id } = body;

    try {
        const data = await deleteCollection(id);
        return { status: 'success', data };
c  } catch (error) {
        return { status: 'error', message: error.message };
    }
});