import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';

import { Schema, mongo } from 'mongoose';
import connectMongo from '@/services/connectMongo';
import User from '@/models/userModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, name } = req.body;
  await connectMongo();

  const checkExisting = await User.findOne({ email });
  if (checkExisting) {
    res.status(422).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    _id: new mongo.ObjectId(),
    email,
    name,
    password: await hash(password, 12),
  });

  res.status(201).json(user);
}
