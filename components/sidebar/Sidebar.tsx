import Image from 'next/image';

import { IBoard } from '@/typing';
import useModal from '@/contexts/useModal';
import AllBoards from '../shared/AllBoards';
import KanbanLogo from '../shared/KanbanLogo';

export default function Sidebar({ boards }: { boards: IBoard[] }) {
  const { isSidebarOpen, toggleSidebar } = useModal();

  return (
    <>
      <aside className={isSidebarOpen ? 'sidebar sidebar--open' : 'sidebar'}>
        <div className='sidebar__wrapper'>
          <KanbanLogo />
          <AllBoards boards={boards} className='sidebar__boards' />
          {/* show / hide sidebar */}
          <button onClick={toggleSidebar} className='sidebar__hide__button'>
            <Image
              src='/assets/icon-hide-sidebar.svg'
              width={18}
              height={16}
              layout='fixed'
              alt='hide-sidebar-logo'
              className='sidebar__hide__button__logo'
            />
            <h3 className='sidebar__hide__button__text'>Hide Sidebar</h3>
          </button>
        </div>
      </aside>
      <button
        className={
          isSidebarOpen
            ? 'sidebar__show__button'
            : 'sidebar__show__button sidebar__show__button--show'
        }
        onClick={toggleSidebar}
      >
        <Image
          src='/assets/icon-show-sidebar.svg'
          width={16}
          height={11}
          layout='fixed'
          alt='show-sidebar-logo'
        />
      </button>
    </>
  );
}
