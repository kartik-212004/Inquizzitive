import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import "../index.css";

const NotFound = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div className="w-screen min-h-screen bg-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-slate-700/40 to-slate-900 opacity-70 fixed"></div>
            
            <div className="relative z-10 max-w-md w-full">
                <div className="bg-slate-700/90 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 bg-amber-500/20"></div>
                    
                    <div className="text-center p-8">
                        <FaExclamationTriangle className="text-amber-400 text-6xl mx-auto mb-6" />
                        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
                        <h2 className="text-2xl font-medium text-white mb-6">Page Not Found</h2>
                        
                        <p className="text-gray-300 mb-8">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                        
                        <div className="mb-8 text-center">
                            <span className="text-sm text-gray-400">
                                Redirecting to home in 
                            </span>
                            <span className="text-xl mx-1 text-amber-400 font-bold">
                                {countdown}
                            </span>
                            <span className="text-sm text-gray-400">
                                seconds
                            </span>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg transition duration-300"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <div className="text-xl text-center font-bold">
                        <span className="bg-gradient-to-r from-amber-400 to-amber-300 text-transparent bg-clip-text">
                            Inquiz
                        </span>
                        <span className="bg-gradient-to-r from-amber-300 to-white text-transparent bg-clip-text">
                            zitive
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;