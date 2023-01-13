import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { TrashIcon, PlusIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/solid';

import { ref, set, onValue, push, remove, update } from 'firebase/database';
import { db } from './firebase';

import './index.css';
import { Input } from './components/input';

export type TTodo = {
  key: string;
  label: string;
  isEditMode?: boolean;
};

export type TEditedTodos = Record<string, string>;

const editedTodos: TEditedTodos = {};

function App() {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const todoListRef = ref(db, 'todos/');

  async function handleAddTodo() {
    const newTodo = inputRef.current?.value;

    if (!newTodo) {
      alert('You must type something to be added!');
      return;
    }

    const todoFounded = todos.find((todo) => todo.label === newTodo);

    if (todoFounded) {
      alert(`Todo ${newTodo} was already added! Please type a new one.`);
      return;
    }

    inputRef.current.value = '';

    // push: it creates a new key to add an item to the todo list
    const newTodoRef = push(todoListRef);

    // set: add a new item to the todo list
    set(newTodoRef, {
      label: newTodo,
    });
  }

  // add an item when the user clicks enter
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTodo();
    }
  }

  function handleDeleteTodo(key: TTodo['key']) {
    remove(ref(db, 'todos/' + key));
  }

  function handleTodoEdit(key: TTodo['key']) {
    const valueEdited = editedTodos[key];

    const payload = {
      label: valueEdited,
    };

    handleToggleTodoEdition(key);

    update(ref(db, 'todos/' + key), payload);
  }

  function handleToggleTodoEdition(key: TTodo['key']) {
    const todoIndex = todos.findIndex((todo) => todo.key === key);
    const newTodos = [...todos];
    const currentState = Boolean(newTodos[todoIndex].isEditMode);
    newTodos[todoIndex].isEditMode = !currentState;
    setTodos(newTodos);
  }

  useEffect(() => {
    // observer: it will update the state always the DB changes
    return onValue(todoListRef, (snapshot) => {
      if (snapshot.exists()) {
        const data: TTodo[] = [];

        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          data.push({ ...childData, key: childKey });
        });

        setTodos(data);
      } else {
        setTodos([]);
      }
    });
  }, []);

  return (
    <main className='flex place-items-center h-screen'>
      <section className='p-6 max-w-xl mx-auto bg-slate-50 rounded-sm shadow-lg h-96 flex flex-col'>
        <h1 className='text-center font-bold mb-2'>TODO</h1>

        <div className='flex justify-center gap-2'>
          <form>
            <label htmlFor='newTodo' className='font-bold'>
              New todo:{' '}
            </label>
            <input
              ref={inputRef}
              id='newTodo'
              type='text'
              className='box-border hover:border-separate p-1'
              onKeyDown={handleKeyDown}
            />
          </form>

          <button type='submit'>
            <PlusIcon className='h-5 w-5 hover:opacity-80 hover:cursor-pointer' onClick={handleAddTodo} />
          </button>
        </div>

        {todos.length === 0 ? (
          <h3 className='text-center mt-4 text-slate-400'>You can add new todos anytime!</h3>
        ) : (
          <ul className='list-none mt-4 bg-white overflow-auto flex gap-2 p-2 flex-col rounded-md'>
            {todos.map(({ key, label, isEditMode }) => (
              <li key={key} className='flex justify-between items-center rounded-sm'>
                {isEditMode ? (
                  <Input key={key} todoKey={key} value={label} editedTodos={editedTodos} />
                ) : (
                  <span>{label}</span>
                )}

                <div className='flex gap-1'>
                  {isEditMode ? (
                    <CheckIcon
                      className='h-4 w-4 hover:opacity-80 hover:cursor-pointer'
                      onClick={() => handleTodoEdit(key)}
                    />
                  ) : (
                    <PencilIcon
                      className='h-4 w-4 hover:opacity-80 hover:cursor-pointer'
                      onClick={() => handleToggleTodoEdition(key)}
                    />
                  )}

                  <TrashIcon
                    className='h-4 w-4 hover:opacity-80 hover:cursor-pointer'
                    onClick={() => handleDeleteTodo(key)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
