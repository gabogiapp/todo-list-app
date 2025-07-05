import React, { useEffect, useState } from 'react';
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./LoginPage";

const API_URL = 'https://todo-list-backend-9ok9.onrender.com/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();

  useEffect(() => {
    const fetchTodos = async () => {
      if (!isAuthenticated) return;
      const token = await getAccessTokenSilently();
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTodos(data);
    };
    fetchTodos();
  }, [isAuthenticated, getAccessTokenSilently]);

  const addTodo = async () => {
    if (!text.trim()) return;
    const token = await getAccessTokenSilently();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setText('');
  };

  const toggleTodo = async (id, completed) => {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !completed })
    });
    const updated = await res.json();
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    const token = await getAccessTokenSilently();
    await fetch(`${API_URL}/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setTodos(todos.filter(t => t._id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (!isAuthenticated && !isLoading) {
    return <LoginPage />;
  }

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

            {!isAuthenticated ? (
              <button onClick={() => loginWithRedirect()}>Log In</button>
            ) : (
              <div>
                <span>Welcome, {user.name}!</span>
                <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
