import React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  content: string;
  children: JSX.Element;
}

export default function HeadOfPage({ title, content, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={content} />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {children}
    </>
  );
}
