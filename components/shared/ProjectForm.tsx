import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import InputTextControl from './InputTextControl';
import InputDropdownControl from './InputDropdownControl';
import axios from 'axios';
import { IColumn, IUser } from '@/typing';
import { fetcher } from '@/services/utils';
import useSWR, { mutate } from 'swr';

interface Props {
}

interface IControllerTask {
    title: string,
    track_id: string,
    priority: string,
    assignee: string,
    description: string,
}
const priorities = [
    {
        _id: "",
        name: "Seleccionar",
        tasks: [],
    },
    {
        _id: "0",
        name: "Baja",
        tasks: [],
    },
    {
        _id: "1",
        name: "Media",
        tasks: [],
    },
    {
        _id: "2",
        name: "Alta",
        tasks: [],
    }
]

export default function ProjectForm({ }: Props) {
    useEffect(() => {
    }, []);

    const defaultValues = {
        title: "",
        track_id: "",
        priority: "",
        assignee: "",
        description: "",
    };

    const { data: users, error: userError } = useSWR<IUser[], any>(
        `/api/users`,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    const { control, handleSubmit, reset, register, setValue } =
        useForm<IControllerTask>({
            defaultValues,
        });

    const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
        await axios.patch(`/api/project/add`, {
            project: data,
        });
        reset(defaultValues);
        mutate(`/api/project/`);
    };

    let defaulOption = {
        _id: "",
        name: "Seleccionar",
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

    return (
        <div
            className={''}
        >
            <div className='modal__container'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-1 items-center">
                        <div className="lg:col-span-5">
                            <Controller
                                control={control}
                                name='title'
                                rules={{ required: "Este campo es requerido." }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <InputTextControl
                                        onChange={onChange}
                                        value={value}
                                        error={error}
                                        name='title'
                                        label={"Título"}
                                        placeholder='Escribe aquí..'
                                    />
                                )}
                            />
                        </div>
                        <div className="lg:col-span-5">
                            <div className='input__textarea__control'>
                                <label className='input__label'>Descripción</label>
                                <textarea
                                    className='input__text input__textarea'
                                    placeholder='Aquí puedes detallar el proyecto..'
                                    {...register('description')}
                                />
                            </div>
                        </div>
                        <div>
                            <Controller
                                control={control}
                                name='track_id'
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <InputTextControl
                                        onChange={onChange}
                                        value={value}
                                        error={error}
                                        name='track_id'
                                        label={"ID Trazabilidad"}
                                        placeholder=''
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Controller
                                control={control}
                                name='priority'
                                render={({ field: { onChange, value } }) => (
                                    <InputDropdownControl
                                        onChange={onChange}
                                        value={value}
                                        label={"Prioridad"}
                                        columns={priorities}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Controller
                                control={control}
                                name='assignee'
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
                    </div>

                    <div>
                        <button className='modal__button__primary__s' type='submit'>
                            Crear proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
