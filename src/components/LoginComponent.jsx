import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'services/auth/AuthContext'
import HomeComponent from 'components/features/HomeComponent'
import FirebaseAuthService from 'services/auth/FirebaseAuthService'

export default function LoginComponent() {

    const authContext = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    useEffect(
        () => {
            document.title = 'Habits Pomodoro';
        }, []
    )

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
                await authContext.getUserSettings();
                // navigate(`/welcome/${email}`);
                navigate(`/`, { state: {} });
            } else {
                FirebaseAuthService.signOutUser();
                setErrorMessage("Please click on the verfication link sent to your email")
            }
        } catch (error) {
            setErrorMessage("Authentication Failed. Please check your credentials");
        }
    }

    async function signInWithGoogle() {
        try {
            // console.debug('opening the popup');
            await FirebaseAuthService.signInWithGoogle();
            await authContext.getUserSettings();
            navigate(`/`, { state: {} });
        } catch (error) {
            setErrorMessage("Authentication Failed. Please check your credentials");
        }
    }

    return (
        <div>
            {
                !authContext.isAuthenticated &&
                <div className="container">
                    <div className="row mt-3">
                        <div className="col-lg-6">
                            <h1 className="h3">
                                Habits Pomodoro
                            </h1>
                            <div>
                                A productivity tracking web app for students and anyone who wants to build good habits and break bad habits.
                            </div>
                            <div className="login-img mt-4">
                                <img
                                    src="hourglass.svg"
                                    alt="hourglass"
                                    height="100%"
                                    width="100%"
                                    style={{ margin: "auto", display: "block" }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-4 offset-lg-1">
                            <div className="Login pt-3">
                                <h2 className="h5 p-3">
                                    Login to Get Started
                                </h2>
                                <form className="LoginForm" onSubmit={handleSubmit}>
                                    <div className="mb-3">
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
                                    <div className="mb-3">
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
                                    <div className="mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-outline-success"
                                            name="login"
                                        >Sign in</button>
                                    </div>
                                    <div className="text-danger"><small>{errorMessage}</small></div>
                                    <div className="mb-3 text-center">
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
                                    <div className="text-center mb-3">
                                        <div className="separator">or</div>
                                    </div>
                                </form>
                                {/* // <button type="button" className="btn btn-primary p-0" style={{ backgroundColor: '#4285F4' }} name="login" onClick={signInWithGoogle}>
                //     <img src="btn_google_dark_normal_ios.svg" /> Sign in with Google &nbsp;
                // </button> */}
                                <input
                                    type="image"
                                    style={{ height: '50px', imageRendering: '-webkit-optimize-contrast', padding: '0' }}
                                    src="btn_google_signin_dark_normal_web@2x.png"
                                    alt="User profile picture"
                                    onClick={signInWithGoogle}
                                />
                            </div>
                        </div>
                    </div>
                </div >
            }

            {
                // don't load HomeComponent until userSettings is retrieved, to avoid multiple API calls during first time signin
                authContext.isAuthenticated && authContext.userSettings &&
                <HomeComponent />
            }
        </div >
    )
}