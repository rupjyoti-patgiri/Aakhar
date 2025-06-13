import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BookOpen, LogOut, LayoutDashboard, User, PenSquare } from 'lucide-react';


const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isAuthor } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Aakhar</span>
        </Link>

        <div className="flex items-center gap-4">
          {(isAuthor || isAdmin) && (
            <NavLink to="/create-post">
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"}>Create Post</Button>
              )}
            </NavLink>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar?.imageUrl} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <p>Signed in as</p>
                    <p className="font-medium">{user.username}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {isAdmin && (
                    <Link to="/admin">
                        <DropdownMenuItem><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</DropdownMenuItem>
                    </Link>
                 )}
                <Link to="/profile">
                  <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                </Link>
                {user.role === 'reader' && (
                    <Link to="/request-author-role">
                      <DropdownMenuItem><PenSquare className="mr-2 h-4 w-4" />Become an Author</DropdownMenuItem>
                    </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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