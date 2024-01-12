import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import { OpenAIEmbeddings } from "@langchain/openai"
import {PineconeStore} from "@langchain/community/vectorstores/pinecone"
import { pinecone } from "@/lib/pinecone";
 
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

        //
        try {
            //get the file
            const response = await fetch (file.url)

            const blob = await response.blob()

            const loader = new PDFLoader(blob)

            const pageLevelDocs = await loader.load()

            const pagesAmt = pageLevelDocs.length

            //vectorize and index the entire document
            const pineconeIndex = pinecone.Index("quill")

            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY
            })

            await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
                pineconeIndex,
                namespace: createdFile.id,
            })


            await db.file.update({
                data: {
                    uploadStatus: "SUCCESS"
                },
                where: {
                    id: createdFile.id
                }
            })

        } catch (error: any) {
            await db.file.update({
                data: {
                    uploadStatus: "FAILED"
                },
                where: {
                    id: createdFile.id
                }
            })
        }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;