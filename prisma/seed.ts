import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

import "dotenv/config";

const prisma = new PrismaClient();

async function seed() {
  const salt = bcrypt.genSaltSync(
    parseInt(process.env.BCRYPT_SALT as string) || 10
  );
  const passwordHash = bcrypt.hashSync("superadmin", salt);

  await prisma.user.upsert({
    where: {
      email: "superadmin@gmail.com",
    },
    update: {},
    create: {
      email: "superadmin@gmail.com",
      name: "Super Admin",
      status: "active",
      password: passwordHash,
      role: "superadmin",
    },
  });
}

seed()
  .then(async () => {
    console.log("Database seeded.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
