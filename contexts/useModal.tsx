import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ModalProviderProps {
  children: React.ReactNode;
}
interface IModal {
  isBoardModalOpen: boolean;
  toggleBoardModal: () => void;
  isTaskModalOpen: boolean;
  toggleTaskModal: () => void;
  isNewTask: boolean;
  setIsNewTask: Dispatch<SetStateAction<boolean>>;
}

const ModalContext = createContext<IModal>({
  isBoardModalOpen: false,
  toggleBoardModal: () => {},
  isTaskModalOpen: false,
  toggleTaskModal: () => {},
  isNewTask: false,
  setIsNewTask: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(false);

  const toggleBoardModal = () => setIsBoardModalOpen(!isBoardModalOpen);

  const toggleTaskModal = () => setIsTaskModalOpen(!isTaskModalOpen);

  const memoedValue = useMemo(
    () => ({
      isBoardModalOpen,
      toggleBoardModal,
      isTaskModalOpen,
      toggleTaskModal,
      isNewTask,
      setIsNewTask,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBoardModalOpen, isTaskModalOpen, isNewTask]
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
