import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteURL(path: string){
  if(typeof window !== "undefined")//means we are on client side
  {
    return path
  }

  if(process.env.VERCEL_URL)//which means that we have deployed our app to the vercel
  {
    return `https://${process.env.VERCEL_URL}${path}`
  }

  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}
