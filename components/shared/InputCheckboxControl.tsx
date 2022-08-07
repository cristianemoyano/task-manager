interface Props {
  onChange: (value: any) => void;
  value: boolean;
  name: string;
}

export default function InputCheckboxControl({ onChange, value, name }: Props) {
  return (
    <div className='input__checkbox__control'>
      <input
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        type='checkbox'
        id={name}
        className='input__checkbox'
      />
      <label
        htmlFor={name}
        className={
          value
            ? 'input__checkbox__label input__checkbox__label--disabled'
            : 'input__checkbox__label'
        }
      >
        {name}
      </label>
    </div>
  );
}
