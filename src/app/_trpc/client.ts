import { AppRouter } from "@/trpc"
import { createTRPCReact } from "@trpc/react-query"
import App from "next/app"

export const trpc = createTRPCReact<AppRouter>({})