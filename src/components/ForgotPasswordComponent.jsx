import { useState } from 'react'

import FirebaseAuthService from 'services/auth/FirebaseAuthService';

export default function ForgotPasswordComponent() {
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [email, setEmail] = useState('')

    async function handleSubmit(error) {
        error.preventDefault();

        setErrorMessage('')
        setSuccessMessage('')
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setErrorMessage('Invalid email address')
            return
        }
        try {
            await FirebaseAuthService.initiatePasswordResetEmail(email)
            setSuccessMessage("Email sent successfully")
            setEmail('')
        } catch (error) {
            console.error(error);
            if (error.code === "auth/user-not-found") {
                setErrorMessage("Email is not registered")
            } else {
                setErrorMessage("Something went wrong")
            }
        }
    }

    return (
        <div className="Forgot mt-3">
            <form className="ForgotForm" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    placeholder="email"
                                    required
                                />
                            </div>
                            <div className="mb-3 text-danger"><small>{errorMessage}</small></div>
                            <div className="mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-outline-success"
                                    name="forgot-password"
                                >Get an email to reset password</button>
                            </div>
                            <div className="mb-3 text-success"><small>{successMessage}</small></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}