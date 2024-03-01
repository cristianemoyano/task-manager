import User from "@/models/userModel";

import {isArray} from 'lodash'
import { ObjectId } from "mongodb";

const filterValidUserIds = (userIds: string[]) => {
    return userIds.filter(ObjectId.isValid);
};

export const getUsers = async (userIds: string | string[] | undefined) => {
    if (isArray(userIds)) {
        const validUserIds = filterValidUserIds(userIds);
        const objectIds = validUserIds.map(id => new ObjectId(id));
        const users = await User.find({ _id: { $in: objectIds } })
        return users;
    }
    return []
}