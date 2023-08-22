import { useState } from 'react'

import FirebaseAuthService from 'services/auth/FirebaseAuthService';
import { useAuth } from 'services/auth/AuthContext';

export default function ChangePasswordComponent() {

    const authContext = useAuth();
    const email = authContext.user.email;

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
            setErrorMessage(error.message);
        }
    }

    return (
        <div className="ChangePassword">
            <form className="ChangePasswordForm" onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-sm mb-2"
                                value={email}
                                autoComplete="email"
                                // style={{ display: "none" }}
                                disabled    // for password manager
                            />
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-sm mb-2"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                                placeholder='New password'
                                required
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control form-control-sm mb-2"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                required
                            />
                            <div className="mb-2 text-danger"><small>{errorMessage}</small></div>
                            <div className="">
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-success"
                                    name="changePassword"
                                >Change Password</button>
                            </div>
                            <div className="text-success"><small>{successMessage}</small></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}