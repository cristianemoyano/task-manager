import React, { useEffect, useState } from 'react';
import { IProject, IUser } from '@/typing';
import { fetcher } from '@/services/utils';
import useSWR from 'swr';
import ProjectItem from './ProjectItem';
import { isEmpty } from 'lodash';
import ProjectModal from '../modals/ProjectModal';

interface Props {
    users: IUser[] | undefined
}

const defaultProject:IProject = {
    _id: "",
    track_id: "",
    priority: "",
    assignee: "",
    title: "",
    description: "",
    status: "",
    comments: [],
    is_closed: false,
}

export default function ProjectList({ users }: Props) {

    const [project, setProject] = useState<IProject>(defaultProject);
    const [isModalVisible, setModalVisibility] = useState(false);

    const { data: projects, error: projectError } = useSWR<IProject[], any>(
        `/api/project/`,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    const handleOnClickProject = (selectedProject: IProject) => {
        setProject({...selectedProject})
        setModalVisibility(true)
    }

    const closeModal = () => {
        setModalVisibility(!isModalVisible)
    }

    return (
        <div>
            <div className='p-6 rounded-sm w-full m-3 max-w-screen-lg'>
                <header className='modal__header'>
                    <h4 className='modal__header__title'>
                        <span className="">Proyectos</span>
                        <hr />
                    </h4>
                </header>
                <div className='overflow-y-auto max-h-screen'>
                    <ProjectModal isVisible={isModalVisible} close={closeModal} project={project} users={users}/>
                    {projects?.map((project: IProject) => {
                        const assignee = users?.find((c) => c._id === project.assignee)
                        const assigneeName = assignee ? assignee.name : "Sin asignar"
                        return (
                            <div className='cursor-pointer'
                                key={project._id} onClick={() => handleOnClickProject(project)}>
                                <ProjectItem project={project} assigneeName={String(assigneeName)} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
