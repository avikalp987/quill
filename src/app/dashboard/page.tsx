import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {

    //getting the current login session of the user
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    //if there is no user present
    if(!user || !user.id)
    {
        redirect("/auth-callback?origin=dashboard")
    }

    //getting our user from the database
    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    //if the user is not synced to the database
    if(!dbUser)
    {
        redirect("/auth-callback?origin=dashboard")
    }

    const subscriptionPlan = await getUserSubscriptionPlan()

    return ( 
        <Dashboard subscriptionPlan={subscriptionPlan}/>
     );
}
 
export default Page;