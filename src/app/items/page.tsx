import { ItemList } from "./_components/item-list";
import { getSession } from "@/actions/session";
import { getItems } from "@/actions/item";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Sistem Prediksi Penjualan - Daftar Barang",
  description: "Kelola barang Anda dengan mudah",
};

export default async function ItemsPage() {
  const [items, session] = await Promise.all([getItems(), getSession()]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950">
      <ItemList items={items} role={session?.role} />
    </div>
  );
}
