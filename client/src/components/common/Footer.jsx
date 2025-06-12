import React from 'react';

function Footer() {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', borderTop: '1px solid #eee', background: '#f8f9fa' }}>
            <p>&copy; {new Date().getFullYear()} My Awesome Blog App. All rights reserved.</p>
        </footer>
    );
}
export default Footer;