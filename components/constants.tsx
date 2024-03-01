import { IColumn } from "@/typing";

export const HOME = "Inicio";
export const WELCOME_MSG = "Bienvenido";
export const BRAND = "Task Manager";
export const BOARDS = "Tableros";
export const BOARD = "Tablero";
export const EMPTY_BOARDS_MSG = "No haz creado ningún tablero aún. Crea un nuevo tablero para empezar."
export const BOARD_NAME = "Nombre del tablero";
export const BOARD_COLUMNS = "Columnas del tablero";
export const NEW_COLUMN = "Nueva columna";
export const NEW_BOARD = "Nuevo tablero";
export const EDIT_BOARD = "Editar tablero";
export const DELETE_BOARD = "Eliminar tablero";
export const NEW_TASK = "Nueva tarea";
export const EDIT_TASK = "Editar tarea";
export const DELETE_TASK = "Eliminar tarea";
export const SAVE = "Guardar";
export const LOGOUT = "Cerrar Sesión";
export const HOME_MSG = "Elige un tablero o crea uno nuevo."
export const HIDE_SIDEBAR = "Ocultar menú"
export const NEW = "Nueva"
export const COLUMN = "columna"
export const TASK = "tarea"
export const SUB_TASKS = "Subtareas"
export const NEW_SUBTASK = "Nueva subtarea";
export const SUBTASK_PLACEHOLDER = "Escribe la subtarea aquí.";
export const DESCRIPTION = "Descripción"
export const TITLE = "Título"
export const TRACK_ID = "ID de trazabilidad"
export const STATUS = "Estado"
export const PRIORITY = "Prioridad"
export const ASSIGNEE = "Asignado"
export const CURRENT_STATUS = "Estado actual"
export const OF = "de"
export const DELETE = "Eliminar"
export const CANCEL = "Cancelar"
export const BACK_HOME = "Volver al inicio"
export const BOARD_ERROR_TITLE = "Ups! 404"
export const BOARD_ERROR_CONTENT = "El tablero elegido no existe."
export const BOARD_ERROR_MSG = "No encontramos el tablero solicitado."


export const confirmMsg = (name:string) => {
    return `Estás seguro de eliminar "${name}"? Ésta acción no podrá ser revertida.`
}

export const PRIORITIES:IColumn[] = [
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
    },
  ]


export const ASSIGNEES:IColumn[] = [
  {
    _id: "0",
    name: "Indefinido",
    tasks: [],
  },
  {
    _id: "1",
    name: "Lucas Rodríguez",
    tasks: [],
  },
  {
    _id: "2",
    name: "Juan López",
    tasks: [],
  },
  {
    _id: "3",
    name: "Martín Gómez",
    tasks: [],
  },
  {
    _id: "4",
    name: "María Pérez",
    tasks: [],
  },
  {
    _id: "5",
    name: "Jimena Paz",
    tasks: [],
  },
  {
    _id: "6",
    name: "Andrés Gabarre",
    tasks: [],
  },
]