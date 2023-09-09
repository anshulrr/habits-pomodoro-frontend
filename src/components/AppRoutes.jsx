import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HeaderComponent from 'components/HeaderComponent'
import ErrorComponent from 'components/ErrorComponent'
import WelcomeComponent from 'components/WelcomeComponent'
import LoginComponent from 'components/LoginComponent'
import StatsComponent from 'components/stats/StatsComponent'

import 'components/components.css'
import 'components/features/features.css'
import "components/features/comments/comments.css"

import AuthProvider, { useAuth } from 'services/auth/AuthContext'
import ProjectComponent from 'components/features/projects/ProjectComponent'
import TaskComponent from 'components/features/tasks/TaskComponent'
import SettingsComponent from 'components/user-settings/SettingsComponent'
import SignupComponent from 'components/SignupComponent'
import ForgotPasswordComponent from 'components/ForgotPasswordComponent'

function AuthenticatedRoute({ children }) {
    const authContext = useAuth()

    if (authContext.isAuthenticated)
        return children

    return <Navigate to="/" />
}

export default function AppRoutes() {
    return (
        <div className="AppRoutes mb-5">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent />
                    <Routes>
                        <Route path='/' element={<LoginComponent />} />
                        <Route path='/login' element={<LoginComponent />} />
                        <Route path='/signup' element={<SignupComponent />} />
                        <Route path='/forgot-password' element={<ForgotPasswordComponent />} />

                        <Route path='/welcome/:username' element={
                            <AuthenticatedRoute>
                                <WelcomeComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/projects/:id' element={
                            <AuthenticatedRoute>
                                <ProjectComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/tasks/:id' element={
                            <AuthenticatedRoute>
                                <TaskComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/stats' element={
                            <AuthenticatedRoute>
                                <StatsComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/settings' element={
                            <AuthenticatedRoute>
                                <SettingsComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='*' element={<ErrorComponent />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>


        </div>
    )
}