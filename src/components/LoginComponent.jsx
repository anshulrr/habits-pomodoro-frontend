import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'services/auth/AuthContext'
import HomeComponent from 'components/features/HomeComponent'
import FirebaseAuthService from 'services/auth/FirebaseAuthService'
import FooterComponent from './FooterComponent'
import { initCacheDb } from 'services/dbService'

export default function LoginComponent() {

    const authContext = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    const [reloadHome, setReloadHome] = useState(0);

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
            if (!response.user.emailVerified) {
                FirebaseAuthService.signOutUser();
                setErrorMessage("Please click on the verfication link sent to your email")
            }
        } catch (error) {
            setErrorMessage("Authentication Failed. Please check your credentials");
        }
        // Once the user is authenticated, getUserData will be called
        getUserData(); // error handling is done in the async function call
    }

    async function signInWithGoogle() {
        try {
            // console.debug('opening the popup');
            await FirebaseAuthService.signInWithGoogle();
        } catch (error) {
            setErrorMessage("Authentication Failed. Please check your credentials");
        }
        // Once the user is authenticated, getUserData will be called
        getUserData();
    }

    async function getUserData() {
        try {
            // console.debug(response);
            await authContext.getUserSettings();
            // initialize cache db after login
            await initCacheDb();
            console.info("Cache DB initialized! Navigating to home page...")
            // console.debug(authContext.isCacheDbAdded)
            // setting this state to true to indicate that cache db is initialized, and now HomeComponent can be loaded.
            authContext.setCacheDbAdded(true);
            // console.debug(authContext)
            // navigate(`/welcome/${email}`);
            navigate(`/`, { state: {} });
        } catch (error) {
            setErrorMessage("Something went wrong... Please try again later");
        }
    }

    return (
        <div>
            {
                !authContext.isAuthenticated &&
                <div>
                    <div className="container">
                        <div className="row mt-3">
                            <div className="col-lg-6">
                                <h1 className="h3">
                                    Habits Pomodoro
                                </h1>
                                <div>
                                    A productivity tracking web app for learners and anyone who wants to build good habits and break bad once.
                                </div>
                                <div className="login-img mt-4">
                                    <img
                                        src="hourglass.svg"
                                        alt="hourglass"
                                        height="100%"
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
                                        {errorMessage && <div className="alert alert-danger my-2 py-0 px-2 text-center"><small>{errorMessage}</small></div>}
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
                    <FooterComponent />
                </div>
            }

            {
                // alert user that data is being loaded from network on first time login, until cache db is added
                authContext.isAuthenticated &&
                authContext.user &&
                !authContext.isCacheDbAdded &&
                <div className="alert alert-success text-center mb-0" role="alert">
                    Welcome back {authContext.user.displayName || authContext.user.email}!
                    <div>
                        Loading your data from network ...
                    </div>
                    <div>
                        <small>
                            Taking longer than usual? Please check your network connection and refresh the page. If the problem persists, please logout and login again.
                        </small>
                    </div>
                </div>
            }
            {
                // don't load HomeComponent until userSettings and cache data is retrieved, to avoid multiple API calls during first time signin
                authContext.isAuthenticated &&
                authContext.userSettings &&
                authContext.isCacheDbAdded &&
                <HomeComponent
                    key={reloadHome}
                    setReloadHome={setReloadHome}
                />
            }
        </div >
    )
}