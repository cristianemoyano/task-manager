import { FieldError } from 'react-hook-form';

interface Props {
  onChange: (value: any) => void;
  value: string | undefined;
  error: FieldError | undefined;
  label: string;
  name: string;
  placeholder: string;
}

export default function InputTextControl({
  onChange,
  value,
  error,
  label,
  name,
  placeholder,
}: Props) {
  return (
    <>
      <label htmlFor={name} className='modal__label'>
        {label}
      </label>
      <input
        type='text'
        id={name}
        placeholder={placeholder}
        className='modal__input__text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}
