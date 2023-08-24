import { Link, useLocation } from 'react-router-dom'

import { useAuth } from 'services/auth/AuthContext';
import UserCommentsComponent from 'components/features/comments/UserCommentsComponent';

export default function HeaderComponent() {

    const { state, pathname: url } = useLocation();

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const user = authContext.user;

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
                                <Link className="nav-link py-0" to="/" state={state}>
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
                                <Link className={"nav-link" + (url.includes("projects") ? " active" : "")} to="/projects" state={state}>
                                    Projects
                                </Link>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className={"nav-link" + (url.includes("stats") ? " active" : "")} to="/stats" state={state}>
                                    Stats
                                </Link>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className={"nav-link" + (url.includes("settings") ? " active" : "")} to="/settings" state={state}>
                                    Settings
                                </Link>
                            </li>
                        }
                    </ul>

                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className="nav-link" onClick={logout} state={state}>
                                    Logout
                                </Link>
                            </li>
                        }
                        {
                            !isAuthenticated &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/login" state={state}>
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