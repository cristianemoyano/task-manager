import useModal from '@/contexts/useModal';
import { ITask } from '@/typing';
import { DELETE_TASK, EDIT_TASK } from '../constants';

interface Props {
  isVisible: boolean;
  close: () => void;
  task: ITask;
}

export default function TaskDropdown({ isVisible, close, task }: Props) {
  const {
    toggleTaskModal,
    setTaskModalContent,
    toggleDeleteModal,
    setDeleteModalContent,
  } = useModal();

  return (
    <div
      className={
        isVisible
          ? 'edit__dropdown edit__dropdown--open task__dropdown'
          : 'edit__dropdown task__dropdown'
      }
    >
      <button
        className='edit__button__edit'
        type='button'
        onClick={() => {
          close();
          setTaskModalContent({ isNew: false, task });
          toggleTaskModal();
        }}
      >
       {EDIT_TASK}
      </button>
      <button
        className='edit__button__delete'
        type='button'
        onClick={() => {
          close();
          toggleDeleteModal();
          setDeleteModalContent({
            isBoard: false,
            name: task.title,
            _id: task!._id!.toString(),
            column_id: task.status,
          });
        }}
      >
        {DELETE_TASK}
      </button>
    </div>
  );
}
