import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from "zod"

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
  deleteFile: privateProcedure
  .input(
    z.object({ id: z.string() })
  )
  .mutation(async ({ctx, input}) => {

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
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;