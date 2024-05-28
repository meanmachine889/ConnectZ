import { chatHrefConstructor, cn } from '@/lib/utils';
import {FC} from 'react'
import toast, { Toast } from 'react-hot-toast';
import Image from 'next/image';

interface UnseenProps {
    t: Toast
    sessionId: string
    senderId: string
    senderImage: string
    senderName: string
    senderMsg: string
}

const UnseenToast: FC<UnseenProps> = ({t, senderId, sessionId, senderImage, senderName, senderMsg}) =>{
    return(
        <div className={cn('shadow-xl max-w-md w-full rounded-lg bg-gray-700 shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5', {
            'animate-enter' : t.visible,
            'animate-leave' : !t.visible
        })}>
            <a onClick={()=>toast.dismiss(t.id)} href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`} className='flex-1 w-0 p-4'>
                <div className='flex items-start '>
                    <div className='flex-shrink-0 pt-0.5'>
                        <div className='relative h-10 w-10'>
                            <Image alt={senderName} fill referrerPolicy='no-referrer' className='rounded-full' src={senderImage}/>
                        </div>
                    </div>

                    <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-gray-200'>{senderName}</p>
                        <p className='mt-1 text-sm text-gray-300'>{senderMsg}</p>
                    </div>
                </div>
            </a>
            <div className='flex border-1 border-gray-200'>
                <button onClick={() => toast.dismiss(t.id)} className='w-full border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-mdeium text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
                    Close
                </button>
            </div>
        </div>
    )
}

export default UnseenToast;