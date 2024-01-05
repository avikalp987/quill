import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client"

const Page = () => {

    //getting our router
    const router = useRouter()

    //getting the search params
    const searchParams = useSearchParams()

    //getting the origin
    const origin = searchParams.get("origin")

    const {data, isLoading} = trpc.authCallback.useQuery(undefined, {
        onSuccess: ({success})=>{
            if(success)
            {
                //user is already synced to the database
                router.push(origin ? `/${origin}` : "/dashboard")
            }
        }
    }) 
}

export default Page