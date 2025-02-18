/* eslint-disable react/no-unknown-property */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';
import useTheme from '@/contexts/useTheme';
import { ASSIGNED_BOARDS, LOGOUT, NEW_BOARD, OWNED_BOARDS, PROJECTS, SEARCH } from '../constants';

interface Props {
  boards?: IBoard[];
  assignedBoards?: IBoard[];
  className: string;
  close?: (e:any) => void;
}
export default function AllBoards({ boards, assignedBoards, className, close }: Props) {
  const { toggleBoardModal, setIsNewBoard } = useModal();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { board_id } = router.query;

  return (
    <div className={className}>
      {/* Search */}
      <div className='mb-3'>
        <Link href={`/search`} >
          <a>
            <div
              className={
                router.pathname.includes("search")
                  ? 'board__item board__item--active'
                  : 'board__item'
              }
            >
              <h3 className='board__item__name'>{SEARCH}</h3>
            </div>
          </a>
        </Link>
      </div>
      {/* Projects */}
      <div className='mb-4'>
        <Link href={`/projects`} >
          <a>
            <div
              className={
                router.pathname.includes("projects")
                  ? 'board__item board__item--active'
                  : 'board__item'
              }
            >
              <h3 className='board__item__name'>{PROJECTS}</h3>
            </div>
          </a>
        </Link>
      </div>
      {/* END BOARDS */}
      {/* BOARDS */}
      <div>
        <p className='board__numbers'>{OWNED_BOARDS} ({boards ? boards.length : 0})</p>
        <div className='board__items'>
          {boards?.map((item) => (
            <Link href={`/board/${item._id}`} passHref key={item._id}>
              <a>
                <div
                  typeof='dropdown'
                  className={
                    board_id === item._id
                      ? 'board__item board__item--active'
                      : 'board__item'
                  }
                  onClick={close}
                >
                  <Image
                    src='/assets/icon-board.svg'
                    width={16}
                    height={16}
                    layout='fixed'
                    alt='board'
                    className='board__item__logo'
                  />
                  <h3 className='board__item__name' typeof='dropdown'>{item.name}</h3>
                </div>
              </a>
            </Link>
          ))}
          <button
            className='board__item__button'
            onClick={(e:any) => {
              close && close(e);
              setIsNewBoard(true);
              toggleBoardModal();
            }}
            typeof='dropdown'
          >
            <Image
              src='/assets/icon-board.svg'
              width={16}
              height={16}
              alt='board'
              className='board__item__button__logo'
            />
            <h3 className='board__item__button__text' typeof='dropdown'>+ {NEW_BOARD}</h3>
          </button>
        </div>

      </div>
      {/* END BOARDS */}
      {/* ASSIGNED BOARDS */}
      <div>
        <p className='board__numbers' typeof='dropdown'>{ASSIGNED_BOARDS} ({assignedBoards ? assignedBoards.length : 0})</p>
        <div className='board__items' typeof='dropdown'>
          {assignedBoards?.map((item) => (
            <Link href={`/board/${item._id}`} passHref key={item._id} typeof='dropdown'>
              <a typeof='dropdown'>
                <div
                  typeof='dropdown'
                  className={
                    board_id === item._id
                      ? 'board__item board__item--active'
                      : 'board__item'
                  }
                  onClick={close}
                >
                  <Image
                    src='/assets/icon-board.svg'
                    width={16}
                    height={16}
                    layout='fixed'
                    alt='board'
                    className='board__item__logo'
                  />
                  <h3 className='board__item__name' typeof='dropdown'>{item.name}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>

      </div>
      {/* END ASSIGNED BOARDS */}
      <div>
        <div className='board__theme'>
          <Image
            src='/assets/icon-light-theme.svg'
            width={19}
            height={19}
            alt='board'
          />
          <button className='board__theme__switch' onClick={toggleTheme} typeof='dropdown'>
            <div className='board__theme__switch__circle'></div>
          </button>
          <Image
            src='/assets/icon-dark-theme.svg'
            width={16}
            height={16}
            alt='board'
          />
        </div>
        <button
          className='board__logout'
          onClick={() => signOut({ callbackUrl: '/register' })}
          typeof='dropdown'
        >
          {LOGOUT}
        </button>
      </div>
    </div>
  );
}
