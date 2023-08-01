import { useState } from 'react'
import { auth, sendPasswordResetEmail } from '../services/firebaseConfig';

export default function ForgotPasswordComponent() {
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [email, setEmail] = useState('')

    function handleEmailChange(event) {
        setEmail(event.target.value)
    }

    async function handleSubmit() {
        setErrorMessage('')
        setSuccessMessage('')
        // todo: validate email
        try {
            await sendPasswordResetEmail(auth, email)
            setSuccessMessage("Email sent successfully")
        } catch (error) {
            console.error(error);
            setErrorMessage("Something went wrong")
        }
    }

    return (
        <div className="Signup">
            <form className="SignupForm">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4 mb-3">
                            <input type="email" name="email" className="form-control form-control-sm" value={email} onChange={handleEmailChange} autoComplete="email" placeholder="email" />
                        </div>
                        <div className="col-md-4 offset-md-4 mb-3 text-danger"><small>{errorMessage}</small></div>
                        <div className="col-md-4 offset-md-4 mb-3">
                            <button type="button" className="btn btn-sm btn-outline-success" name="forgot-password" onClick={handleSubmit}>Get an email to reset password</button>
                        </div>
                        {
                            successMessage &&
                            <div className="col-md-4 offset-md-4 mb-3 text-success"><small>{successMessage}</small></div>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}