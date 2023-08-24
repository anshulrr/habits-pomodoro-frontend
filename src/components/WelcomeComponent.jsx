import { Link, useLocation } from 'react-router-dom'

export default function WelcomeComponent({ username }) {

    const { state } = useLocation();

    return (
        <div className="WelcomeComponent">
            <h1>Welcome {username}</h1>
            <div>
                <Link to="/projects" state={state}>Manage your projects</Link>
            </div>
        </div>
    )
}