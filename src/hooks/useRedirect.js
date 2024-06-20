import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useRedirect = (userAuthStatus) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMount = async () => {
            try {
                await axios.post("dj/rest/auth/token/refresh/");
                
                // Redirect based on authentication status
                if (userAuthStatus === 'loggedIn') {
                    navigate('/tasks');
                }
            } catch (error) {
                if (userAuthStatus === 'loggedOut') {
                    navigate('/tasks')
                }
            }
        };

        handleMount();
    }, [navigate, userAuthStatus]);
};
