import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findArticleByID = async (id: number) => {
  return await prisma.article.findMany({
    where: { id: id },
  });
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = Number(query.id);

  const data = await findArticleByID(id);

  return data;
});
