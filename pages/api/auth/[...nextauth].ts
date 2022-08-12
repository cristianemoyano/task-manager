import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

import connectMongo from '@/services/connectMongo';
import User from '@/models/userModel';

export default NextAuth({
  providers: [
    CredentialProvider({
      id: 'Credentials',
      name: 'Credentials',
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
        if (!user) return null;

        const checkPassword = await compare(
          credentials!.password,
          user.password
        );
        if (!checkPassword) return null;

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
        token.name = user.name;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.name = token.name;
      }
      return session;
    },
  },
  session: {
    jwt: true,
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/register',
    error: '/register',
  },
});
