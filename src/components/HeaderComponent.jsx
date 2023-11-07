import { Link, useLocation } from 'react-router-dom'

import { useAuth } from 'services/auth/AuthContext';

export default function HeaderComponent() {

    const { state, pathname: url } = useLocation();

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const user = authContext.user;

    return (
        <header style={{ paddingTop: "56px" }}>
            <nav className="fixed-top bg-light border-bottom border-2">
                <div className="container">
                    <div className="d-flex justify-content-between header-menu">

                        {
                            isAuthenticated &&
                            <Link className={"nav-link" + (url === "/" ? " text-success" : "")} to="/" state={state}>
                                <div className={"my-2 ms-1 border-bottom border-1 " + (url === "/" ? "text-success border-success" : "text-secondary border-light")}>
                                    <i className="bi bi-house"></i>
                                    <div className="button-title">
                                        Home
                                    </div>
                                </div>
                            </Link>
                        }

                        <div className="d-flex">
                            {
                                isAuthenticated &&
                                <Link className="nav-link" to="/stats" state={state}>
                                    <div className={"my-2 border-bottom border-1 " + (url.includes("stats") ? "text-success border-success" : "text-secondary border-light")}>
                                        <i className="bi bi-graph-up"></i>
                                        <div className="button-title">
                                            Stats
                                        </div>
                                    </div>
                                </Link>
                            }
                            {
                                isAuthenticated &&
                                <Link className="nav-link" to="/settings" state={state}>
                                    <div className={"my-2 ms-3 border-bottom border-1 " + (url.includes("settings") ? "text-success border-success" : "text-secondary border-light")}>
                                        <i className="bi bi-gear"></i>
                                        <div className="button-title">
                                            Settings
                                        </div>
                                    </div>
                                </Link>
                            }
                            {
                                isAuthenticated && user.photoURL &&
                                <div className="ms-2 text-center" style={{ paddingTop: "8px" }}>
                                    <img
                                        src={user.photoURL}
                                        style={{ borderRadius: "50%" }}
                                        width="40rem"
                                        height="40rem"
                                        className={"border-light-subtle border border-1"}
                                        alt={user.displayName}
                                    // referrerPolicy='no-referrer'
                                    />
                                </div>
                            }
                        </div>

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
                </div>
            </nav>

        </header>
    )
}