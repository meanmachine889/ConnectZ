'use client'

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";
import LogoutIcon from '@mui/icons-material/Logout';

interface SignOutProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutProps> = ({...props}) => {
    const [signout, setSignout] = useState<boolean>(false);

    const handleSignOut = async () => {
        setSignout(true);
        try {
            await signOut();
        } catch (error) {
            toast.error('There was a problem signing out');
        } finally {
            setSignout(false);
        }
    };

    return (
        <Button {...props} variant={'ghost'} onClick={handleSignOut} className="hover:bg-red-500 w-[9rem] bg-red-400 mb-4 flex items-center">
            {signout ? (
                <Loader2 className="animate-spin h-4 w-4" />
            ) : (
                <div className="flex gap-2 justify-center w-[100%] items-center">
                    Sign Out
                    <LogoutIcon className="h-4 w-4 text-white" />
                </div>
                
            )}
        </Button>
    );
};

export default SignOutButton;
