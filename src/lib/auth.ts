import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Extend the user object for JWT and Session
interface ExtendedUser extends NextAuthUser {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('E-posta ve şifre gereklidir.');
        }

        // const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user) {
          // It's better not to reveal whether the user exists
          throw new Error('E-posta veya şifre hatalı.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) {
          throw new Error('E-posta veya şifre hatalı.');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      const extendedUser = user as ExtendedUser;
      if (extendedUser) {
        token.role = extendedUser.role;
        token.id = extendedUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as ExtendedUser).id = token.id as string;
        (session.user as ExtendedUser).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Hata durumunda da giriş sayfasına yönlendir
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 