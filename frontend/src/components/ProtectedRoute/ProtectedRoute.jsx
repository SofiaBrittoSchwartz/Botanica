import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/userService';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const ProtectedRoute = () => {
    const [auth, setAuth] = useState(DEMO_MODE ? true : null);

    useEffect(() => {
        if (DEMO_MODE) return;
        const checkAuth = async () => {
            const { authenticated } = await getCurrentUser();
            setAuth(authenticated);
        };
        checkAuth();
    }, []);

    if (auth === null) {
        return <div>Loading...</div>;
    }
    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;