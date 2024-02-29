import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

import connectMongo from '@/services/connectMongo';
import User from '@/models/userModel';

export default NextAuth({
  providers: [
    CredentialProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Your email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials) {
        await connectMongo();

        const user = await User.findOne({ email: credentials!.email });
        if (!user) throw new Error('error');

        const checkPassword = await compare(
          credentials!.password,
          user.password
        );
        if (!checkPassword) throw new Error('error');

        return {
          email: user.email,
          name: user.name,
          id: user._id.toString(),
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        id: token?.id,
      };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/register',
    // error: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
