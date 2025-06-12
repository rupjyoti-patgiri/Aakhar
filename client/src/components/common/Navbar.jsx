import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ background: '#333', color: '#fff', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            <Link to="/" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none', fontSize: '1.2rem' }}>My Blog</Link>
            <Link to="/create-post" style={{ color: '#fff', textDecoration: 'none' }}>Create Post</Link>
        </nav>
    );
}
export default Navbar;