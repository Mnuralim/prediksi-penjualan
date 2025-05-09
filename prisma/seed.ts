import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = "xxx";
  const password = "xx";
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Admin created");

  return await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashPassword,
      name: "Admin",
    },
  });
}

async function createItems(adminId: string) {
  const items = [
    {
      name: "Semen Portland 50kg",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 150,
      price: 75000,
      category: "bahan-bangunan",
    },
    {
      name: "Bata Merah Standar",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 2000,
      price: 1200,
      category: "bahan-bangunan",
    },
    {
      name: "Cat Tembok Interior 5kg",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 75,
      price: 125000,
      category: "cat-finishing",
    },
    {
      name: "Pipa PVC 4inch 4m",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 120,
      price: 85000,
      category: "lantai-dinding",
    },
    {
      name: "Kabel NYM 3x2.5mm 50m",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 40,
      price: 375000,
      category: "lantai-dinding",
    },
    {
      name: "Keramik Lantai 40x40cm",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 500,
      price: 45000,
      category: "lantai-dinding",
    },
    {
      name: "Paku 5cm 1kg",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 100,
      price: 25000,
      category: "perangkat-keras",
    },
    {
      name: "Sekrup Gypsum 1inch 100pcs",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 200,
      price: 15000,
      category: "perangkat-keras",
    },
    {
      name: "Thinner A 1L",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 60,
      price: 35000,
      category: "cat-finishing",
    },
    {
      name: "Kuas Cat 4inch",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 80,
      price: 18000,
      category: "cat-finishing",
    },
    {
      name: "Bor Listrik 10mm",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 15,
      price: 450000,
      category: "alat-pertukangan",
    },
    {
      name: "Kunci Inggris 12inch",
      photo:
        "https://ik.imagekit.io/ctvvdwhk0/sales-prediction/items/AAA-1746185456566_SaIwzh6Rz",
      stock: 25,
      price: 125000,
      category: "alat-pertukangan",
    },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: {
        name: item.name,
        photo: item.photo,
        stock: item.stock,
        price: item.price,
        category: item.category,
        adminId,
      },
    });
  }

  console.log("Items created");

  const createdItems = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  return createdItems;
}

async function createSales(itemId: string, adminId: string) {
  const salesData = [
    { week: 1, quantity: 89 },
    { week: 2, quantity: 95 },
    { week: 3, quantity: 85 },
    { week: 4, quantity: 75 },
    { week: 5, quantity: 86 },
    { week: 6, quantity: 100 },
    { week: 7, quantity: 120 },
    { week: 8, quantity: 95 },
    { week: 9, quantity: 80 },
    { week: 10, quantity: 92 },
    { week: 11, quantity: 92 },
    { week: 12, quantity: 88 },
    { week: 13, quantity: 90 },
  ];

  for (const sale of salesData) {
    await prisma.sale.create({
      data: {
        week: sale.week,
        quantity: sale.quantity,
        itemId,
        adminId,
      },
    });
  }

  console.log("Sales data created for one item");
}

async function main() {
  const admin = await createAdmin();
  const items = await createItems(admin.id);
  await createSales(items[0].id, admin.id);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
