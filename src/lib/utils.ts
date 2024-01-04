import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//function to apply custom classname to make the component reusable
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}