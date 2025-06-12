import React from 'react';
import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { API_BASE_URL } from '../App';

function Post({ _id, title, body, createdAt, coverPhoto}) {
    return (
        <article className="group bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/20 transform hover:-translate-y-1">
            <div className="overflow-hidden rounded-lg mb-4">
                <Link to={`/post/${_id}`}>
                   <img src={coverPhoto} alt={`Cover for ${title}`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
            </div>
            <div className="flex flex-col">
                <Link to={`/post/${_id}`}>
                    <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">{title}</h2>
                </Link>
                <div className="flex items-center text-sm text-gray-400 gap-4 my-2">
                    <span className="font-semibold text-gray-300">{ 'Unknown Author'}</span>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </div>
                <p className="text-gray-300 leading-relaxed line-clamp-2">{body}</p>
                 <Link to={`/post/${_id}`} className="inline-flex items-center gap-2 text-indigo-400 font-semibold mt-4 self-start group-hover:text-indigo-300">
                    Read more <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"/>
                </Link>
            </div>
        </article>
    );
}

export default Post;
