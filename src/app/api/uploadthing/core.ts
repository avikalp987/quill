import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      
        const { getUser } = getKindeServerSession()
        const user = await getUser()

        if(!user || !user.id)
        {
            throw new Error("Unauthorized")
        }

        return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
        //adding the file to our database
        const createdFile = await db.file.create({
            data: {
                key: file.key,
                name: file.name,
                userId: metadata.userId,
                url: file.url,
                uploadStatus: "PROCESSING",
            }
        })
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;