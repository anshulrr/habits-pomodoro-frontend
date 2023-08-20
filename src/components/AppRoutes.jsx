import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogoutComponent from './LogoutComponent'
import HeaderComponent from './HeaderComponent'
import ErrorComponent from './ErrorComponent'
import WelcomeComponent from './WelcomeComponent'
import LoginComponent from './LoginComponent'
import StatsComponent from './StatsComponent'

import './AppRoutes.css'
import AuthProvider, { useAuth } from '../services/auth/AuthContext'
import ListProjectsComponent from './ListProjectsComponents'
import ProjectComponent from './ProjectComponent'
import ListTasksComponent from './ListTasksComponent'
import TaskComponent from './TaskComponent'
import PomodoroComponent from './PomodoroComponent'
import SettingsComponent from './SettingsComponent'
import SignupComponent from './SignupComponent'
import ForgotPasswordComponent from './ForgotPasswordComponent'

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

                        <Route path='/projects' element={
                            <AuthenticatedRoute>
                                <ListProjectsComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/projects/:id' element={
                            <AuthenticatedRoute>
                                <ProjectComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/projects/:project_id/tasks' element={
                            <AuthenticatedRoute>
                                <ListTasksComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/projects/:project_id/tasks/:id' element={
                            <AuthenticatedRoute>
                                <TaskComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/tasks/:task_id/pomodoros/:id/:length' element={
                            <AuthenticatedRoute>
                                <PomodoroComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/stats' element={
                            <AuthenticatedRoute>
                                <StatsComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/logout' element={
                            <AuthenticatedRoute>
                                <LogoutComponent />
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