'use client'

import { Transition, Dialog } from '@headlessui/react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC, Fragment, useEffect, useState } from 'react'
import { Icon, Icons } from "@/components/icons";
import SignOutButton from './SignOutButton'
import Button, { buttonVariants } from './ui/Button'
import FriendRequests from './FriendRequests'
import { Session } from 'next-auth'
import SideBarChatList from '@/components/SideBarChatList'
import { usePathname } from 'next/navigation'
import SideBarOption from "@/types/typings"
import FavoriteIcon from "@mui/icons-material/Favorite";

interface MobileChatLayoutProps {
  friends: User[]
  session: Session
  SideBarChatOptions: SideBarOption[]
  unseenRequestCount: number
}

const MobileChatLayout: FC<MobileChatLayoutProps> = ({ friends, session, SideBarChatOptions, unseenRequestCount }) => {
  const [open, setOpen] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className='fixed bg-gray-900 border-b border-gray-800 top-0 inset-x-0 py-2 px-4'>
      <div className='w-full flex justify-between items-center'>
        <Link href="/dashboard" className="flex h-16 justify-left items-center w-fit -mx-8 p-0 mb-[-1.2rem]">
          <span className="text-white p-0 m-0">
          <svg width="80" height="50" viewBox="0 0 318 555" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M284 289.2L279.2 352C272.267 363.467 263.467 373.733 252.8 382.8C242.4 391.6 230 398.667 215.6 404C201.467 409.067 185.2 411.6 166.8 411.6C139.067 411.333 114.4 405.2 92.8 393.2C71.2 381.2 54.2667 364.4 42 342.8C30 320.933 24 295.2 24 265.6C24 236.533 30 211.2 42 189.6C54 167.733 70.8 150.8 92.4 138.8C114.267 126.533 139.867 120.4 169.2 120.4C188.933 120.4 206.667 123.067 222.4 128.4C238.4 133.467 252.267 139.867 264 147.6L272 204H268.4C262.533 180.533 250.533 162.8 232.4 150.8C214.267 138.533 193.2 132.4 169.2 132.4C145.733 132.4 125.333 138 108 149.2C90.9333 160.133 77.6 175.6 68 195.6C58.6667 215.333 54 238.533 54 265.2C54 291.867 58.6667 315.2 68 335.2C77.6 355.2 90.8 370.8 107.6 382C124.667 393.2 144.4 399.067 166.8 399.6C185.733 399.6 203.2 396.133 219.2 389.2C235.467 382 249.067 370.4 260 354.4C270.933 338.133 277.867 316.4 280.8 289.2H284Z" fill="#5D17EB"/>
          <path d="M280.499 14.906L317.637 14.906L181.425 292.151L144 292.151L280.499 14.906Z" fill="#5D17EB"/>
          <line x1="144" y1="15" x2="318" y2="15" stroke="#5D16EC" stroke-width="8"/>
          <line x1="144" y1="292" x2="318" y2="292" stroke="#5D16EC" stroke-width="8"/>
          </svg>
          </span>
          <h1 className="text-indigo-200 text-2xl ml-[-1rem]"><span className="text-3xl">C</span>onnect <span className="text-3xl">Z</span></h1>
        </Link>
        <Button onClick={() => setOpen(true)} className='gap-4'>
          <Menu className='h-8 w-7' />
        </Button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <div className='fixed inset-0 bg-gray-900 bg-opacity-50' />

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'>
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-hidden bg-gradient-to-r from-gray-900 to-black py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-base font-semibold leading-6 text-gray-200'>
                            
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md text-gray-200 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                              onClick={() => setOpen(false)}>
                              <span className='sr-only'>Close panel</span>
                              <X className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        {/* Content */}

                        {friends.length > 0 ? (
                          <div className='text-xl font-semibold mb-4 leading-6 text-gray-400'>
                            Your chats
                          </div>
                        ) : null}

                        <nav className='flex flex-1 flex-col'>
                          <ul
                            role='list'
                            className='flex flex-1 flex-col gap-y-7'>
                            {friends.length > 0 && (<li>
                              <SideBarChatList
                                friends={friends}
                                sessionId={session.user.id}
                              />
                            </li>)}

                            <li>
                              <div className='text-xl mb-4 font-semibold leading-6 text-gray-400'>
                                Overview
                              </div>
                              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {SideBarChatOptions.map((option) => {
                                  const Icon = Icons[option.Icon]
                                  return (
                                    <li key={option.name}>
                                      <Link
                                        href={option.href}
                                        className='text-gray-200 mb-2 hover:bg-gray-800 bg-gray-700 p-4 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold items-center'>
                                        <span className='text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium'>
                                          <FavoriteIcon/>
                                        </span>
                                        <span className='truncate text-lg'>
                                          {option.name}
                                        </span>
                                      </Link>
                                    </li>
                                  )
                                })}

                                <li>
                                  <FriendRequests
                                    initialCount={
                                      unseenRequestCount
                                    }
                                    sessionId={session.user.id}
                                  />
                                </li>
                              </ul>
                            </li>

                            <li className='-ml-6 mt-auto flex flex-col justify-start items-center absolute bottom-0 '>
                              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50 rounded-full'>
                                  <Image
                                    fill
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                    src={session.user.image || ''}
                                    alt='Your profile picture'
                                  />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col text-gray-200'>
                                  <span aria-hidden='true'>
                                    {session.user.name}
                                  </span>
                                  <span
                                    className='text-xs text-zinc-400'
                                    aria-hidden='true'>
                                    {session.user.email}
                                  </span>
                                </div>
                              </div>
                              <SignOutButton color='white' className='h-full aspect-square text-white' />
                            </li>
                          </ul>
                        </nav>

                        {/* content end */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default MobileChatLayout