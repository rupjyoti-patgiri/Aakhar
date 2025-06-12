import React from 'react';

function ErrorMessage({ message }) {
    return (
        <div style={{
            color: '#721c24',
            backgroundColor: '#f8d7da',
            borderColor: '#f5c6cb',
            padding: '0.75rem 1.25rem',
            marginBottom: '1rem',
            border: '1px solid transparent',
            borderRadius: '0.25rem',
            textAlign: 'center'
        }}>
            <strong>Error:</strong> {message || "An unknown error occurred."}
        </div>
    );
}
export default ErrorMessage;