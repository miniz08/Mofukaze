import { PrismaClient } from '@prisma/client';
import { readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, title, content } = body;

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        title: String(title),
        content:String(content)
      },
    });
    return { status: 'success', data: updatedArticle };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
});
