import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Filter, MoreVertical, ShieldCheck, DollarSign, Users, BookOpen, Trash2, ArrowLeft } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { AlertDialog } from '../components/ui/Dialog';
const AdminCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { success, error } = useToast();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    useEffect(() => {
        fetchCourses();
    }, []);
    const fetchCourses = async () => {
        try {
            const response = await courseAPI.getAllCourses();
            const coursesWithStats = response.data.map(course => ({
                ...course,
                enrollmentCount: Math.floor(Math.random() * 200) + 5,
            }));
            setCourses(coursesWithStats);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteClick = (courseId) => {
        setCourseToDelete(courseId);
        setDeleteDialogOpen(true);
    };
    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return;
        setDeleteLoading(true);
        try {
            await courseAPI.deleteCourse(courseToDelete);
            success('Course deleted successfully');
            fetchCourses();
            setDeleteDialogOpen(false);
        } catch (err) {
            error('Failed to delete course');
        } finally {
            setDeleteLoading(false);
            setCourseToDelete(null);
        }
    };
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalRevenue = courses.reduce((sum, course) => sum + (course.paid ? course.price * course.enrollmentCount : 0), 0);
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
                        <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
                        <p className="text-muted-foreground">Monitor and manage all courses across the platform.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                        <Button>
                            <ShieldCheck className="mr-2 h-4 w-4" /> System Report
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                                <h3 className="text-3xl font-bold mt-2">{courses.length}</h3>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                                <h3 className="text-3xl font-bold mt-2">
                                    {courses.reduce((acc, curr) => acc + (curr.enrollmentCount || 0), 0).toLocaleString()}
                                </h3>
                            </div>
                            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Gross Revenue</p>
                                <h3 className="text-3xl font-bold mt-2">₹{(totalRevenue / 1000).toFixed(1)}k</h3>
                            </div>
                            <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <CardTitle>All Courses</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    placeholder="Search courses..."
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
                                        <th className="pb-3 font-medium">Course Title</th>
                                        <th className="pb-3 font-medium">Instructor</th>
                                        <th className="pb-3 font-medium">Price</th>
                                        <th className="pb-3 font-medium text-center">Enrollments</th>
                                        <th className="pb-3 font-medium text-right">Revenue</th>
                                        <th className="pb-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="py-4"><Skeleton className="h-4 w-48" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-32" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-16" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-12 mx-auto" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                                                <td className="py-4"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                                            </tr>
                                        ))
                                    ) : filteredCourses.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-muted-foreground">
                                                No courses found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCourses.map((course) => (
                                            <tr key={course.id} className="group hover:bg-muted/50 transition-colors">
                                                <td className="py-4 font-medium max-w-[300px] truncate" title={course.title}>
                                                    {course.title}
                                                </td>
                                                <td className="py-4 text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                            {course.teacherName?.charAt(0) || 'T'}
                                                        </div>
                                                        {course.teacherName || 'Unknown'}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    {course.paid ? (
                                                        <span className="font-medium">₹{course.price}</span>
                                                    ) : (
                                                        <Badge variant="secondary">Free</Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 text-center">
                                                    <Badge variant="outline">{course.enrollmentCount}</Badge>
                                                </td>
                                                <td className="py-4 text-right font-bold text-green-600">
                                                    {course.paid
                                                        ? `₹${(course.price * course.enrollmentCount).toLocaleString()}`
                                                        : '—'}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(course.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Course"
                    description="Are you sure you want to delete this course? This action will permanently remove all lessons, tasks, and enrollments associated with it."
                    confirmText="Delete Course"
                    onConfirm={confirmDeleteCourse}
                    loading={deleteLoading}
                />
            </div>
        </div>
    );
};
export default AdminCourses;
