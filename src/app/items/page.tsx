import prisma from "@/lib/prisma";
import { ItemList } from "./_components/item-list";

export const metadata = {
  title: "Sistem Prediksi Penjualan - Daftar Barang",
  description: "Kelola barang Anda dengan mudah",
};

export default async function ItemsPage() {
  const items = await prisma.item.findMany();

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950">
      <ItemList items={items} />
    </div>
  );
}
