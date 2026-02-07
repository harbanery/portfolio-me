import { PrismaClient } from "@prisma/client";
import { hashPassword, generateAdminPassword } from "../src/lib/auth/password";

// Use DIRECT_URL for scripts that need direct database access
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  console.log("Initializing admin account...");

  // Check if admin account already exists
  const existingAdmin = await prisma.admin.findFirst();

  if (existingAdmin) {
    console.log("Admin account already exists.");
    const response = await prompt("Do you want to reset the admin password? (yes/no): ");
    if (response?.toLowerCase() !== "yes") {
      console.log("Skipping admin password reset.");
      await prisma.$disconnect();
      return;
    }

    // Delete existing admin
    await prisma.admin.delete({
      where: { id: existingAdmin.id },
    });
    console.log("Existing admin account deleted.");
  }

  // Generate secure password
  const plainPassword = generateAdminPassword();
  console.log("\nGenerated admin password:");
  console.log("=".repeat(50));
  console.log(plainPassword);
  console.log("=".repeat(50));
  console.log("\n⚠️  IMPORTANT: Save this password securely!");
  console.log("You will need this password to login to the admin panel.");
  console.log("Make sure to store it in a password manager or secure location.\n");

  // Hash password
  const hashedPassword = await hashPassword(plainPassword);
  console.log("Password hashed successfully.");

  // Create admin account
  const admin = await prisma.admin.create({
    data: {
      password: hashedPassword,
    },
  });

  console.log("\n✅ Admin account created successfully!");
  console.log(`   Admin ID: ${admin.id}`);
  console.log(`   Created at: ${admin.createdAt}`);
  console.log("\nYou can now login at: /admin/auth");

  await prisma.$disconnect();
}

function prompt(question: string): Promise<string | undefined> {
  // Node.js doesn't have built-in prompt in all environments
  // For this script, we'll use a simple approach
  // In production, you might want to use a proper CLI library
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

main()
  .catch((e) => {
    console.error("Error initializing admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
