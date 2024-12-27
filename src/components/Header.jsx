import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/general/header.css"

function Header() {
  const { currentUser, signout } = useAuth();
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <h1 className="header__logo">
              <Link to="/">ToDo</Link>
            </h1>
            { currentUser && 
              <div className="header__buttons">
                <Link
                  to="/settings"
                  className="header__user"
                ></Link>
                <button className="header__logout" onClick={() => signout()}>Log Out</button>
              </div>
            }
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Header;
