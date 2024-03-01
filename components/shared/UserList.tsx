import React from 'react';

import { IColumn } from '@/typing';
import { getInitials } from '@/services/utils';

interface Props {
    users: IColumn[];
}

const MAX_USERS_LIMIT = 4;

function UserList({ users }: Props) {

    const firstSliceUsers = users.slice(0, MAX_USERS_LIMIT);
    const remainingUsers = users.slice(MAX_USERS_LIMIT, users.length);
    const remainingUsersCount = users.length - MAX_USERS_LIMIT;

    return (
        <div className="flex">
            {firstSliceUsers.map((user, index) => (
                <div key={index} className="w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full bg-indigo-400 text-white mr-[-7px] ">
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

