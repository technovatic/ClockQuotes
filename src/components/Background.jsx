// eslint-disable-next-line no-unused-vars
import React from 'react';

// eslint-disable-next-line react/prop-types
const Background = ({ children }) => {
    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
            }}
        >
            {children}
        </div>
    );
};

export default Background;
