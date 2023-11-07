import { Link, useLocation } from 'react-router-dom'

import { useAuth } from 'services/auth/AuthContext';

export default function HeaderComponent() {

    const { state, pathname: url } = useLocation();

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const user = authContext.user;

    return (
        <header style={{ paddingTop: "56px" }}>
            <nav className="navbar navbar-expand-sm fixed-top justify-content-between bg-light border-bottom border-2">
                <div className="container">

                    {
                        isAuthenticated &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {
                                    <Link className="nav-link" to="/" state={state}>
                                        <div className={"border-bottom border-1 " + (url === "/" ? "text-dark border-dark" : "border-light")}>
                                            Home
                                        </div>
                                    </Link>
                                }
                            </li>
                        </ul>
                    }

                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/stats" state={state}>
                                    <div className={"border-bottom border-1 " + (url.includes("stats") ? "text-dark border-dark" : "border-light")}>
                                        Stats
                                    </div>
                                </Link>
                            </li>
                        }
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {
                                isAuthenticated && user.photoURL &&
                                <Link className="nav-link py-0" to="/settings" state={state}>
                                    <div className={"text-center border-bottom border-1 " + (url.includes("settings") ? "text-dark border-dark" : "border-light")}>
                                        <img
                                            src={user.photoURL}
                                            style={{ borderRadius: "50%" }}
                                            width="33rem"
                                            height="33rem"
                                            className={(url.includes("settings") ? "border-dark" : "border-light-subtle") + " border border-1"}
                                            alt={user.displayName}
                                        // referrerPolicy='no-referrer'
                                        />
                                    </div>
                                </Link>
                            }
                            {
                                isAuthenticated && !user.photoURL &&
                                <Link className={"nav-link" + (url.includes("settings") ? " text-dark" : "")} to="/settings" state={state}>
                                    <div className={"border-bottom border-1 " + (url.includes("settings") ? "text-dark border-dark" : "border-light")}>
                                        Settings
                                    </div>
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