import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function KanbanLogo() {
  return (
    <Link href='/' passHref>
      <a className='kanban__logo'>
        <Image
          src='/assets/logo-mobile.svg'
          width={24}
          height={25}
          layout='fixed'
          alt='company-logo'
        />
        <h1 className='kanban__logo__title'>kanban</h1>
      </a>
    </Link>
  );
}
