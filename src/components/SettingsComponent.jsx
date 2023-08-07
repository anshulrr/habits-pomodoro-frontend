import { useState } from 'react'
import FirebaseAuthService from '../services/auth/FirebaseAuthService';
import { useAuth } from '../services/auth/AuthContext';
import ListProjectCategoriesComponent from './ListProjectsCategoriesComponent';
import ChangePasswordComponent from './ChangePasswordComponent';

export default function SettingsComponent() {

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
        <div className="container">
            <div className="row">
                <ListProjectCategoriesComponent>
                </ListProjectCategoriesComponent>
                <hr />

                <ChangePasswordComponent>
                </ChangePasswordComponent>
                <hr />
            </div>

        </div>


    )
}