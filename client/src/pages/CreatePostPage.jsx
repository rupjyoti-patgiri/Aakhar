import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../App';

function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function createNewPost(ev) {
        ev.preventDefault();
        setError('');
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }

        try {
             const response = await fetch(`${API_BASE_URL}/api/v1/posts/createPost`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
            if (response.ok) {
                 navigate('/');
            } else {
                 const errData = await response.json();
                 setError(errData.message || 'Failed to create post.');
            }
        } catch(e) {
            setError('An error occurred. Please try again.');
        }
    }
    
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
    };

    return (
        <form onSubmit={createNewPost} className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Create New Post</h1>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}
            <div className="space-y-6">
                <input type="text" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <input type="text" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="relative border border-gray-700 rounded-lg flex items-center justify-center p-4 bg-gray-900/50">
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <ImageIcon className="text-gray-400" size={32} />
                        <span className="mt-2 text-sm text-gray-400">{files?.[0]?.name || 'Upload a cover image'}</span>
                        <input type="file" className="hidden" onChange={ev => setFiles(ev.target.files)} />
                    </label>
                </div>
                <div className="text-white ql-custom">
                    <ReactQuill 
                        value={content} 
                        onChange={newValue => setContent(newValue)}
                        modules={modules}
                        theme="snow" />
                </div>
            </div>
            <button type="submit" className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300">Create Post</button>
        </form>
    );
}

export default CreatePostPage;
