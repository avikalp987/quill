import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (
    req: NextRequest
) => {

    //endpoint for asking a question to a pdf file

    const body = await req.json()

    const {getUser}  = getKindeServerSession()
    const user = await getUser()

    if(!user?.id)
    {
        return new Response("Unauthorized", {status: 401});
    }

    const {id: userId} = user

}