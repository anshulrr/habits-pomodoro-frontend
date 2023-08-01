import { useState } from 'react'
import { auth, updatePassword } from '../services/firebaseConfig';

export default function SettingsComponent() {
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

    async function handleSubmit() {
        setErrorMessage('')
        setSuccessMessage('')
        // todo: decide and check password rules
        if (password !== confirmPassword) {
            setErrorMessage("Password doesn't match");
            return;
        }
        try {
            await updatePassword(auth.currentUser, password);
            setSuccessMessage('Password Changed Successfully')
        } catch (error) {
            console.log(error);
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
            <form className="ChangePasswordForm">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4 mb-3">
                            <input type="password" name="password" className="form-control form-control-sm" value={password} onChange={handlePasswordChange} autoComplete="current-password" placeholder='new password' />
                        </div>
                        <div className="col-md-4 offset-md-4 mb-3">
                            <input type="password" name="confirmPassword" className="form-control form-control-sm" value={confirmPassword} onChange={handleConfirmPasswordChange} autoComplete="current-password" placeholder="confirm password" />
                        </div>
                        {errorMessage && <div className="col-md-4 offset-md-4 mb-3 text-danger"><small>{errorMessage}</small></div>}
                        <div className="col-md-4 offset-md-4 mb-3">
                            <button type="button" className="btn btn-sm btn-outline-success" name="changePassword" onClick={handleSubmit}>Change Password</button>
                        </div>
                        {successMessage && <div className="col-md-4 offset-md-4 mb-3 text-success"><small>{successMessage}</small></div>}
                    </div>
                </div>
            </form>
        </div>
    )
}