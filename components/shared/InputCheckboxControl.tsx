interface Props {
  onChange: (value: any) => void;
  value: boolean;
  name: string;
}

export default function InputCheckboxControl({ onChange, value, name }: Props) {
  return (
    <div className='input__checkbox__control' onClick={() => onChange(!value)}>
      <input
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        type='checkbox'
        id={name}
        name='name'
        className='input__checkbox'
      />
      <p
        className={
          value
            ? 'input__checkbox__label input__checkbox__label--disabled'
            : 'input__checkbox__label'
        }
      >
        {name}
      </p>
    </div>
  );
}
