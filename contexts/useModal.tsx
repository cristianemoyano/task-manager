import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

import { IComment, ISubtask } from '@/typing';

interface IDeleteModalContent {
  _id: string;
  column_id: string;
  isBoard: boolean;
  name: string;
}

interface ITaskModalContent {
  _id?: string;
  title?: string;
  description?: string;
  track_id?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  subtasks?: ISubtask[];
  comments?: IComment[];
  is_closed?: boolean;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

interface IModal {
  isBoardModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isTaskModalOpen: boolean;
  isTaskInfosModalOpen: boolean;
  isSidebarOpen: boolean;

  toggleBoardModal: () => void;
  toggleTaskModal: () => void;
  toggleDeleteModal: () => void;
  toggleTaskInfosModal: () => void;
  toggleSidebar: () => void;

  deleteModalContent: IDeleteModalContent;
  taskModalContent: { isNew: boolean; task: ITaskModalContent };
  taskInfosModalContent: ITaskModalContent;
  isNewBoard: boolean;

  setDeleteModalContent: Dispatch<SetStateAction<IDeleteModalContent>>;
  setTaskModalContent: Dispatch<SetStateAction<{ isNew: boolean; task: {} }>>;
  setTaskInfosModalContent: Dispatch<SetStateAction<{}>>;
  setIsNewBoard: Dispatch<SetStateAction<boolean>>;
}

const ModalContext = createContext<IModal>({
  isBoardModalOpen: false,
  isDeleteModalOpen: false,
  isTaskModalOpen: false,
  isTaskInfosModalOpen: false,
  isSidebarOpen: true,

  toggleBoardModal: () => {},
  toggleDeleteModal: () => {},
  toggleTaskModal: () => {},
  toggleTaskInfosModal: () => {},
  toggleSidebar: () => {},

  deleteModalContent: { isBoard: true, _id: '', column_id: '', name: '' },
  taskModalContent: { isNew: true, task: {} },
  taskInfosModalContent: {},
  isNewBoard: false,

  setDeleteModalContent: () => {},
  setTaskModalContent: () => {},
  setTaskInfosModalContent: () => {},
  setIsNewBoard: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskInfosModalOpen, setIsTaskInfosModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewBoard, setIsNewBoard] = useState(false);

  const [deleteModalContent, setDeleteModalContent] = useState({
    isBoard: true,
    _id: '',
    column_id: '',
    name: '',
  });
  const [taskModalContent, setTaskModalContent] = useState({
    isNew: true,
    task: {},
  });
  const [taskInfosModalContent, setTaskInfosModalContent] = useState({});

  const toggleBoardModal = () => setIsBoardModalOpen(!isBoardModalOpen);

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const toggleTaskModal = () => setIsTaskModalOpen(!isTaskModalOpen);

  const toggleTaskInfosModal = () =>
    setIsTaskInfosModalOpen(!isTaskInfosModalOpen);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const memoedValue = useMemo(
    () => ({
      isBoardModalOpen,
      isDeleteModalOpen,
      isTaskModalOpen,
      isTaskInfosModalOpen,
      isSidebarOpen,
      toggleBoardModal,
      toggleDeleteModal,
      toggleTaskModal,
      toggleTaskInfosModal,
      toggleSidebar,
      deleteModalContent,
      taskModalContent,
      taskInfosModalContent,
      setDeleteModalContent,
      isNewBoard,
      setTaskModalContent,
      setTaskInfosModalContent,
      setIsNewBoard,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isBoardModalOpen,
      isDeleteModalOpen,
      isTaskModalOpen,
      isTaskInfosModalOpen,
      isSidebarOpen,
      deleteModalContent,
      taskModalContent,
      taskInfosModalContent,
    ]
  );

  return (
    <ModalContext.Provider value={memoedValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default function useModal() {
  return useContext(ModalContext);
}
