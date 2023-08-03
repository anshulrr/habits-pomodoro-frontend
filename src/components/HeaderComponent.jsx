import { Link } from 'react-router-dom'
import { useAuth } from '../services/auth/AuthContext';

export default function HeaderComponent() {

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const user = authContext.user;

    function logout() {
        authContext.logout()
    }

    return (
        <header>
            <div className="container">
                <nav className="navbar navbar-expand-sm justify-content-between border-bottom border-light border-2 mb-3">

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
                            <li className="nav-item"><Link className="nav-link" to="/projects">Projects</Link></li>
                        }
                    </ul>
                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item"><Link className="nav-link" to="/stats">Stats</Link></li>
                        }
                    </ul>
                    <ul className="navbar-nav">
                        {
                            isAuthenticated &&
                            <li className="nav-item">
                                <Link className="nav-link" to="/settings">
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
        </header>
    )
}