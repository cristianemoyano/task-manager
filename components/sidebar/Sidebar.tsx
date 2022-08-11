import { IBoard } from '@/typing';
import AllBoards from '../shared/AllBoards';
import KanbanLogo from '../shared/KanbanLogo';

export default function Sidebar({ boards }: { boards: IBoard[] }) {
  return (
    <aside className='sidebar'>
      <KanbanLogo />
      <AllBoards boards={boards} className='sidebar__boards' />
      {/* show / hide sidebar */}
    </aside>
  );
}
