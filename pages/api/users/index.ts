import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import { getUsers } from '@/services/user';
import {isString} from 'lodash' 

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        method,
        body,
        query: { user_ids },
    } = req;
    await connectMongo();

    console.log(user_ids)

    if (method === 'GET' && isString(user_ids)) {
        try {
            const users = await getUsers(user_ids?.split(','))
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    }

}
