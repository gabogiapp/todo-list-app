import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'https://todo-backend-xxxx.onrender.com/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setText('');
  };

  const toggleTodo = async (id, completed) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    const updated = await res.json();
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t._id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="app">
      <div className="notebook">
        <div className="notebook-cover">
          <h1 className="notebook-title">My ToDo List</h1>
          <div className="notebook-subtitle">Organize your day</div>
        </div>
        
        <div className="notebook-pages">
          <div className="page">
            <div className="page-header">
              <div className="page-number">1</div>
              <div className="date">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            
            <div className="add-todo-section">
              <div className="input-group">
                <input 
                  type="text" 
                  value={text} 
                  onChange={e => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a new task..."
                  className="todo-input"
                />
                <button onClick={addTodo} className="add-btn">
                  <span>+</span>
                </button>
              </div>
            </div>

            <div className="todo-list">
              {todos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No tasks yet. Add your first task above!</p>
                </div>
              ) : (
                todos.map(todo => (
                  <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-content">
                      <div 
                        className={`checkbox ${todo.completed ? 'checked' : ''}`}
                        onClick={() => toggleTodo(todo._id, todo.completed)}
                      >
                        {todo.completed && <span className="checkmark">✓</span>}
                      </div>
                      <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(todo._id)} 
                      className="delete-btn"
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {todos.length > 0 && (
              <div className="todo-stats">
                <span>{todos.filter(t => t.completed).length} of {todos.length} completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
