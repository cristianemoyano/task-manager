import React, { useEffect } from 'react';
import { IProject } from '@/typing';
import { fetcher } from '@/services/utils';
import useSWR from 'swr';
import ProjectItem from './ProjectItem';

interface Props {
}


export default function ProjectList({ }: Props) {
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

    return (
        <div
            className={''}
        >
            <div className='modal__container'>
            <header className='modal__header'>
                    <h4 className='modal__header__title'>
                        <span className="">Proyectos</span>
                        <hr />
                    </h4>
                </header>
            {projects?.map((project:IProject)=>{
                return (
                    <div key={project._id}>
                    <ProjectItem project={project}/>
                    </div>
                )
            })}
            </div>
        </div>
    );
}
