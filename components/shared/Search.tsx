import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputDropdownControl from "./InputDropdownControl";
import InputTextControl from "./InputTextControl";
import { IBoard, IColumn, ITask, IUser } from "@/typing";
import BoardTask from "../single_board/BoardTask";
import TaskInfosModal from "../modals/TaskInfosModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useModal from "@/contexts/useModal";
import { fetcher } from "@/services/utils";
import { isEqual } from "lodash";
import useSWR from "swr";
import TaskModal from "../modals/TaskModal";
import DeleteModal from "../modals/DeleteModal";

interface Props {

}
interface IControllerTask {
    assignee: string;
    text: string;
    priority: string;
}

const usersOptions: IColumn[] = [
    {
        _id: "-",
        name: "Seleccionar",
        tasks: [],
    },
    {
        _id: "65e0f2f48119a85322480d5b",
        name: "User 1",
        tasks: [],
    },
    {
        _id: "65e1debb92d58be03ce30ad9",
        name: "User 2",
        tasks: [],
    },
]

const board: IBoard = {
    _id: "any",
    name: "string",
    user_id: "122",
    columns: [],
}

const user: IUser = {
    _id: "any",
    name: "string",
    email: "string",
    password: "string",
}


const users: IUser[] = [
    user,
]

const priorities = [
    {
        _id: "-",
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


export default function SearchForm({ }: Props) {

    const router = useRouter();
    const { data: session } = useSession()

    useEffect(() => {
        if (!session) {
            router.push('/register');
        }
    }, [router]);

    const defaultValues = {
        assignee: "-",
        priority: "-",
        text: "",
    };

    const { control, handleSubmit, reset, register, setValue } =
        useForm<IControllerTask>({
            defaultValues,
        });

    const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
        setQuery(data)
    };

    const {
        isTaskInfosModalOpen,
        toggleTaskInfosModal,
        taskInfosModalContent: { _id, title, track_id, priority, comments, assignee, description, subtasks, status },
    } = useModal();

    const [query, setQuery] = useState<IControllerTask>();

    const { data: tasks, error: taskError } = useSWR<ITask[], any>(
        `/api/tasks/search?text=${query?.text}&assignee=${query?.assignee}&priority=${query?.priority}`,
        fetcher,
        {
            fallbackData: [],
            revalidateOnFocus: false,
        }
    );

    return (
        <div className="mt-3 bg-white p-3 m-3 max-h-screen" >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2">
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
                                    placeholder='Título de la tarea, descripción, id de trazabilidad...'
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
                            name='assignee'
                            render={({ field: { onChange, value } }) => (
                                <InputDropdownControl
                                    onChange={onChange}
                                    value={value}
                                    label={"Asignado"}
                                    columns={usersOptions}
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
                </div>
            </form>

            <div>
                <header className='modal__header'>
                    <h4 className='modal__header__title'>
                        <span className="">Tareas</span>
                        <hr />
                    </h4>
                </header>
                <TaskModal board={board} user_id="1" users={users} />
                <DeleteModal board={board} user_id="1" />
                <TaskInfosModal board={board} user_id="1" user={user} users={users} />
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
                        Title: {title}
                        <button onClick={() => toggleTaskInfosModal()}>Abrir</button>
                    </div>

                </div>
            </div>
        </div>
    );
}
