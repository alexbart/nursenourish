import { prisma } from "./prisma/prisma.js";

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;

    console.log("Database connected");
    console.log(result);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();