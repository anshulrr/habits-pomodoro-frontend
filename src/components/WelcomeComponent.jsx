import { Link } from 'react-router-dom'

export default function WelcomeComponent({ username }) {

    return (
        <div className="WelcomeComponent">
            <h1>Welcome {username}</h1>
            <div>
                <Link to="/projects">Manage your projects</Link>
            </div>
        </div>
    )
}