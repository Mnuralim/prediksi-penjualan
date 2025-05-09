"use server";

import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifySession } from "./session";

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

  const session = await verifySession();

  await prisma.item.create({
    data: {
      name,
      photo: photoUrl,
      stock: parseInt(stock),
      price: parseFloat(price),
      category,
      adminId: session.userId as string,
    },
  });

  revalidatePath("/items");
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

  revalidatePath("/items");
  redirect("/items");
}

export async function deleteItem(id: string) {
  await prisma.item.delete({
    where: {
      id: id,
    },
  });
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
