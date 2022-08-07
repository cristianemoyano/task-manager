import useModal from '@/contexts/useModal';
import Modal from '../shared/Modal';

export default function DeleteModal() {
  const {
    toggleDeleteModal,
    isDeleteModalOpen,
    deleteModalContent: { _id, isBoard, name },
  } = useModal();

  const onDelete = () => {
    if (isBoard) {
      // delete board
    } else {
      // delete task
    }
  };

  return (
    <Modal isVisible={isDeleteModalOpen} close={toggleDeleteModal}>
      <>
        <header className='modal__header'>
          <h3 className='modal__header__title modal__header__title--delete'>
            Delete this {isBoard ? 'board' : 'task'}
          </h3>
        </header>
        <p className='modal__text'>
          Are you sure you want to delete the &apos;{name}&apos;{' '}
          {isBoard ? 'board' : 'task'}? This action will remove all columns and
          tasks and cannot be reversed.
        </p>
        <button className='modal__button__delete' onClick={onDelete}>
          Delete
        </button>
        <button
          className='modal__button__secondary'
          onClick={toggleDeleteModal}
        >
          Cancel
        </button>
      </>
    </Modal>
  );
}
