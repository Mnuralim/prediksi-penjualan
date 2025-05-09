"use server";
import "server-only";
import { cache } from "react";
import { verifySession } from "./session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

interface AdminState {
  error: string | null;
}

export const getAdmin = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await prisma.admin.findUnique({
      where: { id: session.userId as string },
      select: {
        id: true,
        name: true,
        email: true,
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
  const admin = await getAdmin();
  if (!admin) {
    return { error: "Admin tidak ditemukan" };
  }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

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
