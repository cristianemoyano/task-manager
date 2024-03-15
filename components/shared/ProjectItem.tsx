import { IProject } from '@/typing';
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
    <div className='modal__container cursor-pointer'>
      <div className="max-w-sm w-full lg:max-w-full lg:flex  rounded-sm">
        <div className="lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
          <div className="">
            <p className="text-sm modal__text flex items-center">
              Prioridad: {priorityName}
            </p>
            <div className=" modal__header__title font-bold text-xl mb-2">{project.title}</div>
            <p className="text-gray-700 modal__text text-base">{project.description}</p>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="modal__text leading-none font-bold">
                {assigneeName}
              </p>
              <p className=" modal__text leading-none pt-3">
                Track ID:{project.track_id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
