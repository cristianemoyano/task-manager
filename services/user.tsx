import User from "@/models/userModel";

import {isArray, isEmpty} from 'lodash'
import { ObjectId } from "mongodb";

const filterValidUserIds = (userIds: string[]) => {
    return userIds.filter(ObjectId.isValid);
};

export const getUsers = async (userIds?: string | string[] | undefined) => {
    if (isEmpty(userIds)) {
        const users = await User.find({});
        return users
    }
    if (isArray(userIds)) {
        const validUserIds = filterValidUserIds(userIds);
        const objectIds = validUserIds.map(id => new ObjectId(id));
        const users = await User.find({ _id: { $in: objectIds } })
        return users;
    }
    return []
}

export const getUserByEmail = async (email: string | undefined) => {
    if (!isEmpty(email)) {
        let user = await User.findOne({ email: email })
        return user;
    }
}


