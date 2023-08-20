import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '../services/auth/AuthContext';
import UserCommentsComponent from './UserCommentsComponent';

export default function HeaderComponent() {

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const user = authContext.user;

    const url = useLocation().pathname;

    function logout() {
        authContext.logout()
    }

    return (
        <header>
            <div className="container border-bottom border-2 mb-3">
                <nav className="navbar navbar-expand-sm justify-content-between">

                    {
                        isAuthenticated && user.photoURL &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link py-0" to="/">
                                    <div className="text-center">
                                        <img
                                            src={user.photoURL}
                                            style={{ borderRadius: "50%" }}
                                            width="35rem"
                                            height="35rem"
                                            className="float-start"
                                            alt={user.displayName}
                                        // referrerPolicy='no-referrer'
                                        />
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    }

                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className={"nav-link" + (url.includes("projects") ? " active" : "")} to="/projects">
                                    Projects
                                </Link>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className={"nav-link" + (url.includes("stats") ? " active" : "")} to="/stats">
                                    Stats
                                </Link>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className={"nav-link" + (url.includes("settings") ? " active" : "")} to="/settings">
                                    Settings
                                </Link>
                            </li>
                        }
                    </ul>

                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className="nav-link" onClick={logout}>
                                    Logout
                                </Link>
                            </li>
                        }
                        {
                            !isAuthenticated &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>
                        }
                    </ul>
                </nav>
            </div>

            {
                isAuthenticated &&
                <UserCommentsComponent />
            }

        </header>
    )
}