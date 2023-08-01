import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../services/auth/AuthContext'
import WelcomeComponent from './WelcomeComponent'

import { auth, provider, signInWithPopup } from '../services/firebaseConfig';

export default function LoginComponent() {

    const authContext = useAuth()

    const [username, setUsername] = useState('')

    const [password, setPassword] = useState('')

    const [showErrorMessage, setShowErrorMessage] = useState(false)

    const navigate = useNavigate();

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit() {
        if (await authContext.login(username, password)) {
            // navigate(`/welcome/${username}`);
            navigate(`/projects`);
        } else {
            // console.debug('handle submitt')
            setShowErrorMessage(true)
        }
    }

    function signInWithGoogle() {
        signInWithPopup(auth, provider)
            .then((response) => {
                // console.debug(response)
                authContext.googleSignIn(response.user.accessToken);
            }).catch((error) => {
                console.error(error);
            });
    }

    return (
        <div>
            {/* {
                !authContext.isAuthenticated &&
                <div className="Login">
                    <form className="LoginForm">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4 offset-md-4 mb-3">
                                    <input type="text" name="username" className="form-control form-control-sm" value={username} onChange={handleUsernameChange} autoComplete="username" placeholder="username" />
                                </div>
                                <div className="col-md-4 offset-md-4 mb-3">
                                    <input type="password" name="password" className="form-control form-control-sm" value={password} onChange={handlePasswordChange} autoComplete="current-password" placeholder='password' />
                                </div>
                                <div className="col-md-4 offset-md-4 mb-3">
                                    <button type="button" className="btn btn-sm btn-outline-success" name="login" onClick={handleSubmit}>login</button>
                                </div>
                                {showErrorMessage && <div className="ErrorMessage text-danger"><small>Authentication Failed. Please check your credentials</small></div>}
                            </div>
                        </div>
                    </form>
                </div>
            } */}

            {
                !authContext.isAuthenticated &&
                // <button type="button" className="btn btn-primary p-0" style={{ backgroundColor: '#4285F4' }} name="login" onClick={signInWithGoogle}>
                //     <img src="btn_google_dark_normal_ios.svg" /> Sign in with Google &nbsp;
                // </button>
                <input
                    type="image"
                    style={{ height: '60px', imageRendering: '-webkit-optimize-contrast' }}
                    src="btn_google_signin_dark_normal_web@2x.png"
                    onClick={signInWithGoogle}
                />
            }

            {
                authContext.isAuthenticated &&
                <WelcomeComponent username={authContext.username} />

            }
        </div>
    )
}