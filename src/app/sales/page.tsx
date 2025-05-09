import prisma from "@/lib/prisma";
import { SalesList } from "./_components/sales-list";

export const metadata = {
  title: "Sistem Prediksi Penjualan - Daftar Penjualan",
  description: "Kelola barang Anda dengan mudah",
};

export default async function SalesPage() {
  const [sales, items] = await Promise.all([
    prisma.sale.findMany({
      include: {
        item: true,
      },
      orderBy: {
        week: "asc",
      },
    }),
    prisma.item.findMany(),
  ]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950">
      <SalesList sales={sales} items={items} />
    </div>
  );
}
