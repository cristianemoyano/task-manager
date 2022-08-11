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
    <div className='input__text__control'>
      <label htmlFor={name} className='input__label'>
        {label}
      </label>
      <input
        type='text'
        id={name}
        placeholder={placeholder}
        className={error ? 'input__text error' : 'input__text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className='input__text__error'>{error?.message}</p>
    </div>
  );
}
