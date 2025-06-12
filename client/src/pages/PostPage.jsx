import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';
import { UserContext } from '../context/UserContext';
import Spinner from '../components/Spinner';
import { Edit, ChevronLeft, Send } from 'lucide-react';
import { API_BASE_URL } from '../App';

function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { userInfo } = useContext(UserContext);
    const { id: postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await fetch(`${API_BASE_URL}/posts/getPost/${postId}`);
                if (postResponse.ok) {
                    const postData = await postResponse.json();
                    setPostInfo(postData);
                }
                const commentsResponse = await fetch(`${API_BASE_URL}/comments/getCommentByPost/${postId}`);
                 if (commentsResponse.ok) {
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                }
            } catch (error) {
                console.error("Failed to fetch post details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    async function handleAddComment(ev) {
        ev.preventDefault();
        const response = await fetch(`${API_BASE_URL}/comments/createComment`, {
            method: 'POST',
            body: JSON.stringify({ comment: newComment, postId }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            const savedComment = await response.json();
            setComments(prev => [...prev, savedComment]);
            setNewComment('');
        }
    }
    
    if (loading) return <Spinner />;
    if (!postInfo) return <div className="text-center text-gray-400 text-2xl py-20">Post not found.</div>;

    const isAuthor = userInfo?._id === postInfo.author?._id;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="relative mb-8">
              <Link to="/" className="absolute -top-12 left-0 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                <ChevronLeft size={20} /> Back to all posts
              </Link>
            </div>
            <div className="bg-gray-800/50 p-6 sm:p-10 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 text-center">{postInfo.title}</h1>
                <div className="text-center text-gray-400 mb-4">{formatISO9075(new Date(postInfo.createdAt))} by @{postInfo.author?.username}</div>
                
                {isAuthor && (
                    <div className="flex justify-center gap-4 mb-8">
                        <Link to={`/edit/${postInfo._id}`} className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                           <Edit size={16} /> Edit this post
                        </Link>
                    </div>
                )}
                
                <div className="w-full h-64 md:h-96 overflow-hidden rounded-2xl mb-8 shadow-2xl shadow-black/30">
                    <img src={`${API_BASE_URL}/${postInfo.cover}`} alt="" className="w-full h-full object-cover"/>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-gray-300 prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-blockquote:border-l-indigo-500" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
            </div>

            <div className="mt-12 bg-gray-800/50 p-6 sm:p-10 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>
                {userInfo ? (
                    <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
                        <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-grow bg-gray-900/50 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg transition-all duration-300">
                           <Send size={20} />
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-400 mb-8">
                        <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Log in</Link> to leave a comment.
                    </p>
                )}
                <div className="space-y-6">
                    {comments.length > 0 ? comments.map(comment => (
                        <div key={comment._id} className="flex gap-4 items-start">
                           <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center font-bold text-indigo-300">
                               {comment.author?.username?.charAt(0).toUpperCase()}
                           </div>
                           <div className="flex-1 bg-gray-900/40 p-4 rounded-lg">
                               <div className="flex justify-between items-center">
                                   <span className="font-bold text-white">{comment.author?.username}</span>
                                   <time className="text-xs text-gray-500">{formatISO9075(new Date(comment.createdAt))}</time>
                               </div>
                               <p className="text-gray-300 mt-2">{comment.comment}</p>
                           </div>
                        </div>
                    )) : <p className="text-gray-500">No comments yet. Be the first to say something!</p>}
                </div>
            </div>
        </div>
    );
}

export default PostPage;

