import bcrypt from "bcryptjs";
import { prisma } from "../prisma/prisma.js";

const email = process.argv[2] || "admin@nursenourish.co.ke";
const password = process.argv[3] || "Admin@1234";

const hash = await bcrypt.hash(password, 10);

const user = await prisma.user.upsert({
  where: { email },
  update: { role: "SUPER_ADMIN", passwordHash: hash },
  create: {
    email,
    firstName: "Admin",
    lastName: "NurseNourish",
    passwordHash: hash,
    role: "SUPER_ADMIN",
  },
});

console.log(`✓ Admin user ready: ${user.email} (role: ${user.role})`);
console.log(`  Password: ${password}`);
await prisma.$disconnect();
