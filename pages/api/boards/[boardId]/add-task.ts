import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/services/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body,
    query: { boardId },
  } = req;
  const { db } = await connectToDatabase();

  if (method === 'PATCH') {
  }
}
