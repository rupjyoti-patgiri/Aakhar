// import { Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { Button } from '../ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { BookOpen, LogOut, LayoutDashboard, User, PenSquare, PlusCircle } from 'lucide-react';

// const Navbar = () => {
//   const { token, user, logout, isAdmin, isAuthor, isReader } = useAuth();

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <nav className="container h-16 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-2">
//           <BookOpen className="h-6 w-6 text-primary" />
//           <span className="font-bold text-lg">BlogVerse</span>
//         </Link>

//         <div className="flex items-center gap-4">
//           {(isAuthor || isAdmin) && (
//             <Link to="/create-post">
//                 <Button>
//                     <PlusCircle className="mr-2 h-4 w-4" /> Create Post
//                 </Button>
//             </Link>
//           )}

//           {token ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="cursor-pointer h-10 w-10">
//                   <AvatarImage src={user?.avatar?.imageUrl} alt={user?.username} />
//                   <AvatarFallback>{user ? user.username.charAt(0).toUpperCase() : '...'}</AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 {user ? (
//                   <>
//                     <DropdownMenuLabel>
//                         <p>Signed in as</p>
//                         <p className="font-medium">{user.username}</p>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                      {isAdmin && (
//                         <Link to="/admin">
//                             <DropdownMenuItem><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</DropdownMenuItem>
//                         </Link>
//                      )}
//                     <Link to="/profile">
//                       <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
//                     </Link>
//                     {isReader && (
//                         <Link to="/request-author-role">
//                           <DropdownMenuItem><PenSquare className="mr-2 h-4 w-4" />Become an Author</DropdownMenuItem>
//                         </Link>
//                     )}
//                   </>
//                 ) : (
//                   <DropdownMenuLabel>Loading...</DropdownMenuLabel>
//                 )}
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Logout
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Link to="/login"><Button variant="ghost">Login</Button></Link>
//               <Link to="/signup"><Button>Sign Up</Button></Link>
//             </div>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;


import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookOpen, LogOut, LayoutDashboard, User, PenSquare, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { token, user, logout, isAdmin, isAuthor, isReader } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AAKHAR</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          {/* If a user is logged in (token exists) */}
          {token ? (
            <>
              {/* --- Role-Specific Action Buttons --- */}
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm"><LayoutDashboard className="mr-2 h-4 w-4" />Admin</Button>
                </Link>
              )}
              {(isAuthor || isAdmin) && (
                <Link to="/create-post">
                  <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" />Create Post</Button>
                </Link>
              )}
              {isReader && (
                 <Link to="/request-author-role">
                  <Button variant="outline" size="sm"><PenSquare className="mr-2 h-4 w-4" />Become an Author</Button>
                </Link>
              )}

              {/* --- User Profile Link --- */}
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar?.imageUrl} alt={user?.username} />
                  <AvatarFallback>{user ? user.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium text-sm">{user?.username}</span>
              </Link>
              
              {/* --- Logout Button --- */}
              <Button onClick={logout} variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 hover:text-red-600">
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            // --- Public View (Not Logged In) ---
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/signup"><Button>Sign Up</Button></Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;