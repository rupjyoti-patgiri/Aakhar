import React from 'react';

function LoadingSpinner() {
    // Basic spinner style, you can replace with a more advanced one or an SVG
    const spinnerStyle = {
        border: '4px solid rgba(0, 0, 0, 0.1)',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        borderLeftColor: '#09f',
        animation: 'spin 1s ease infinite',
        margin: '20px auto',
    };
    const keyframes = `
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
             <style>{keyframes}</style>
            <div style={spinnerStyle}></div>
            <p>Loading...</p>
        </div>
    );
}
export default LoadingSpinner;