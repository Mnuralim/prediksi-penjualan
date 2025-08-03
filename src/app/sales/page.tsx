import { SalesList } from "./_components/sales-list";
import { getSession } from "@/actions/session";
import { getSales } from "@/actions/sales";
import { getItems } from "@/actions/item";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Sistem Prediksi Penjualan - Daftar Penjualan",
  description: "Kelola barang Anda dengan mudah",
};

export default async function SalesPage() {
  const [sales, items, session] = await Promise.all([
    getSales(),
    getItems(),
    getSession(),
  ]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950">
      <SalesList sales={sales} items={items} role={session?.role} />
    </div>
  );
}
