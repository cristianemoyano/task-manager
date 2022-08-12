import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import EmptyState from '@/components/shared/EmptyState';

const NotFound: NextPage = () => {
  const router = useRouter();

  return (
    <EmptyState
      title="This page doesn't exit, go back home."
      button='Go Home'
      handleClick={() => router.push('/')}
    />
  );
};

export default NotFound;
