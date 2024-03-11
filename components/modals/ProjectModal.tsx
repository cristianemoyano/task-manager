import { IColumn, IProject, IUser } from '@/typing';
import Modal from '../shared/Modal';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { PRIORITIES } from '../constants';
import { mutate } from 'swr';
import axios from 'axios';
import InputTextControl from '../shared/InputTextControl';
import { useEffect, useState } from 'react';
import InputDropdownControl from '../shared/InputDropdownControl';

interface Props {
  isVisible: boolean
  close: () => void;
  project: IProject;
  users: IUser[] | undefined;
}

interface IControllerTask {
  title: string;
  track_id: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}



export default function ProjectModal({ isVisible, close, project, users }: Props) {

  const defaultValues = {
    title: '',
    track_id: '',
    priority: PRIORITIES.length ? PRIORITIES[0]._id!.toString() : '',
    assignee: users?.length ? users[0]._id!.toString() : '',
    description: '',
  };

  const [isClient, setIsClient] = useState(false)


  const assignee = users?.find((c) => c._id === project.assignee)
  const assigneeName = assignee ? assignee.name : "Sin asignar"

  const { control, handleSubmit, reset, register, setValue } =
    useForm<IControllerTask>({
      defaultValues,
    });

  const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
    await axios.patch(`/api/project/edit`, {
      project: { ...project, ...data },
      comment: "",
    });
    mutate(`/api/project/`);
    close()
  };

  useEffect(() => {
    setValue('title', project.title!);
    setValue('track_id', project.track_id!)
    setValue('description', project.description!);
    setValue('status', project.status!);
    setValue('priority', project.priority!);
    setValue('assignee', project.assignee!);
    setIsClient(true)

  }, [project]);

  let defaulOption = {
    _id: "",
    name: "Sin Asignar",
    tasks: [],
  }
  let userOptions: IColumn[] = [defaulOption]
  const transformUsers = users?.map((us) => {
    return {
      _id: us._id,
      name: us.name,
      tasks: [],
    }
  })
  userOptions = transformUsers ? userOptions.concat(transformUsers) : userOptions

  if (!isClient) {
    return (<></>)
  }

  return (
    <Modal
      isVisible={isVisible}
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=''>
          <div className="bg-white">
            <div className="lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
              <div className="mb-8">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  <Controller
                    control={control}
                    name='title'
                    rules={{ required: "Este campo es requerido." }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <InputTextControl
                        onChange={onChange}
                        value={value}
                        error={error}
                        name='name'
                        label={"Titulo"}
                        placeholder='Título del proyecto'
                      />
                    )}
                  />
                </div>
                <p className="text-gray-700 text-base">
                  <div className=''>
                    <label className='input__label'>Descripción</label>
                    <textarea
                      className='input__text input__textarea'
                      placeholder='Aquí puedes detallar la tarea a realizar'
                      {...register('description')}
                    />
                  </div>
                </p>
              </div>
              <div className="flex items-center">
                <div className="text-sm  grid lg:grid-cols-3 gap-3 flex items-center">
                <div className="text-gray-900 ">
                    <Controller
                      control={control}
                      name='track_id'
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <InputTextControl
                          onChange={onChange}
                          value={value}
                          error={error}
                          name='track_id'
                          label={"ID de trazabilidad"}
                          placeholder=''
                        />
                      )}
                    />
                  </div>
                  <div className="text-gray-600 leading-none font-bold">
                    <Controller
                      control={control}
                      {...register('assignee')}
                      render={({ field: { onChange, value } }) => (
                        <InputDropdownControl
                          onChange={onChange}
                          value={value}
                          label={"Asignado"}
                          columns={userOptions}
                        />
                      )}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600 flex items-center">
                  <Controller
                    control={control}
                    {...register('priority')}
                    render={({ field: { onChange, value } }) => (
                      <InputDropdownControl
                        onChange={onChange}
                        value={value}
                        label={"Prioridad"}
                        columns={PRIORITIES}
                      />
                    )}
                  />
                </div>
                </div>
              </div>

              <button className='modal__button__primary__s' type='submit'>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
