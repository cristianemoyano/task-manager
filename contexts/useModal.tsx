import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ISubtask } from '@/typing';

interface ITaskModalContent {
  _id?: string;
  title?: string;
  description?: string;
  status?: string;
  subtasks?: ISubtask[];
}

interface ModalProviderProps {
  children: React.ReactNode;
}

interface IModal {
  isBoardModalOpen: boolean;
  toggleBoardModal: () => void;
  isDeleteModalOpen: boolean;
  deleteModalContent: { isBoard: boolean; _id: string; name: string };
  toggleDeleteModal: () => void;
  setDeleteModalContent: Dispatch<
    SetStateAction<{ isBoard: boolean; _id: string; name: string }>
  >;
  isTaskModalOpen: boolean;
  toggleTaskModal: () => void;
  taskModalContent: { isNew: boolean; task: ITaskModalContent };
  setTaskModalContent: Dispatch<SetStateAction<{ isNew: boolean; task: {} }>>;
  isTaskInfosModalOpen: boolean;
  toggleTaskInfosModal: () => void;
  taskInfosModalContent: ITaskModalContent;
  setTaskInfosModalContent: Dispatch<SetStateAction<{}>>;
}

const ModalContext = createContext<IModal>({
  isBoardModalOpen: false,
  toggleBoardModal: () => {},
  isDeleteModalOpen: false,
  deleteModalContent: { isBoard: true, _id: '', name: '' },
  setDeleteModalContent: () => {},
  toggleDeleteModal: () => {},
  isTaskModalOpen: false,
  taskModalContent: { isNew: true, task: {} },
  toggleTaskModal: () => {},
  setTaskModalContent: () => {},
  isTaskInfosModalOpen: false,
  taskInfosModalContent: {},
  toggleTaskInfosModal: () => {},
  setTaskInfosModalContent: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalContent, setDeleteModalContent] = useState({
    isBoard: true,
    _id: '',
    name: '',
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalContent, setTaskModalContent] = useState({
    isNew: true,
    task: {},
  });
  const [isTaskInfosModalOpen, setIsTaskInfosModalOpen] = useState(false);
  const [taskInfosModalContent, setTaskInfosModalContent] = useState({});

  const toggleBoardModal = () => setIsBoardModalOpen(!isBoardModalOpen);

  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const toggleTaskModal = () => setIsTaskModalOpen(!isTaskModalOpen);

  const toggleTaskInfosModal = () =>
    setIsTaskInfosModalOpen(!isTaskInfosModalOpen);

  const memoedValue = useMemo(
    () => ({
      isBoardModalOpen,
      toggleBoardModal,
      isDeleteModalOpen,
      toggleDeleteModal,
      deleteModalContent,
      setDeleteModalContent,
      isTaskModalOpen,
      toggleTaskModal,
      taskModalContent,
      setTaskModalContent,
      isTaskInfosModalOpen,
      toggleTaskInfosModal,
      taskInfosModalContent,
      setTaskInfosModalContent,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isBoardModalOpen,
      isDeleteModalOpen,
      deleteModalContent,
      isTaskModalOpen,
      taskModalContent,
      isTaskInfosModalOpen,
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
