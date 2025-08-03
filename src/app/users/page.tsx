import { getSession } from "@/actions/session";
import { UserList } from "./_components/user-list";
import { getAllUser } from "@/actions/user";

export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Sistem Prediksi Penjualan - Daftar Pengguna",
  description: "Kelola data pengguna dengan mudah",
};

export default async function UserPage() {
  const [users, session] = await Promise.all([getAllUser(), getSession()]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950">
      <UserList users={users} role={session?.role} />
    </div>
  );
}
