import { IProject } from '@/typing';
import React from 'react';

interface Props {
  project: IProject;
}

export default function ProjectItem({ project }: Props) {

  return (
    <div>
      <div className="max-w-sm w-full lg:max-w-full lg:flex">
        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <p className="text-sm text-gray-600 flex items-center">
              Prioridad: {project.priority}
            </p>
            <div className="text-gray-900 font-bold text-xl mb-2">{project.title}</div>
            <p className="text-gray-700 text-base">{project.description}</p>
          </div>
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{project.assignee}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
