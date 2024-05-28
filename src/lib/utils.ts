import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...input:ClassValue[]){
    return twMerge(clsx(input))
}

export function toPusherKey(key:string) {
    return key.replace(/:/g, '__')
}

export function chatHrefConstructor(id1:string, id2:string){
    const sortedIds = [id1, id2];
    return `${sortedIds[0]}--${sortedIds[1]}`;
}