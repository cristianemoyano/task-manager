import type { NextApiRequest, NextApiResponse } from 'next';

import connectMongo from '@/services/connectMongo';
import { getUsers } from '@/services/user';
import {isEmpty, isString} from 'lodash' 

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

    if (method === 'GET' && isString(user_ids)) {
        try {
            let queryUserIds:any[] = []
            if (!isEmpty(user_ids)) {
                queryUserIds = user_ids?.split(',')
            }
            const users = await getUsers(queryUserIds)
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    }

}
