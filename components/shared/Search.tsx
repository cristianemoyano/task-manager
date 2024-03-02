import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputDropdownControl from "./InputDropdownControl";
import InputTextControl from "./InputTextControl";
import { IBoard, IColumn, ITask, IUser } from "@/typing";
import BoardTask from "../single_board/BoardTask";
import TaskInfosModal from "../modals/TaskInfosModal";

interface Props {

}
interface IControllerTask {
    assignee: string;
    title: string;
    track_id: string;
    priority: string;
}

const usersOptions: IColumn[] = [
    {
        _id: "-",
        name: "Seleccionar",
        tasks: [],
    },
    {
        _id: "0",
        name: "Pepe P",
        tasks: [],
    }
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

const tasks: ITask[] = [


]

export default function SearchForm({ }: Props) {

    const defaultValues = {
        assignee: "-",
        priority: "-",
        track_id: "",
        title: "",
    };

    const { control, handleSubmit, reset, register, setValue } =
        useForm<IControllerTask>({
            defaultValues,
        });

    const onSubmit: SubmitHandler<IControllerTask> = async (data) => {
        alert(JSON.stringify(data))
    };

    return (
        <div className="mt-3 bg-white p-3 m-3 max-h-screen" >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-5 gap-4 items-center">
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
                                    label={"ID de trazabilidad"}
                                    placeholder='Escribe aquí ...'
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name='title'
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <InputTextControl
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                    name='title'
                                    label={"Titulo"}
                                    placeholder='Escribe aquí ...'
                                />
                            )}
                        />
                    </div>
                    <div>
                        <button className='modal__button__primary__s' type='submit'>
                            Buscar
                        </button>
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
                <TaskInfosModal board={board} user_id="1" user={user} users={[]} />
                <div className="overflow-y-auto max-h-96">
                    <div className="grid grid-cols-3 gap-1">
                        {tasks.map((task) => {
                            return (
                                <div className="p-3">
                                    <BoardTask task={task} users={users} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
