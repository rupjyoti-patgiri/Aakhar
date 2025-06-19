import UsersTable from "./UsersTable";
import RequestsTable from "./RequestsTable";

const AdminDashboard = () => {
    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-bold mb-4">Pending Author Requests</h2>
                <RequestsTable />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
                <UsersTable />
            </div>
        </div>
    );
};

export default AdminDashboard;