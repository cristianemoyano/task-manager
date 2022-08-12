import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import EmptyState from '@/components/shared/EmptyState';
import HeadOfPage from '@/components/shared/HeadOfPage';

const NotFound: NextPage = () => {
  const router = useRouter();

  return (
    <HeadOfPage title='404 page' content="This page doesn't exit">
      <EmptyState
        title="This page doesn't exit, go back home."
        button='Go Home'
        handleClick={() => router.push('/')}
      />
    </HeadOfPage>
  );
};

export default NotFound;
