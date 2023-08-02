import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../services/auth/AuthContext'
import WelcomeComponent from './WelcomeComponent'
import FirebaseAuthService from '../services/auth/FirebaseAuthService'

export default function LoginComponent() {

    const authContext = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    async function handleSubmit(error) {
        error.preventDefault();

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setErrorMessage('Invalid email address')
            return
        }

        // todo: decide and check password rules
        try {
            const response = await FirebaseAuthService.signInUser(email, password)
            // console.debug(response);
            if (response.user.emailVerified) {
                await authContext.jwtSignIn(response.user.accessToken);
                // navigate(`/welcome/${email}`);
                navigate(`/projects`);
            } else {
                setErrorMessage("Please click on the verfication link sent to your email")
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Authentication Failed. Please check your credentials");
        }
    }

    async function signInWithGoogle() {
        try {
            const response = await FirebaseAuthService.signInWithGoogle();
            await authContext.jwtSignIn(response.user.accessToken);
            navigate(`/projects`);
        } catch (error) {
            console.error(error);
            setErrorMessage("Authentication Failed. Please check your credentials");
        }
    }

    return (
        <div>
            {
                !authContext.isAuthenticated &&
                <div className="Login">
                    <form className="LoginForm" onSubmit={handleSubmit}>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4 offset-md-4">
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <input
                                                type="email"
                                                name="email"    // for suggestions
                                                className="form-control form-control-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email" // for password managers
                                                placeholder="Email"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control form-control-sm"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="current-password"
                                                placeholder='Password'
                                                required
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-outline-success"
                                                name="login"
                                            >Sign in</button>
                                        </div>
                                        <div className="text-danger"><small>{errorMessage}</small></div>
                                        <div className="col-md-12 mb-3 text-center">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-link"
                                                name="forgot-password"
                                                onClick={() => navigate('/forgot-password')}
                                            >Forgot Password?</button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-link"
                                                name="signup"
                                                onClick={() => navigate('/signup')}
                                            >New user? Register here</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            }

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
        </div >
    )
}