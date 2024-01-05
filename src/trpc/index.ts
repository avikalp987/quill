import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';

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

    //if the user is in the database

    return {success: true}
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;