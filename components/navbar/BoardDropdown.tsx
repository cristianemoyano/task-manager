import useModal from '@/contexts/useModal';
import { IBoard } from '@/typing';

interface Props {
  isVisible: boolean;
  close: () => void;
  board?: IBoard;
}

export default function BoardDropdown({ isVisible, close, board }: Props) {
  const { toggleBoardModal, toggleDeleteModal, setDeleteModalContent } =
    useModal();
  return (
    <div
      className={
        isVisible
          ? 'edit__dropdown edit__dropdown--open board__dropdown'
          : 'edit__dropdown board__dropdown'
      }
    >
      <button
        className='edit__button__edit'
        onClick={() => {
          close();
          toggleBoardModal();
        }}
      >
        Edit Board
      </button>
      <button
        className='edit__button__delete'
        onClick={() => {
          close();
          toggleDeleteModal();
          setDeleteModalContent({
            isBoard: true,
            name: board!.name,
            _id: board!._id!.toString(),
          });
        }}
      >
        Delete Board
      </button>
    </div>
  );
}
