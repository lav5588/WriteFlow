import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      role:'ADMIN' | 'USER';
      isVerified?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    role:'ADMIN' | 'USER';
    isVerified?: boolean;
    username?: string;
    profileImage?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    role:'ADMIN' | 'USER';
    isVerified?: boolean;
    username?: string;
  }
}
