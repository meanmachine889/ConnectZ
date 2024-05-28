"use client"

import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { FC, useState } from "react"
import toast from "react-hot-toast";

interface pageProps {}

const Page: FC<pageProps> = () =>{
    const[isLoading, setIsLoading] = useState<boolean>(false);
    async function loginWithGoogle() {
        setIsLoading(true);
        try {
            await signIn('google');
        } catch (error) {
            toast.error('something went wrong');
        } finally{
            setIsLoading(false);
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full items-center justify-center flex flex-col items-center max-w-md space-y-8">
            <div className="flex h-full items-center justify-center flex-col items-center gap-8">
            <div className="flex h-16 justify-center items-center w-screen ml-[-3rem] p-0">
              <span className="text-white p-0 m-0">
                <svg width="100" height="80" viewBox="0 0 318 555" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M284 289.2L279.2 352C272.267 363.467 263.467 373.733 252.8 382.8C242.4 391.6 230 398.667 215.6 404C201.467 409.067 185.2 411.6 166.8 411.6C139.067 411.333 114.4 405.2 92.8 393.2C71.2 381.2 54.2667 364.4 42 342.8C30 320.933 24 295.2 24 265.6C24 236.533 30 211.2 42 189.6C54 167.733 70.8 150.8 92.4 138.8C114.267 126.533 139.867 120.4 169.2 120.4C188.933 120.4 206.667 123.067 222.4 128.4C238.4 133.467 252.267 139.867 264 147.6L272 204H268.4C262.533 180.533 250.533 162.8 232.4 150.8C214.267 138.533 193.2 132.4 169.2 132.4C145.733 132.4 125.333 138 108 149.2C90.9333 160.133 77.6 175.6 68 195.6C58.6667 215.333 54 238.533 54 265.2C54 291.867 58.6667 315.2 68 335.2C77.6 355.2 90.8 370.8 107.6 382C124.667 393.2 144.4 399.067 166.8 399.6C185.733 399.6 203.2 396.133 219.2 389.2C235.467 382 249.067 370.4 260 354.4C270.933 338.133 277.867 316.4 280.8 289.2H284Z" fill="#5D17EB"/>
                <path d="M280.499 14.906L317.637 14.906L181.425 292.151L144 292.151L280.499 14.906Z" fill="#5D17EB"/>
                <line x1="144" y1="15" x2="318" y2="15" stroke="#5D16EC" stroke-width="8"/>
                <line x1="144" y1="292" x2="318" y2="292" stroke="#5D16EC" stroke-width="8"/>
                </svg>
              </span>
              <h1 className="text-indigo-200 text-4xl ml-[-1rem]"><span className="text-5xl">C</span>onnect <span className="text-5xl">Z</span></h1>
            </div>
              <h2 className="  text-center text-3xl font-bold tracking-tight text-gray-400">
                Sign in to your account
              </h2>
            </div>
            <Button
              isLoading={isLoading}
              type="button"
              className="max-w-sm w-[10rem] p-4"
              onClick={loginWithGoogle}
            >
              {!isLoading && (
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="github"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
              )}
              Google
            </Button>
          </div>
        </div>
      );
    };

export default Page;