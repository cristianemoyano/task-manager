import React, { useEffect } from 'react';

interface Props {
  isVisible: boolean;
  close: () => void;
  children: JSX.Element;
}

export default function Modal({ isVisible, close, children }: Props) {
  useEffect(() => {
    if (!isVisible) {
      document.body.classList.remove('fixed');
    } else {
      document.body.classList.add('fixed');
    }
  }, [isVisible]);

  const handleClick = (e: any) => {
    if (!e.target.classList.contains('top')) return;
    close();
  };

  return (
    <div
      className={isVisible ? 'modal--open top ' : 'modal top'}
      onClick={handleClick}
    >
      <div className='modal__container'>{children}</div>
    </div>
  );
}
