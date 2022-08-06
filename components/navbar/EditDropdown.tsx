import useModal from '@/contexts/useModal';

interface Props {
  isVisible: boolean;
  close: () => void;
}

export default function EditDropdown({ isVisible, close }: Props) {
  const { toggleBoardModal } = useModal();
  return (
    <div
      className={
        isVisible ? 'edit__dropdown edit__dropdown--open' : 'edit__dropdown'
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
      <button className='edit__button__delete' onClick={close}>
        Delete Board
      </button>
    </div>
  );
}
