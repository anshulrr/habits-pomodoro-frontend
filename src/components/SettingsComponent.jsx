import { useState } from 'react'
import FirebaseAuthService from '../services/auth/FirebaseAuthService';

export default function SettingsComponent() {

    const [email, setEmail] = useState('');
    FirebaseAuthService.subscribeToAuthChanges(setEmail);

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
    }

    async function handleSubmit(error) {
        error.preventDefault();

        setErrorMessage('')
        setSuccessMessage('')
        // todo: decide and check password rules
        if (password !== confirmPassword) {
            setErrorMessage("Password doesn't match");
            return;
        }
        try {
            await FirebaseAuthService.changePassword(password);
            setPassword('')
            setConfirmPassword('')
            setSuccessMessage('Password Changed Successfully')
        } catch (error) {
            console.error(error);
            const errorCode = error.code;
            if (errorCode === "auth/requires-recent-login") {
                setErrorMessage("Please sign in again to change password")
            } else if (errorCode === "auth/weak-password") {
                setErrorMessage("Password should be at least 6 characters")
            } else {
                // todo: don't show firebase error to user
                let message = error.message;
                message = message.slice(10);
                setErrorMessage(message);
            }
        }
    }

    return (
        <div className="ChangePassword">
            <form className="ChangePasswordForm" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-sm mb-3"
                                value={email}
                                autoComplete="email"
                                // style={{ display: "none" }}
                                disabled    // for password manager
                            />
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-sm mb-3"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                                placeholder='New password'
                                required
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control form-control-sm mb-3"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                required
                            />
                            <div className="mb-3 text-danger"><small>{errorMessage}</small></div>
                            <div className="mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-outline-success"
                                    name="changePassword"
                                >Change Password</button>
                            </div>
                            <div className="mb-3 text-success"><small>{successMessage}</small></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}