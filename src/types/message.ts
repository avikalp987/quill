import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

//infer the type of output of any route which we have in trpc
type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = RouterOutput["getFileMessages"]["messages"]

//defining the type of the loading message
type OmitText = Omit<Messages[number], "text">
type ExtendedText = {
    text: string | JSX.Element
}


export type ExtendedMessage = OmitText & ExtendedText

