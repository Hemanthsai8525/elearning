import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { adminAPI } from '../services/api';
import { Search, MoreVertical, Ban, Trash, ArrowLeft, CheckCircle } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../components/ui/dropdown-menu';

const AdminBlockedUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { success, error } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getAllUsers();
            // Filter only blocked users
            setUsers(response.data.filter(user => user.enabled === false));
        } catch (err) {
            error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (user) => {
        if (!window.confirm(`Are you sure you want to unblock this user?`)) return;
        try {
            await adminAPI.toggleBlock(user.id);
            success(`User unblocked successfully`);
            fetchUsers();
        } catch (err) {
            error('Failed to update user status');
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await adminAPI.deleteUser(user.id);
            success('User deleted successfully');
            fetchUsers();
        } catch (err) {
            error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-muted/5 py-8">
            <div className="container max-w-7xl">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                            <Ban className="h-8 w-8" />
                            Blocked Users
                        </h1>
                        <p className="text-muted-foreground">Manage users who have been restricted from the platform.</p>
                    </div>
                </div>

                <Card className="border-red-200">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <CardTitle>Blocked Accounts List</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    placeholder="Search blocked users..."
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b">
                                    <tr className="text-left text-muted-foreground">
                                        <th className="pb-3 font-medium w-16">ID</th>
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Role</th>
                                        <th className="pb-3 font-medium">Joined</th>
                                        <th className="pb-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        [...Array(3)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="py-4"><Skeleton className="h-10 w-24" /></td>
                                                <td className="py-4"><Skeleton className="h-6 w-32" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                                                <td className="py-4"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                                            </tr>
                                        ))
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-muted-foreground">
                                                No blocked users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-muted/50 transition-colors bg-red-50/50">
                                                <td className="py-4 font-mono text-xs text-muted-foreground">#{user.id}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gray-600"
                                                        )}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-red-900">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <Badge variant="outline" className="opacity-70">
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 text-muted-foreground">
                                                    {new Date(user.joinedDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleBlockToggle(user)} className="text-green-600">
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Unblock User
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(user)} className="text-red-600">
                                                                <Trash className="mr-2 h-4 w-4" /> Delete User
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminBlockedUsers;
