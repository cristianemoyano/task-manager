import axios from 'axios';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';
import Modal from '../shared/Modal';
import { BOARD, CANCEL, DELETE, TASK, confirmMsg } from '../constants';

export default function DeleteModal({ board, user_id }: { board?: IBoard, user_id: string }) {

  const {
    toggleDeleteModal,
    isDeleteModalOpen,
    deleteModalContent: { _id, isBoard, name, column_id },
  } = useModal();
  const router = useRouter();

  const onDelete = async () => {
    if (isBoard) {
      await axios.delete(`/api/boards/${_id}?user_id=${user_id}`);
      router.push('/');
    } else {
      await axios.delete(
        `/api/task/delete-task?board_id=${board?._id}&user_id=${user_id}&column_id=${column_id}&task_id=${_id}`
      );
      mutate(`/api/boards/${board?._id}?user_id=${user_id}`);
    }
    toggleDeleteModal();
  };

  return (
    <Modal isVisible={isDeleteModalOpen} close={toggleDeleteModal}>
      <>
        <header className='modal__header'>
          <h3 className='modal__header__title modal__header__title--delete'>
            {DELETE} {isBoard ? BOARD : TASK}
          </h3>
        </header>
        <p className='modal__text'>
          {confirmMsg(name)}
        </p>
        <button className='modal__button__delete' onClick={onDelete}>
          {DELETE}
        </button>
        <button
          className='modal__button__secondary'
          onClick={toggleDeleteModal}
        >
          {CANCEL}
        </button>
      </>
    </Modal>
  );
}
