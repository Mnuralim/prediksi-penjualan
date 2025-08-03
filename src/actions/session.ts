/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(
    payload as {
      userId: string;
      expiresAt: Date;
      role: "ADMIN" | "OWNER" | "CASHIER";
    }
  )
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24hr")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload }: { payload: SessionPayload } = await jwtVerify(
      session,
      key,
      {
        algorithms: ["HS256"],
      }
    );

    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(
  userId: string,
  email: string,
  role: "ADMIN" | "OWNER" | "CASHIER",
  name?: string
) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt, role, email, name });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
