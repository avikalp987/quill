import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from "zod"
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';

export const appRouter = router({
  // ...
  authCallback: publicProcedure.query(async () => {

    //getting the userid
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    //if user is not present
    if(!user || !user.id || !user.email)
    {
      throw new TRPCError({code: "UNAUTHORIZED"})
    }

    //check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    //if the user is not present in the database
    if(!dbUser)
    {
      // create the user in the database
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        }
      })
    }

    return {success: true}
  }),


  getUserFiles: privateProcedure.query(async ({ctx}) => {
    const {userId, user} = ctx

    return await db.file.findMany({
      where: {
        userId
      }
    })
  }),


  getFile: privateProcedure.input(z.object({key: z.string()})).mutation(async ({ctx, input}) => {
    const {userId} = ctx

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId,
      },
    })

    if(!file)
    {
      throw new TRPCError({code: "NOT_FOUND"})
    }

    return file
  }),

  deleteFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ctx, input}) => {

    //getting the user id
    const {userId} = ctx

    //finding the file
    const file = await db.file.findFirst({
      where: {
        id: input.id,
        userId,
      }
    })

    //if no file is found
    if(!file)
    {
      throw new TRPCError({code: "NOT_FOUND"})
    }

    //if the user is trying to delete one of its own files
    await db.file.delete({
      where: {
        id: input.id,
      }
    })


    return file
  }),

  getFileUploadStatus: privateProcedure.input(z.object({fileId: z.string()})).query(async ({input, ctx}) => {
    //check the status of file upload
    const file = await db.file.findFirst({
      where: {
        id: input.fileId,
        userId: ctx.userId,
      }
    })

    //after we found out the file
    if(!file)
    {
      return {status: "PENDING" as const}
    }

    return {status: file.uploadStatus}
  }),

  getFileMessages: privateProcedure.input(z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    fileId: z.string()
  })).query(async ({input, ctx}) => {
    const {userId} = ctx
    const {fileId, cursor} = input

    const limit = input.limit ?? INFINITE_QUERY_LIMIT

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      }
    })

    if(!file)
    {
      throw new TRPCError({code: "NOT_FOUND"})
    }

    const messages = await db.message.findMany({
      take: limit+1,
      where: {
        fileId,
      },
      orderBy: {
        createdAt: "desc"
      },
      cursor: cursor ? {id: cursor} : undefined,
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true
      }
    })

    let nextCursor: typeof cursor | undefined = undefined
    if(messages.length>limit)
    {
      const nextItem = messages.pop()
      nextCursor = nextItem?.id
    }

    return {
      messages,
      nextCursor,
    }

  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;