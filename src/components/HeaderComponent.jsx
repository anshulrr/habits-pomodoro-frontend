import { Link } from 'react-router-dom'
import { useAuth } from '../services/auth/AuthContext';

export default function HeaderComponent() {

    const authContext = useAuth()

    const username = authContext.username

    const isAuthenticated = authContext.isAuthenticated;

    function logout() {
        authContext.logout()
    }

    return (
        <header className="border-bottom border-light border-5 mb-5 p-2">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">

                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                {isAuthenticated
                                    && <li className="nav-item fs-5"><Link className="nav-link" to={"/welcome/" + username}>Home</Link></li>}
                                {isAuthenticated
                                    && <li className="nav-item fs-5"><Link className="nav-link" to="/projects">Projects</Link></li>}
                            </ul>
                        </div>

                        <ul className="navbar-nav">
                            {!isAuthenticated
                                && <li className="nav-item fs-5"><Link className="nav-link" to="/login">Login</Link></li>}
                            {isAuthenticated
                                && <li className="nav-item fs-5"><Link className="nav-link" to="/logout" onClick={logout}>Logout</Link></li>}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}