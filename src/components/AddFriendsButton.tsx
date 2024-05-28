"use client"

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/addFriend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from 'react-hook-form';

interface AddFriendButtonProps {};

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton:FC <AddFriendButtonProps> = ({}) =>{

    const[success, setSuccess] = useState<boolean>(false);
    const{register, handleSubmit, setError, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(addFriendValidator)
    })

    const addFriend = async(email:string) => {
        try {
            const validatedEmail = addFriendValidator.parse({email})
            await axios.post('/api/friends/add',{
                email: validatedEmail,
            })

            setSuccess(true);

        } catch (error) {
            if(error instanceof z.ZodError){
                setError('email', {message: error.message});
                return
            }
            if(error instanceof AxiosError){
                setError('email', {message: error.response?.data});
                return
            }

            setError('email', {message: "something went wrong"});
        }
    }

    const onSubmit = (data: FormData) =>{
        addFriend(data.email);
    }

    return(
        <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200">
                Enter email
            </label>
            <div className="mt-2 flex gap-4">
                <input {...register('email')} type="text" className="block border-none outline-none w-full rounded-md py-1.5 text-gray-200 bg-gray-800 outline-none shadow-sm placeholder:text-gray-400 sm:text-sm"
                placeholder="you@example.com"/>
                <Button className="bg-gray-800">Add</Button>
            </div>
            <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
            {success ? (
                <p className="mt-1 text-sm text-green-600">Friend request sent</p> ) : (
                    null
                )
            }
        </form>
    )
}

export default AddFriendButton;