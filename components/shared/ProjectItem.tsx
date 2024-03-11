import { IProject, IUser } from '@/typing';
import React from 'react';
import { PRIORITIES } from '../constants';

interface Props {
  project: IProject;
  assigneeName: string;
}

export default function ProjectItem({ project, assigneeName }: Props) {

  const priority = PRIORITIES?.find((c) => c._id === project.priority)
  const priorityName = priority ? priority.name : "Sin asignar"

  return (
    <div className='p-3'>
      <div className="max-w-sm w-full lg:max-w-full lg:flex bg-white shadow-xl rounded-sm">
        <div className="lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <p className="text-sm text-gray-600 flex items-center">
              Prioridad: {priorityName}
            </p>
            <div className="text-gray-900 font-bold text-xl mb-2">{project.title}</div>
            <p className="text-gray-700 text-base">{project.description}</p>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-600 leading-none font-bold">
                {assigneeName}
              </p>
              <p className="text-gray-900 leading-none pt-3">
                Track ID:{project.track_id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
