import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { adminAPI } from '../services/api';
import { Search, Filter, MoreVertical, ShieldCheck, DollarSign, Users as UsersIcon, GraduationCap, X, CheckCircle, AlertCircle, Plus, ArrowLeft } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/Dialog';
const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const { success, error } = useToast();
    useEffect(() => {
        setTimeout(() => {
            const mockUsers = generateMockUsers();
            setUsers(mockUsers);
            setLoading(false);
        }, 1000);
    }, []);
    const generateMockUsers = () => {
        const roles = ['STUDENT', 'TEACHER', 'ADMIN'];
        return Array.from({ length: 25 }, (_, i) => {
            const role = i === 0 ? 'ADMIN' : i < 8 ? 'TEACHER' : 'STUDENT';
            const revenue = role === 'TEACHER' ? Math.floor(Math.random() * 50000) + 5000 : 0;
            return {
                id: i + 1,
                name: role === 'ADMIN' ? 'Admin User' : role === 'TEACHER' ? `Instructor ${i}` : `Student ${i}`,
                email: `user${i + 1}@example.com`,
                role: role,
                joinedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
                revenue: revenue,
                courseCount: role === 'TEACHER' ? Math.floor(Math.random() * 5) + 1 : 0
            };
        });
    };
    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const res = await adminAPI.createTeacher(newTeacher);
            success(`Teacher ${res.data.name} created successfully!`);
            const createdUser = {
                id: users.length + 1,
                name: res.data.name,
                email: res.data.email,
                role: 'TEACHER',
                joinedDate: new Date().toLocaleDateString(),
                revenue: 0,
                courseCount: 0
            };
            setUsers([createdUser, ...users]);
            setNewTeacher({ name: '', email: '', password: '' });
            setIsAddModalOpen(false);
        } catch (err) {
            error(err.response?.data?.message || 'Failed to create teacher');
        } finally {
            setSubmitLoading(false);
        }
    };
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });
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
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Manage students, teachers, and administrators.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Teacher
                        </Button>
                    </div>
                </div>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['ALL', 'STUDENT', 'TEACHER', 'ADMIN'].map((role) => (
                        <Button
                            key={role}
                            variant={roleFilter === role ? "default" : "outline"}
                            size="sm"
                            onClick={() => setRoleFilter(role)}
                            className="whitespace-nowrap"
                        >
                            {role === 'ALL' ? 'All Users' : role.charAt(0) + role.slice(1).toLowerCase() + 's'}
                        </Button>
                    ))}
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <CardTitle>Users List</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    placeholder="Search users..."
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
                                        <th className="pb-3 font-medium text-center">Courses</th>
                                        <th className="pb-3 font-medium text-right">Total Revenue</th>
                                        <th className="pb-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="py-4"><Skeleton className="h-10 w-48" /></td>
                                                <td className="py-4"><Skeleton className="h-6 w-20" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-12 mx-auto" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                                                <td className="py-4"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                                            </tr>
                                        ))
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-muted-foreground">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-muted/50 transition-colors">
                                                <td className="py-4 font-mono text-xs text-muted-foreground">#{user.id}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white",
                                                            user.role === 'ADMIN' ? "bg-gray-800" :
                                                                user.role === 'TEACHER' ? "bg-purple-600" : "bg-blue-500"
                                                        )}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <Badge variant={
                                                        user.role === 'ADMIN' ? "default" :
                                                            user.role === 'TEACHER' ? "warning" : "secondary"
                                                    }>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 text-muted-foreground">
                                                    {user.joinedDate}
                                                </td>
                                                <td className="py-4 text-center">
                                                    {user.role === 'TEACHER' ? (
                                                        <Badge variant="outline">{user.courseCount}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right font-mono">
                                                    {user.role === 'TEACHER' ? (
                                                        <span className="font-bold text-green-600">₹{user.revenue.toLocaleString()}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
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
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Teacher</DialogTitle>
                        <DialogDescription>
                            Create a new instructor account manually.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeacher} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="e.g. Sarah Smith"
                                value={newTeacher.name}
                                onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="sarah@example.com"
                                value={newTeacher.email}
                                onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="••••••••"
                                value={newTeacher.password}
                                onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitLoading}>
                                {submitLoading ? 'Creating...' : 'Create Teacher Account'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default AdminUsers;
