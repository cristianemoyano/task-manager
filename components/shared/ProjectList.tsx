import React, { useEffect } from 'react';
import { IProject, IUser } from '@/typing';
import { fetcher } from '@/services/utils';
import useSWR from 'swr';
import ProjectItem from './ProjectItem';
import { isEmpty } from 'lodash';

interface Props {
    users: IUser[] | undefined
}


export default function ProjectList({users }: Props) {
    useEffect(() => {
    }, []);

    const { data: projects, error: projectError } = useSWR<IProject[], any>(
        `/api/project/`,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    // padding: 24px;
    // border-radius: 6px;
    // width: 100%;
    // margin: 3vh 3vh 3vh 3vh;
    // cursor: auto;
    // max-width: 130vh;
    return (
        <div
            className={''}
        >
            <div className='p-6 rounded-sm w-full m-3 max-w-screen-lg'>
                <header className='modal__header'>
                    <h4 className='modal__header__title'>
                        <span className="">Proyectos</span>
                        <hr />
                    </h4>
                </header>
                <div className='overflow-y-auto max-h-60'>
                    {projects?.map((project: IProject) => {
                        const assignee = users?.find((c) => c._id === project.assignee)
                        const assigneeName = assignee ? assignee.name : "Sin asignar"
                        return (
                            <div className=''>
                                <ProjectItem key={project._id} project={project}  assigneeName={String(assigneeName)}/>
                            </div>
                                
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
