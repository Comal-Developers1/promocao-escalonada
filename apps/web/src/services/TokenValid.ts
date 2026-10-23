import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "@/types/token";


export async function getTokenPayload(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie || !tokenCookie?.value) {
    return null;
  }

  try {
    return jwtDecode<TokenPayload>(tokenCookie.value);
  } catch (error) {
    console.error("Token inválido ou corrompido no servidor:", error);
    return null;
  }
}
