"use server";
import "server-only";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

interface AdminState {
  error: string | null;
}

export const getAdmin = cache(async (id: string) => {
  try {
    const data = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const updateAdmin = async (
  prevState: AdminState,
  formData: FormData
): Promise<AdminState> => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const id = formData.get("id")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !id) {
    return { error: "Data tidak lengkap" };
  }
  const admin = await getAdmin(id);
  if (!admin) {
    return { error: "Admin tidak ditemukan" };
  }

  if (password) {
    const hashPassword = await hash(password, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
  } else {
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name,
        email,
      },
    });
  }

  revalidatePath("/settings");

  return { error: null };
};
