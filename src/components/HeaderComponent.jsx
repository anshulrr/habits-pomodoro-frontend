import { Link, useLocation } from 'react-router-dom'

import { useAuth } from 'services/auth/AuthContext';

export default function HeaderComponent() {

    const { state, pathname: url } = useLocation();

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const user = authContext.user;

    return (
        <header style={{ paddingTop: "40px" }}>
            <nav className="navbar navbar-expand-sm fixed-top justify-content-between bg-light border-bottom border-2 py-0">
                <div className="container">

                    {
                        isAuthenticated &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {
                                    <Link className={"nav-link" + (url === "/" ? " active" : "")} to="/" state={state}>
                                        Home
                                    </Link>
                                }
                            </li>
                        </ul>
                    }

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
                        <li className="nav-item">
                            {
                                user.photoURL &&
                                <Link className="nav-link py-0" to="/settings" state={state}>
                                    <div className="text-center">
                                        <img
                                            src={user.photoURL}
                                            style={{ borderRadius: "50%" }}
                                            width="35rem"
                                            height="35rem"
                                            className={(url.includes("settings") ? "" : "border-white") + " border border-2"}
                                            alt={user.displayName}
                                        // referrerPolicy='no-referrer'
                                        />
                                    </div>
                                </Link>
                            }
                            {
                                !user.photoURL &&
                                <Link className={"nav-link" + (url.includes("settings") ? " active" : "")} to="/settings" state={state}>
                                    Settings
                                </Link>
                            }
                        </li>
                    </ul>

                    {
                        !isAuthenticated &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login" state={{}}>
                                    Login
                                </Link>
                            </li>
                        </ul>
                    }
                </div>
            </nav>

        </header>
    )
}