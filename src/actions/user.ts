"use server";

import prisma from "@/lib/prisma";
import type { ROLE } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface UserState {
  error: string | null;
}

export const getAllUser = unstable_cache(async function getAllUser() {
  return prisma.admin.findMany();
});

export async function createUser(
  prevState: UserState,
  formData: FormData
): Promise<UserState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const defaultPassword = "123456";
  const role = formData.get("role") as ROLE;

  if (!name || !email) {
    return { error: "Data tidak lengkap" };
  }
  const existingUser = await prisma.admin.findUnique({
    where: { email },
  });
  if (existingUser) {
    return { error: "Email sudah terdaftar" };
  }
  const hashPassword = await hash(defaultPassword, 10);
  await prisma.admin.create({
    data: {
      name,
      email,
      password: hashPassword,
      role: role ? role : "CASHIER",
    },
  });
  revalidatePath("/users");
  revalidatePath("/settings");
  redirect("/users");
}

export async function updateUser(
  prevState: UserState,
  formData: FormData
): Promise<UserState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const id = formData.get("id") as string;
  const role = formData.get("role") as ROLE;

  if (!name || !email || !id) {
    return { error: "Data tidak lengkap" };
  }

  const existingUser = await prisma.admin.findUnique({
    where: { email },
  });
  if (existingUser && existingUser.id !== id) {
    return { error: "Email sudah terdaftar" };
  }

  await prisma.admin.update({
    where: { id },
    data: {
      name,
      email,
      role: role ? role : "CASHIER",
    },
  });
  revalidatePath("/users");
  revalidatePath("/settings");
  redirect("/users");
}

export async function deleteUser(id: string) {
  await prisma.admin.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/users");
  revalidatePath("/settings");
  redirect("/users");
}
