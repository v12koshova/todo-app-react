import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        setError('')

        if (passwordConfirmRef.current.value !== passwordRef.current.value) {
            setError('Passwords do not match')
            return
        } 

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate('/')

        } catch {
            setError('Failed to create an account')
        }

        setLoading(false)
    }

  return (
    <div className="form-card">
      <div className="container">
        <div className="form-card__wrapper">
          <h2 className="form-card__title">Sign Up</h2>
          {error && <p className="form-card__alert">{error}</p>}
          <form className="form">
            <div className="form__item" id="email">
              <label className="form__label">Email</label>
              <input required ref={emailRef} placeholder="Your Email" type="email" className="form__input" />
            </div>
            <div id="password" className="form__item">
              <label className="form__label">Password</label>
              <input required ref={passwordRef} placeholder="Password" type="password" className="form__input" />
            </div>
            <div id="password" className="form__item">
              <label className="form__label">Password Conformation</label>
              <input required ref={passwordConfirmRef} placeholder="Repeat your password" type="password" className="form__input" />
            </div>
            <button disabled={loading} type="submit" className="form__button" onClick={handleSubmit}>
              Sign In
            </button>
          </form>
          <div className="form-card__sub">
            <span>Already have an account? </span><Link to='/login'>Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
