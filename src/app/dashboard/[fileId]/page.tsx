import ChatWrapper from "@/components/chat/ChatWrapper"
import PdfRenderer from "@/components/PdfRenderer"
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
        <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
            <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">

                {/* left side */}
                <div className="flex-1 xl:flex">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        <PdfRenderer 
                            url={file.url}
                        />
                    </div>
                </div>

                {/* right side */}
                <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
                    <ChatWrapper fileId={file.id}/>
                </div>


            </div>
        </div>
    )
}

export default Page