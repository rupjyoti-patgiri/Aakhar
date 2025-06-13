import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/api';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from '../../components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

const fetchUsers = async () => {
    const { data } = await apiClient.get('/api/v1/users');
    return data;
};

const updateUserRole = async ({ userId, role }) => {
    const { data } = await apiClient.put(`/api/v1/users/${userId}/role`, { role });
    return data;
};

const UsersTable = () => {
    const queryClient = useQueryClient();
    const { data: users, isLoading, isError } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

    const mutation = useMutation({
        mutationFn: updateUserRole,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['users']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Update failed.');
        }
    });

    const handleRoleChange = (userId, role) => {
        mutation.mutate({ userId, role });
    };

    if (isLoading) {
        return <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    }

    if (isError) return <div>Error loading users.</div>;

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'reader')}>
                                            Make Reader
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'author')}>
                                            Make Author
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleChange(user._id, 'admin')}>
                                            Make Admin
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UsersTable;