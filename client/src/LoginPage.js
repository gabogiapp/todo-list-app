import React from "react";
import "./LoginPage.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="login-bg">
      <div className="login-notebook">
        <div className="login-cover">
          <h1 className="login-title">Welcome to My ToDo Notebook</h1>
          <p className="login-subtitle">Organize your day, beautifully.</p>
        </div>
        <div className="login-content">
          <button
            className="login-btn"
            onClick={() => loginWithRedirect()}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log In with Auth0"}
          </button>
        </div>
      </div>
    </div>
  );
}
