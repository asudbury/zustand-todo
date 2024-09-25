import { create } from 'zustand';
import React, { useState } from 'react';

// Define a type for the todo item
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Define the state and actions for the Zustand store
interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

// Zustand store implementation
const useTodoStore = create<TodoState>((set: (arg0: { (state: any): { todos: any[]; }; (state: any): { todos: any; }; (state: any): { todos: any; }; }) => any) => ({
  todos: [],
  addTodo: (title: string) =>
    set((state: { todos: any; }) => ({
      todos: [...state.todos, { id: Date.now(), title, completed: false }],
    })),
  toggleTodo: (id: number) =>
    set((state: { todos: any[]; }) => ({
      todos: state.todos.map((todo: { id: number; completed: any; }) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  deleteTodo: (id: number) =>
    set((state: { todos: any[]; }) => ({
      todos: state.todos.filter((todo: { id: number; }) => todo.id !== id),
    })),
}));

// Todo component to display individual tasks
interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useTodoStore();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <span
        onClick={() => toggleTodo(todo.id)}
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          cursor: 'pointer',
        }}
      >
        {todo.title}
      </span>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </div>
  );
};

// Main TodoList component
const TodoList: React.FC = () => {
  const { todos, addTodo } = useTodoStore();
  const [newTodo, setNewTodo] = useState<string>('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo(''); // Clear the input after adding
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Zustand To-Do List</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          style={{ flexGrow: 1, marginRight: '10px' }}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      {todos.length === 0 ? (
        <p>No todos yet!</p>
      ) : (
        todos.map((todo: Todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </div>
  );
};

export default TodoList;
