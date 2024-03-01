import React from 'react';

import { IUser } from '@/typing';
import { getInitials } from '@/services/utils';
import { isEmpty } from 'lodash';

interface Props {
    users: IUser[];
}

const MAX_USERS_LIMIT = 10;

const COLORS = ['bg-gray-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400', 'bg-cyan-400', 'bg-orange-400', 'bg-teal-400'];

function UserList({ users }: Props) {

    if (isEmpty(users)) {
        return
    }

    const firstSliceUsers = users.slice(0, MAX_USERS_LIMIT);
    const remainingUsers = users.slice(MAX_USERS_LIMIT, users.length);
    const remainingUsersCount = users.length - MAX_USERS_LIMIT;

    return (
        <div className="flex invisible lg:visible">
            {firstSliceUsers.map((user, index) => (
                <div key={index} className={`w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full ${COLORS[index % COLORS.length]} text-white mr-[-7px]`}>
                    <span className="text-md font-bold">{getInitials(user.name)}</span>
                </div>
            ))}
            {remainingUsersCount > 0 && (
                <div className="w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full bg-indigo-400 text-white mr-[-7px] ">
                    <span className="text-md font-bold">+{remainingUsersCount}</span>
                </div>
            )}
        </div>
    );
}

export default UserList;

