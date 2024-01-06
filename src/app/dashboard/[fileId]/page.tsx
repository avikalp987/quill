import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"

interface PageProps{
    params: {
        fileId: string
    }
}

const Page = async ({params}: PageProps) => {
    //retrive the file id
    const { fileId } = params

    //getting the user
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    //if the user is not present
    if(!user || !user.id)
    {
        redirect(`/auth-callback?origin=dashboard/${fileId}`)
    }

    //make the database call
    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId: user.id,
        }
    })

    //if there are no files
    if(!file)
    {
        notFound()
    }

    //if there are files found in the accound of the user
    return (
        <div>
            {fileId}
        </div>
    )
}

export default Page