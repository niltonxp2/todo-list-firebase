import { ChangeEvent, FC, InputHTMLAttributes, useState } from 'react';
import { TEditedTodos } from '../../App';

type TProps = {
  todoKey: string;
  editedTodos: TEditedTodos;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<TProps> = ({ value: defaultValue, editedTodos, todoKey, ...props }) => {
  const [value, setValue] = useState(defaultValue);

  function handleChangeValue(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;

    editedTodos[todoKey] = newValue;

    setValue(newValue);
  }

  return (
    <input
      {...props}
      id='newTodo'
      type='text'
      className='box-border hover:border-separate p-2 rounded-lg h-6 bg-slate-50'
      value={value}
      onChange={handleChangeValue}
    />
  );
};
