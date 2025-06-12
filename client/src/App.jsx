import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx'; // Corrected import
import Footer from './components/common/Footer.jsx'; // Corrected import
import HomePage from './pages/HomePage.jsx';       // Corrected import
import PostPage from './pages/PostPage.jsx';       // Corrected import
import CreatePostPage from './pages/CreatePostPage.jsx'; // Corrected import
import EditPostPage from './pages/EditPostPage.jsx';   // Corrected import
import NotFoundPage from './pages/NotFoundPage.jsx'; // Corrected import
import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/edit-post/:id" element={<EditPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;