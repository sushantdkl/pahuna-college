import { middleware as serverMiddleware } from "@server/middleware";

export const middleware = serverMiddleware;

export const config = {
	matcher: ["/dashboard/:path*", "/login"],
};


