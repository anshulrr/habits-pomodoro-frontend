import { useState } from 'react'
import { putChangePasswordApi } from '../services/api/AuthApiService'

export default function SettingsComponent() {

    const [showErrorMessage, setShowErrorMessage] = useState(false)
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
        setSuccessMessage('')
        if (password !== confirmPassword) {
            setShowErrorMessage(true);
            return;
        } else {
            setShowErrorMessage(false);
            putChangePasswordApi(password)
                .then(response => {
                    // console.log(response)
                    setSuccessMessage('Password Changed Successfully')
                })
                .catch(error => console.error(error.message))
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
                        {showErrorMessage && <div className="col-md-4 offset-md-4 mb-3 text-danger"><small>Passwords doesn't match</small></div>}
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