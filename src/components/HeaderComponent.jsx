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
                                <div className={"my-2 mx-2 border-bottom border-1 " + (url === "/" ? "text-success border-success" : "text-secondary border-light")}>
                                    <i className="bi bi-house"></i>
                                    <div className="button-title">
                                        Home
                                    </div>
                                </div>
                            </Link>
                        }

                        <div className="d-flex">
                            <Link className="nav-link" to="/about" state={state}>
                                <div className={"my-2 mx-2 border-bottom border-1 " + (url.includes("about") ? "text-success border-success" : "text-secondary border-light")}>
                                    <i className="bi bi-info-circle"></i>
                                    <div className="button-title">
                                        About
                                    </div>
                                </div>
                            </Link>
                            {
                                isAuthenticated &&
                                <Link className="nav-link" to="/stats" state={state}>
                                    <div className={"my-2 mx-2 border-bottom border-1 " + (url.includes("stats") ? "text-success border-success" : "text-secondary border-light")}>
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
                                    <div className={"my-2 mx-2 border-bottom border-1 " + (url.includes("settings") ? "text-success border-success" : "text-secondary border-light")}>
                                        <i className="bi bi-gear"></i>
                                        <div className="button-title">
                                            Settings
                                        </div>
                                    </div>
                                </Link>
                            }
                            {
                                isAuthenticated && user.photoURL &&
                                <div className="text-center" style={{ paddingTop: "8px" }}>
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
                            <Link className="nav-link" to="/login" state={{}}>
                                <div className={"my-2 mx-2 border-bottom border-1 " + (url.includes("login") || url === "/" ? "text-success border-success" : "text-secondary border-light")}>
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    <div className="button-title">
                                        Login
                                    </div>
                                </div>
                            </Link>
                        }
                    </div>
                </div>
            </nav>

        </header>
    )
}