interface Props {
  title: string;
  button: string;
  handleClick: () => void;
}
export default function EmptyState({ title, button, handleClick }: Props) {
  return (
    <main className='empty'>
      <h2 className='empty__title'>{title}</h2>
      <button onClick={handleClick} className='empty__button'>
        {button}
      </button>
    </main>
  );
}
