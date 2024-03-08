import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputDropdownControl from "./InputDropdownControl";
import InputTextControl from "./InputTextControl";
import { IBoard, IColumn, ITask, IUser } from "@/typing";
import Image from 'next/image';
import BoardTask from "../single_board/BoardTask";
import TaskInfosModal from "../modals/TaskInfosModal";

import { useEffect, useState } from "react";

import useModal from "@/contexts/useModal";
import { fetcher } from "@/services/utils";

import useSWR from "swr";
import TaskModal from "../modals/TaskModal";
import DeleteModal from "../modals/DeleteModal";
import { PRIORITIES } from "../constants";
import { isEmpty } from "lodash";

interface Props {
    user: IUser,

}
interface IControllerTask {
    assigneeSelected: string;
    prioritySelected: string;
    text: string;
    trackIdSelected: string;
    isClosedSelected: string;
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

const isClosedOptions = [
    {
        _id: "",
        name: "Seleccionar",
        tasks: [],
    },
    {
        _id: "1",
        name: "Si",
        tasks: [],
    },
    {
        _id: "0",
        name: "No",
        tasks: [],
    },
]


export default function SearchForm({ user }: Props) {

    const {
        isTaskInfosModalOpen,
        toggleTaskInfosModal,
        taskInfosModalContent: { _id, title, track_id, priority, comments, assignee, description, subtasks, status },
    } = useModal();

    const defaultValues = {
        assigneeSelected: "",
        prioritySelected: "",
        text: "",
        trackIdSelected: "",
        isClosedSelected: "",
    };

    const { control, handleSubmit, reset, register, setValue } =
        useForm<IControllerTask>({
            defaultValues,
        });

    const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
        setQuery(data)
    };



    const [query, setQuery] = useState<IControllerTask>();
    const [userIds, setUserIds] = useState<string>("");
    const [boardID, setBoardID] = useState<string>("");

    const { data: tasks, error: taskError } = useSWR<ITask[], any>(
        `/api/tasks/search?text=${query?.text}&assignee=${query?.assigneeSelected}&priority=${query?.prioritySelected}&track_id=${query?.trackIdSelected}&is_closed=${query?.isClosedSelected}`,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    const { data: users, error: userError } = useSWR<IUser[], any>(
        `/api/users?user_ids=${userIds}`,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    const { data: board, error: boardError } = useSWR<IBoard, any>(
        `/api/boards/${boardID}/`,
        fetcher,
        {
            fallbackData: { _id: "", name: "", user_id: "", columns: [] },
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (!isEmpty(title)) {
            const targetTask = tasks?.find((task) => task._id === _id)
            setBoardID(String(targetTask?.board_id))
        }
    }, [title]);

    const taskContent = (
        <>
            <header className='modal__header modal__header__flex'>
                <h3 className='modal__header__title'>{title}</h3>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* COL 1 */}
                <div className='col-span-2'>
                    <p className='mb-4'>{description}</p>
                </div>
                {/* END COL 1 */}

                {/* COL 2 */}
                <div >
                    <p className='input__label'>
                        Prioridad:
                        <span className='modal__text'>
                            {` ${PRIORITIES.find((c) => c._id === priority)?.name}`}
                        </span>
                    </p>

                    <p className='input__label'>
                        Asignado:
                        <span className='modal__text'>
                            {` ${users?.find((c) => c._id === assignee)?.name}`}
                        </span>
                    </p>
                    <p className='input__label'>
                        ID de trazabilidad:
                        <span className='modal__text'>
                            {track_id ? ` ${track_id}` : track_id}
                        </span>
                    </p>

                    {board?.columns?.find((c) => c._id === status)?.name}

                </div>
                {/* END COL 2 */}
            </div>
            <button className="mt-3 bg-indigo-600 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded" onClick={() => toggleTaskInfosModal()}>
                Abrir
            </button>
        </>
    )

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

    const userAssignee: IUser = {
        _id: assignee,
        name: "",
        email: "",
        password: "",
    }

    const emptyState = (
        <div className="flex items-center justify-center">
            <Image
                src='/assets/empty_state.jpg'
                className="w-full h-auto"
                width={480}
                height={330}
                layout='fixed'
                alt='empty'
            />
        </div>
    )

    const taskResults = (
        <div className="grid grid-cols-2 gap-1">
            <div className="overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 gap-1">
                    {tasks?.map((task, index) => {
                        return (
                            <div className="p-3" key={index}>
                                <BoardTask task={task} users={users} isToggleDisabled={true} />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div>
                {title ? taskContent : ""}
            </div>
        </div>
    )

    return (
        <div className="mt-3 bg-white p-3 m-3 max-h-full" >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-1 items-center">
                    <div className="lg:col-span-5">
                        <Controller
                            control={control}
                            name='text'
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <InputTextControl
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                    name='text'
                                    label={"Buscar"}
                                    placeholder='Título de la tarea'
                                />
                            )}
                        />
                    </div>
                    <div>
                        <button className='modal__button__primary__s' type='submit'>
                            Buscar
                        </button>
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name='trackIdSelected'
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <InputTextControl
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                    name='text'
                                    label={"ID Trazabilidad"}
                                    placeholder=''
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name='assigneeSelected'
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
                    <div>
                        <Controller
                            control={control}
                            name='prioritySelected'
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
                            name='isClosedSelected'
                            render={({ field: { onChange, value } }) => (
                                <InputDropdownControl
                                    onChange={onChange}
                                    value={value}
                                    label={"Tarea cerrada"}
                                    columns={isClosedOptions}
                                />
                            )}
                        />
                    </div>
                </div>
            </form>

            <div>
                <header className='modal__header'>
                    <h4 className='modal__header__title'>
                        <span className="">Tareas</span>
                        <hr />
                    </h4>
                </header>
                <TaskModal board={board} user_id={user._id} users={users} />
                <DeleteModal board={board} user_id={user._id} />
                <TaskInfosModal board={board} user_id={user._id} user={userAssignee} users={users} />


                {!isEmpty(tasks) ? taskResults : emptyState}

            </div>
        </div>
    );
}
