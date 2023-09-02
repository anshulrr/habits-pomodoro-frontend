import { useState } from 'react'
import FirebaseAuthService from 'services/auth/FirebaseAuthService';

export default function SignupComponent() {
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function handleSubmit(event) {
        event.preventDefault();

        // console.debug(email, password, confirmPassword)
        setErrorMessage('')
        setSuccessMessage('')
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setErrorMessage('Invalid email address')
            return;
        }
        // todo: decide and check password rules
        if (password !== confirmPassword) {
            setErrorMessage("Password doesn't match");
            return;
        }
        try {
            await FirebaseAuthService.registerUser(email, password);
            setSuccessMessage("Sign up is completed. To Sign in, please click on the verification link sent to your email")
            setEmail('')
            setPassword('')
            setConfirmPassword('')
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <div className="Signup mt-3">
            <form className="SignupForm" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-sm mb-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                placeholder="Email"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-sm mb-3"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder='New password'
                                required
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control form-control-sm mb-3"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                required
                            />
                            <div className="mb-3 text-danger"><small>{errorMessage}</small></div>
                            <button
                                type="submit"
                                className="btn btn-sm btn-outline-success mb-3"
                                name="changePassword"
                            >Sign up</button>
                            <div className="mb-3 text-success"><small>{successMessage}</small></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}