//for securing the routes, that only, logged in users can visit

import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"

export const config = {
    matcher: ["/dashboard/:path*", "/auth-callback"]//any path of this type
}

export default authMiddleware