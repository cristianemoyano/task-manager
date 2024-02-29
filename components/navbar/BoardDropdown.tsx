import useModal from '@/contexts/useModal';
import { IBoard } from '@/typing';
import { DELETE_BOARD, EDIT_BOARD } from '../constants';

interface Props {
  isVisible: boolean;
  close: () => void;
  board?: IBoard;
}

export default function BoardDropdown({ isVisible, close, board }: Props) {
  const {
    toggleBoardModal,
    toggleDeleteModal,
    setDeleteModalContent,
    setIsNewBoard,
  } = useModal();

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
  return (
    <div
      className={
        isVisible
          ? 'edit__dropdown edit__dropdown--open board__dropdown'
          : 'edit__dropdown board__dropdown'
      }
    >
      <button className='edit__button__edit' onClick={handleEditClick}>
        {EDIT_BOARD}
      </button>
      <button className='edit__button__delete' onClick={handleDeleteClick}>
        {DELETE_BOARD}
      </button>
    </div>
  );
}
