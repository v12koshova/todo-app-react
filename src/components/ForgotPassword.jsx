import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const emailRef = useRef();
    const { resetPass } = useAuth();
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    async function handleSubmit(e) {
      e.preventDefault();
  
      try {
        setError("");
        setLoading(true);
        await resetPass(emailRef.current.value);
        setSuccess('Check your inbox for further instructions')
      } catch {
        setError("Failed to reset password");
      }

      setLoading(false);
    }
    return (
      <>
        <div className="form-card">
          <div className="container">
            <div className="form-card__wrapper">
              <h2 className="form-card__title">Reset Password</h2>
              {error && <p className="form-card__alert">{error}</p>}
              {success && <p className="form-card__success">{success}</p>}
              <form className="form">
                <div className="form__item" id="email">
                  <label className="form__label">Email</label>
                  <input
                    required
                    ref={emailRef}
                    placeholder="Your Email"
                    type="email"
                    className="form__input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="form__button"
                  onClick={handleSubmit}
                >
                  Reset Password
                </button>
              </form>
                  <Link className='form-card__link link' to="/login">Log In</Link>
            </div>
          </div>
        </div>
        
      </>
    );
}

export default ForgotPassword