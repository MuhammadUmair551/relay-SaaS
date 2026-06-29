import { createBrowserRouter, Navigate } from "react-router-dom";

import AppShell from '../components/layout/AppShell';
import ProtectedRoute from '../components/layout/ProtectedRoute';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/projects/Projects';
import ProjectDetail from "../pages/projects/ProjectDetail";
import Settings from '../pages/settings/Settings';
import ClientView from "../pages/client/ClientView";
import NotFound      from '../pages/NotFound';

export const router = createBrowserRouter([
    { path: '/', element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {path: '/c/:token', element: <ClientView />},
    {path: '*', element: <NotFound />},

    {
        element: (
            <ProtectedRoute>
                <AppShell />
            </ProtectedRoute>
        ),
        children: [
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/projects', element: <Projects /> },
            { path: '/projects/:id', element: <ProjectDetail />},  
            { path: '/settings', element: <Settings /> },
        ]
    }
]);
