import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';

interface Props {
  boards: IBoard[];
  close: () => void;
  isVisible: boolean;
}

export default function AllBoardsModal({ boards, close, isVisible }: Props) {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const router = useRouter();
  const { board_id } = router.query;

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

  const handleCreateNewBoard = () => {
    close();
    setIsNewBoard(true);
    toggleBoardModal();
  };

  return (
    <div
      className={isVisible ? 'board__modal board__modal--open' : 'board__modal'}
      onClick={handleCloseModal}
    >
      <div className='board__container'>
        <p className='board__numbers'>all boards ({boards.length})</p>
        <div className='board__items'>
          {boards.map((item) => (
            <Link href={`/board/${item._id}`} passHref key={item._id}>
              <a>
                <div
                  className={
                    board_id === item._id
                      ? 'board__item board__item--active'
                      : 'board__item'
                  }
                >
                  <Image
                    src='/assets/icon-board.svg'
                    width={16}
                    height={16}
                    alt='board'
                    className='board__item__logo'
                  />
                  <h3 className='board__item__name'>{item.name}</h3>
                </div>
              </a>
            </Link>
          ))}
          <button
            className='board__item__button'
            onClick={handleCreateNewBoard}
          >
            <Image
              src='/assets/icon-board.svg'
              width={16}
              height={16}
              alt='board'
              className='board__item__button__logo'
            />
            <h3 className='board__item__button__text'>+ Create New Board</h3>
          </button>
        </div>
        <div className='board__theme'>
          <Image
            src='/assets/icon-light-theme.svg'
            width={19}
            height={19}
            alt='board'
          />
          <Image
            src='/assets/icon-dark-theme.svg'
            width={16}
            height={16}
            alt='board'
          />
        </div>
      </div>
    </div>
  );
}
