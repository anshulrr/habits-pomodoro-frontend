import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, createUserWithEmailAndPassword, sendEmailVerification } from '../services/firebaseConfig';

export default function SignupComponent() {
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate();

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
    }

    async function handleSubmit() {
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
            await createUserWithEmailAndPassword(auth, email, password)
            // console.debug(response);
            await sendEmailVerification(auth.currentUser);
            // console.debug(email_response);
            setSuccessMessage("Sign up is completed. To verify email, please click on the verification link sent to your email")
        } catch (error) {
            console.error(error);
            const errorCode = error.code;
            if (errorCode === "auth/weak-password") {
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
        <div className="Signup">
            <form className="SignupForm">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 offset-md-4 mb-3">
                            <input type="email" name="email" className="form-control form-control-sm" value={email} onChange={handleEmailChange} autoComplete="email" placeholder="email" />
                        </div>
                        <div className="col-md-4 offset-md-4 mb-3">
                            <input type="password" name="password" className="form-control form-control-sm" value={password} onChange={handlePasswordChange} autoComplete="current-password" placeholder='new password' />
                        </div>
                        <div className="col-md-4 offset-md-4 mb-3">
                            <input type="password" name="confirmPassword" className="form-control form-control-sm" value={confirmPassword} onChange={handleConfirmPasswordChange} autoComplete="current-password" placeholder="confirm password" />
                        </div>
                        <div className="col-md-4 offset-md-4 mb-3 text-danger"><small>{errorMessage}</small></div>
                        <div className="col-md-4 offset-md-4 mb-3">
                            <button type="button" className="btn btn-sm btn-outline-success" name="changePassword" onClick={handleSubmit}>Sign up</button>
                        </div>
                        {
                            successMessage &&
                            <div>
                                <div className="col-md-4 offset-md-4 mb-3 text-success"><small>{successMessage}</small></div>
                                <button type="button" className="btn btn-sm btn-outline-success" name="signin" onClick={() => navigate('/')}>Sign up</button>
                            </div>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}