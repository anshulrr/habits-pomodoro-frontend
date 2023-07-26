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
            // console.log('handle submitt')
            setShowErrorMessage(true)
        }
    }

    function signInWithGoogle() {

        // signInWithPopup(auth, provider)
        //     .then((result) => {
        //         // This gives you a Google Access Token. You can use it to access the Google API.
        //         const credential = GoogleAuthProvider.credentialFromResult(result);
        //         const token = credential.accessToken;
        //         // The signed-in user info.
        //         const user = result.user;
        //         // IdP data available using getAdditionalUserInfo(result)
        //         // ...
        //     }).catch((error) => {
        //         // Handle Errors here.
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         // The email of the user's account used.
        //         const email = error.customData.email;
        //         // The AuthCredential type that was used.
        //         const credential = GoogleAuthProvider.credentialFromError(error);
        //         // ...
        //     });




        signInWithPopup(auth, provider).then((a) => console.log(a))
    }

    return (
        <div>
            {
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
            }

            {
                <button type="button" className="btn btn-sm btn-outline-success" name="login" onClick={signInWithGoogle}>Google SignIn</button>
            }

            {
                authContext.isAuthenticated &&
                <WelcomeComponent username={authContext.username} />

            }
        </div>
    )
}