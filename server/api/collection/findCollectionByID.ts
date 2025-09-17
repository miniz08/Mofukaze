import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findCollectionByID = async (id: number) => {
  return await prisma.collection.findMany({
    where: { id: id },
  });
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = Number(query.id);

  const data = await findCollectionByID(id);

  return data;
});
