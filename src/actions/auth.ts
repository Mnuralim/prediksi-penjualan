"use server";

import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { createSession, deleteSession } from "./session";

interface AuthState {
  error: string | null;
}

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password harus diisi" };
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { error: "Email tidak terdaftar" };
  }

  const passwordMatch = await compare(password, admin.password);
  if (!passwordMatch) {
    return { error: "Password salah" };
  }

  await createSession(admin.id.toString());
  return { error: null };
}

export async function logout() {
  await deleteSession();
}
