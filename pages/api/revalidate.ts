import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { board_id } = req.query;
  let revalidated = false;
  try {
    await res.revalidate(`/board/${board_id}`);
    revalidated = true;
  } catch (error) {
    console.log(error);
  }
  res.json({ revalidated });
}
