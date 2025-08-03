"use server";

import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { Item } from "@prisma/client";

interface ItemState {
  error: string | null;
}

export async function createItem(
  prevState: ItemState,
  formData: FormData
): Promise<ItemState> {
  const name = formData.get("name") as string;
  const image = formData.get("image") as File;
  const stock = formData.get("stock") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;

  if (!name || !image || !stock || !price || !category) {
    return { error: "Data tidak lengkap" };
  }

  const session = await getSession();

  if (session?.role === "OWNER") {
    return {
      error: "Anda tidak memiliki akses untuk membuat item",
    };
  }

  let photoUrl = null;

  if (image && image.size > 0) {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const uploadFile = await imagekit.upload({
      file: imageBuffer,
      fileName: `${name}-${Date.now()}`,
      folder: `sales-prediction/items`,
    });
    photoUrl = uploadFile.url;
  }

  await prisma.item.create({
    data: {
      name,
      photo: photoUrl,
      stock: parseInt(stock),
      price: parseFloat(price),
      category,
      adminId: session?.userId as string,
    },
  });

  revalidatePath("/items");
  revalidatePath("/sales");
  redirect("/items");
}

export async function updateItem(
  prevState: ItemState,
  formData: FormData
): Promise<ItemState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const image = formData.get("image") as File;
  const stock = formData.get("stock") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;

  const session = await getSession();

  if (session?.role === "OWNER") {
    return {
      error: "Anda tidak memiliki akses untuk mengubah item",
    };
  }

  const currentItem = await prisma.item.findUnique({
    where: { id },
    select: { photo: true },
  });

  let photoUrl = currentItem?.photo || null;

  if (image && image.size > 0) {
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const uploadFile = await imagekit.upload({
      file: imageBuffer,
      fileName: `${name}-${Date.now()}`,
      folder: `sales-prediction/items`,
    });
    photoUrl = uploadFile.url;
  }

  await prisma.item.update({
    where: {
      id: id,
    },
    data: {
      name,
      photo: photoUrl,
      stock: parseInt(stock),
      price: parseFloat(price),
      category,
    },
  });

  revalidatePath("/sales");
  revalidatePath("/items");
  redirect("/items");
}

export async function deleteItem(id: string) {
  const session = await getSession();

  if (session?.role === "OWNER") {
    return {
      error: "Anda tidak memiliki akses untuk menghapus item",
    };
  }
  await prisma.item.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/sales");
  revalidatePath("/items");
  redirect("/items");
}

export async function getItemName(itemId: string): Promise<string> {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { name: true },
  });

  return item?.name || "Unknown Item";
}

export const getItems = unstable_cache(async function getItems(): Promise<
  Item[]
> {
  return prisma.item.findMany();
});
