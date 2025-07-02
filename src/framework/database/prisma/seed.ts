import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Paulo Henrique Maia",
      email: "paulo.maia@example.com",
      password: "securepassword",
      role: Role.professor,
    },
  });

  const students = [
    { name: "Emerson Lucena", email: "emerson.lucena@example.com" },
    { name: "Lucas Ivisson", email: "lucas.ivisson@example.com" },
    { name: "Jamille Hellen", email: "jamille.hellen@example.com" },
    { name: "Yaslim Soares", email: "yaslim.soares@example.com" },
  ];

  for (const student of students) {
    await prisma.user.create({
      data: {
        name: student.name,
        email: student.email,
        password: "securepassword",
        role: Role.student,
      },
    });
  }

  console.log("✅ Database seeded successfully 🎉");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
