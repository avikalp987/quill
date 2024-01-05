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

    

    return ( 
        <div>{user.email}</div>
     );
}
 
export default Page;