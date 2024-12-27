import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Settings() {
  const { currentUser, changePassword, changeEmail, deleteAcc } = useAuth();
  const emailRef = useRef();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    e.preventDefault();

    setLoading(true)
    setError("");
    setSuccess("")

    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      promises.push(changeEmail(emailRef.current.value));
    }

    if (password) {
      if (password !== passwordConfirm) {
        return setError("Passwords do not match");
      }
      promises.push(changePassword(password));
    }

    Promise.all(promises)
      .then(() => {
        setSuccess("Profile is updated");
      })
      .catch(() => {
        setError("Failed to update the account");
      })
      .finally(() => {
        setPassword('')
        setPasswordConfirm('')
        setLoading(false)
      })
  }

  return (
    <div className="form-card">
      <div className="container">
        <div className="form-card__wrapper">
          <h2 className="form-card__title">Profile</h2>
          {!currentUser.emailVerified && (
            <p className="form-card__alert">
              Verify the account to edit your info <br /> Check your inbox for the verification letter
            </p>
          )}
          {error && <p className="form-card__alert">{error}</p>}
          {success && <p className="form-card__success">{success}</p>}
          <form className="form">
            <div className="form__item" id="email">
              <label className="form__label">Email</label>
              <input
                defaultValue={currentUser.email}
                required
                ref={emailRef}
                placeholder="Your Email"
                type="email"
                className="form__input"
              />
            </div>
            <div id="password" className="form__item">
              <label className="form__label">Change Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep the same"
                type="password"
                className="form__input"
              />
            </div>
            <div id="password" className="form__item">
              <label className="form__label">Password Conformation</label>
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Leave blank to keep the same"
                type="password"
                className="form__input"
              />
            </div>
            <button
              disabled={!currentUser.emailVerified || loading}
              type="submit"
              className="form__button"
              onClick={handleChange}
            >
              Update
            </button>
          </form>
          <button disabled={loading} onClick={() => deleteAcc()} className="form-card__sub">Delete account</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
