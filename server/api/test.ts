import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getFindMany = async () => {
    return await prisma.user.findMany();
};

export default defineEventHandler(async (event) => {
    const data = await getFindMany();
    return data;
});