"use client"

import { FC, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";
import axios from "axios";
import toast from "react-hot-toast";
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
    chatPartner: User;
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [input, setInput] = useState<string>("");

    const sendMessage = async () => {
        if(!input.length){return}
        setIsLoading(true);

        try {
            await axios.post('/api/message/send', {text:input, chatId})
            setInput(' ');
            textareaRef.current?.focus()
        } catch (error) {
            toast.error("something went wrong nigga")
        } finally{
            setIsLoading(false)
        }
    };

    return (
        <div className=" border-t border-gray-700 px-4 pt-3 mt-2 sm:mb-0 flex items-center justify-center">
            <div className="relative bg-gray-900 flex-1 overflow-hidden rounded-lg shadow-sm">
                <ReactTextareaAutosize
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Connect with ${chatPartner.name}`}
                    className="block w-full resize-none border-0 bg-transparent text-gray-200 placeholder-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
                />

                <div onClick={()=>textareaRef.current?.focus()} className="py-2" aria-hidden="true">
                    <div className="py-px ">
                        <div className="h-9"></div>
                    </div>
                </div>

                <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <div className="flex shrink-0">
                        <Button isLoading={isLoading} className="bg-black hover:text-indigo-400 hover:bg-black" onClick={sendMessage} type="submit">
                            <SendIcon/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
