import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("Invalid password");
      } else if (error.code === "auth/user-mismatch") {
        setError("The user account is not responding");
      } else {
        setError("An error occurred during authentication");
      }
    }

    setLoading(false)
  }
  return (
    <>
      <div className="form-card">
        <div className="container">
          <div className="form-card__wrapper">
            <h2 className="form-card__title">Log In</h2>
            {error && <p className="form-card__alert">{error}</p>}
            <form className="form">
              <div className="form__item" id="email">
                <label className="form__label">Email</label>
                <input
                  required
                  ref={emailRef}
                  placeholder="Your Email"
                  type="email"
                  className="form__input"
                  value="licow36277@owube.com"
                />
              </div>
              <div id="password" className="form__item">
                <label className="form__label">Password</label>
                <input
                  required
                  ref={passwordRef}
                  placeholder="Your Password"
                  type="password"
                  className="form__input"
                  value="qazwsx"
                />
              </div>
              <button
                type="submit"
                className="form__button"
                onClick={handleSubmit}
                disabled={loading}
              >
                Log In
              </button>
              
            </form>
              <Link to='/forgot-password' className="form-card__link link">Forgot Password?</Link>
          </div>
            <div className="form-card__link link">
                <span>Need an account?</span> <Link to="/signup">Sign Up</Link>
            </div>
        </div>
      </div>
      
    </>
  );
}

export default Login;
