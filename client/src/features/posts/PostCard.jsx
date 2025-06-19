import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

// A placeholder component for loading state
export const PostCardSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[50%]" />
            </div>
        </div>
    );
};


const PostCard = ({ post }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
            className="h-full"
        >
            <Link to={`/post/${post._id}`} className="h-full block">
                <Card className="h-full flex flex-col transition-colors border-2 border-transparent hover:border-primary">
                    <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground line-clamp-3">{post.body}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <ThumbsUp size={16} /> {post.likes.length}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageCircle size={16} /> {post.comments.length}
                            </span>
                        </div>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
};

export default PostCard;


// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
// import { MessageCircle, ThumbsUp } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
// import { Skeleton } from '../../components/ui/skeleton';

// export const PostCardSkeleton = () => (
//     <div className="flex flex-col space-y-3">
//         <Skeleton className="h-[175px] w-full rounded-xl" />
//         <div className="space-y-2">
//             <Skeleton className="h-4 w-[90%]" />
//             <Skeleton className="h-4 w-[60%]" />
//         </div>
//     </div>
// );

// const PostCard = ({ post }) => {
//     // FIXED: Add a defensive check for the author.
//     const author = post.author;

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
//             className="h-full"
//         >
//             <Link to={`/post/${post._id}`} className="h-full block">
//                 <Card className="h-full flex flex-col transition-colors border-2 border-transparent hover:border-primary">
//                     <CardHeader>
//                         {/* FIXED: Only render this block if the author exists on the post object */}
//                         {author && (
//                             <div className="flex items-center gap-2 mb-2">
//                                 <Avatar className="h-8 w-8">
//                                     <AvatarImage src={author.avatar?.imageUrl} />
//                                     <AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
//                                 </Avatar>
//                                 <span className="text-sm font-medium">{author.username}</span>
//                             </div>
//                         )}
//                         <CardTitle className="line-clamp-2">{post.title}</CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex-grow">
//                         <p className="text-muted-foreground line-clamp-3">{post.body}</p>
//                     </CardContent>
//                     <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
//                         <div className="flex items-center gap-4">
//                             <span className="flex items-center gap-1.5"><ThumbsUp size={16} /> {post.likes.length}</span>
//                             <span className="flex items-center gap-1.5"><MessageCircle size={16} /> {post.comments.length}</span>
//                         </div>
//                         <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//                     </CardFooter>
//                 </Card>
//             </Link>
//         </motion.div>
//     );
// };

// export default PostCard;