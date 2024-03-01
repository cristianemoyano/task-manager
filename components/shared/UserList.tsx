import React, { useState } from 'react';

import { IUser } from '@/typing';
import { getInitials } from '@/services/utils';
import Image from 'next/image';
import { isEmpty } from 'lodash';

interface Props {
    users?: IUser[];
    onUserClick?: (user: IUser) => void;
    onClearFilters?: () => void;
}

const MAX_USERS_LIMIT = 10;

const COLORS = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 'bg-purple-400', 'bg-pink-400', 'bg-cyan-400', 'bg-orange-400', 'bg-teal-400'];

function UserList({ users, onUserClick, onClearFilters }: Props) {

    const [isFiltered, setIsFiltered] = useState(false);

    if (isEmpty(users)) {
        return (
            <></>
        )
    }

    const handleUserClick = (user: IUser) => {
        onUserClick ? onUserClick(user) : ""
        setIsFiltered(true)
    }
    const handleClearFilter = () => {

        onClearFilters ? onClearFilters() : ""
        setIsFiltered(false)
    }

    const firstSliceUsers = users?.slice(0, MAX_USERS_LIMIT);
    const remainingUsers = users?.slice(MAX_USERS_LIMIT, users.length);
    const remainingUsersCount = users ? users.length - MAX_USERS_LIMIT : 0;

    const undefinedUser:IUser = {
        _id: "0",
        name: "?",
        email: "noreply@email.com",
        password: ""
      }

    return (
        <div className="flex invisible lg:visible">
            <div className="w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full text-black ">
                {
                    isFiltered ? (
                        <button title='Remover filtros' onClick={() => handleClearFilter()} className="text-md font-bold">
                            <Image
                                src='/assets/filter-reset.svg'
                                width={40}
                                height={20}
                                layout='fixed'
                                alt='vertical-ellipsis'
                                className='navbar__dropdown__icon'
                            />
                        </button>
                    ) : (<></>)
                }

            </div>
            <button onClick={() => handleUserClick(undefinedUser)} className="text-md font-bold">
            <div title='Tareas sin asignar' className={`w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full bg-gray-400 text-white mr-[-7px]`}>
                {getInitials(undefinedUser.name)}
            </div>
            </button>
            {firstSliceUsers?.map((user, index) => (
                <button onClick={() => handleUserClick(user)} className="text-md font-bold">
                <div title={user.name} key={index} className={`w-9 h-9 border-solid border-2 border-white flex items-center justify-center rounded-full ${COLORS[index % COLORS.length]} text-white mr-[-7px]`}>
                    {getInitials(user.name)}
                </div>
                </button>
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

