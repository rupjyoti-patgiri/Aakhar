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
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

const fetchRequests = async () => {
    const { data } = await apiClient.get('/requests');
    return data;
};

const processRequest = async ({ requestId, status }) => {
    const { data } = await apiClient.put(`/requests/${requestId}/process`, { status });
    return data;
};

const RequestsTable = () => {
    const queryClient = useQueryClient();
    const { data: requests, isLoading, isError } = useQuery({ queryKey: ['requests'], queryFn: fetchRequests });
    
    const mutation = useMutation({
        mutationFn: processRequest,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(['requests']);
            queryClient.invalidateQueries(['users']); // Invalidate users as a role might have changed
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Processing failed.');
        }
    });

    const handleProcess = (requestId, status) => {
        mutation.mutate({ requestId, status });
    };

    if (isLoading) {
         return <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    }

    if (isError) return <div>Error loading requests.</div>;
    
    if (requests.length === 0) return <p className="text-muted-foreground">No pending requests.</p>

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map(req => (
                        <TableRow key={req._id}>
                            <TableCell>
                                <div className="font-medium">{req.user.username}</div>
                                <div className="text-sm text-muted-foreground">{req.user.email}</div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                            <TableCell className="max-w-xs truncate">{req.experience}</TableCell>
                            <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleProcess(req._id, 'approved')} disabled={mutation.isLoading}>Approve</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleProcess(req._id, 'denied')} disabled={mutation.isLoading}>Deny</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RequestsTable;