import { Link } from 'react-router-dom'
import { useAuth } from '../services/auth/AuthContext';

export default function HeaderComponent() {

    const authContext = useAuth()

    // const username = authContext.username

    const isAuthenticated = authContext.isAuthenticated

    function logout() {
        authContext.logout()
    }

    return (
        <header>
            <div className="container">
                <nav className="navbar navbar-expand-sm justify-content-between border-bottom border-light border-2 mb-3">

                    {/* <ul className="navbar-nav">
                            {isAuthenticated
                                && <li className="nav-item fs-5"><Link className="nav-link" to={"/welcome/" + username}>Home</Link></li>}
                        </ul> */}
                    <ul className="navbar-nav">
                        {isAuthenticated
                            && <li className="nav-item"><Link className="nav-link" to="/projects">Projects</Link></li>}
                    </ul>
                    <ul className="navbar-nav">
                        {isAuthenticated
                            && <li className="nav-item"><Link className="nav-link" to="/pomodoros">Stats</Link></li>}
                    </ul>

                    <ul className="navbar-nav">
                        {!isAuthenticated
                            && <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>}
                        {isAuthenticated
                            && <li className="nav-item"><Link className="nav-link" to="/logout" onClick={logout}>Logout</Link></li>}
                    </ul>
                </nav>
            </div>
        </header>
    )
}