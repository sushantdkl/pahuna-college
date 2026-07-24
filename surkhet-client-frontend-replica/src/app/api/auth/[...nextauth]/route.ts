import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import { authOptions } from "@server/lib/auth";

export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };
