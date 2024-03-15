import useModal from '@/contexts/useModal';
import { IBoard } from '@/typing';
import { DELETE_BOARD, EDIT_BOARD } from '../constants';
import { useState } from 'react';

interface Props {
  isVisible: boolean;
  close: () => void;
  board?: IBoard;
  toggleClosedTasks?: ()=> void;
}

export default function BoardDropdown({ isVisible, close, board, toggleClosedTasks }: Props) {
  const {
    toggleBoardModal,
    toggleDeleteModal,
    setDeleteModalContent,
    setIsNewBoard,
  } = useModal();

  const [showClosedTasks, setShowClosedTasks] = useState(false)

  const handleEditClick = () => {
    close();
    setIsNewBoard(false);
    toggleBoardModal();
  };

  const handleDeleteClick = () => {
    close();
    toggleDeleteModal();
    setDeleteModalContent({
      isBoard: true,
      name: board!.name,
      _id: board!._id!.toString(),
      column_id: '',
    });
  };

  const handleClickShowClosedTasks = () => {
    setShowClosedTasks(!showClosedTasks)
    toggleClosedTasks ? toggleClosedTasks() : ""
  };

  return (
    <div
      className={
        isVisible
          ? 'edit__dropdown edit__dropdown--open board__dropdown'
          : 'edit__dropdown board__dropdown'
      }
    >
      <button className='edit__button__edit' onClick={handleEditClick} typeof='dropdown'>
        {EDIT_BOARD}
      </button>
      <button className='edit__button__edit' onClick={handleClickShowClosedTasks} typeof='dropdown'>
        {showClosedTasks ? "Ocultar tareas cerradas" : "Mostrar tareas cerradas"}
      </button>
      <button className='edit__button__delete' onClick={handleDeleteClick} typeof='dropdown'>
        {DELETE_BOARD}
      </button>

    </div>
  );
}
