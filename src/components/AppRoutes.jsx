import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogoutComponent from './LogoutComponent'
import HeaderComponent from './HeaderComponent'
import ErrorComponent from './ErrorComponent'
import WelcomeComponent from './WelcomeComponent'
import LoginComponent from './LoginComponent'

import './AppRoutes.css'
import AuthProvider, { useAuth } from '../services/auth/AuthContext'
import ListProjectsComponent from './ListProjectsComponents'
import ProjectComponent from './ProjectComponent'
import ListTasksComponent from './ListTasksComponent'
import TaskComponent from './TaskComponent'
import PomodoroComponent from './PomodoroComponent'

function AuthenticatedRoute({ children }) {
    const authContext = useAuth()

    if (authContext.isAuthenticated)
        return children

    return <Navigate to="/" />
}

export default function AppRoutes() {
    return (
        <div className="AppRoutes">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent />
                    <Routes>
                        <Route path='/' element={<LoginComponent />} />
                        <Route path='/login' element={<LoginComponent />} />

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

                        <Route path='/tasks/:task_id/pomodoros' element={
                            <AuthenticatedRoute>
                                <PomodoroComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='/logout' element={
                            <AuthenticatedRoute>
                                <LogoutComponent />
                            </AuthenticatedRoute>
                        } />

                        <Route path='*' element={<ErrorComponent />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>


        </div>
    )
}