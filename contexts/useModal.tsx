import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ModalProviderProps {
  children: React.ReactNode;
}
interface IModal {
  isBoardModalOpen: boolean;
  toggleBoardModal: () => void;
}

const ModalContext = createContext<IModal>({
  isBoardModalOpen: false,
  toggleBoardModal: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const toggleBoardModal = () => setIsBoardModalOpen(!isBoardModalOpen);

  const memoedValue = useMemo(
    () => ({ isBoardModalOpen, toggleBoardModal }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBoardModalOpen]
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
