import type {Session, User} from 'next-auth';
import type { jwt } from 'next-auth/jwt';

type UserId = string

declare module 'next-auth/jwt'{
    interface jwt{
        id: UserId
    }
}

declare module 'next-auth' {
    interface Session{
        user: User & {
            id : UserId 
        }
    }
}