import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/userService';

const ProtectedRoute = () => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
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