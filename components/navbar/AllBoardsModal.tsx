import React, { useEffect } from 'react';

import { IBoard } from '@/typing';
import AllBoards from '../shared/AllBoards';

interface Props {
  boards: IBoard[];
  close: () => void;
  isVisible: boolean;
}

export default function AllBoardsModal({ boards, close, isVisible }: Props) {
  useEffect(() => {
    if (!isVisible) {
      document.body.classList.remove('fixed');
    } else {
      document.body.classList.add('fixed');
    }
  }, [isVisible]);

  const handleCloseModal = (e: any) => {
    if (!e.target.classList.contains('board__modal')) return;
    close();
  };

  return (
    <div
      className={isVisible ? 'board__modal board__modal--open' : 'board__modal'}
      onClick={handleCloseModal}
    >
      <AllBoards boards={boards} className='board__container' close={close} />
    </div>
  );
}
