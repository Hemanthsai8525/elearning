import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI, lessonAPI, enrollmentAPI, taskAPI } from '../services/api';
import {
    BookOpen, Plus, Video, LayoutDashboard, LogOut, Users,
    DollarSign, TrendingUp, Award, Clock, ChevronRight,
    ChevronDown, AlertCircle, CheckCircle, X, Home, MoreVertical,
    Code, Trash2, Play, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { getCourseImage } from '../lib/courseImages';
import { AlertDialog } from '../components/ui/Dialog';
const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollees, setEnrollees] = useState([]);
    const [loadingEnrollees, setLoadingEnrollees] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [importPreview, setImportPreview] = useState(null);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        paid: false,
        price: 0,
    });
    const [courseDetails, setCourseDetails] = useState({
        lessons: [],
        tasks: [],
        students: []
    });
    const [detailsTab, setDetailsTab] = useState('lessons');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const toggleCourseDetails = async (courseId, tab = 'lessons') => {
        if (selectedCourse === courseId && detailsTab === tab && tab !== 'refresh') {
            if (tab === detailsTab) {
                setSelectedCourse(null);
                return;
            }
        }
        if (tab === 'refresh') tab = detailsTab;
        setSelectedCourse(courseId);
        setDetailsTab(tab);
        setLoadingDetails(true);
        try {
            const [lessonsRes, tasksRes, studentsRes] = await Promise.all([
                courseAPI.getCourseLessons(courseId),
                taskAPI.getTasks(courseId),
                enrollmentAPI.getCourseEnrollees(courseId)
            ]);
            setCourseDetails({
                lessons: lessonsRes.data,
                tasks: tasksRes.data,
                students: studentsRes.data
            });
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };
    useEffect(() => {
        fetchMyCourses();
    }, []);
    const fetchMyCourses = async () => {
        setLoading(true);
        try {
            const response = await courseAPI.getAllCourses();
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchEnrollees = async (courseId) => {
        if (selectedCourse === courseId) {
            setSelectedCourse(null);
            setEnrollees([]);
            return;
        }
        setLoadingEnrollees(true);
        setSelectedCourse(courseId);
        try {
            const response = await enrollmentAPI.getCourseEnrollees(courseId);
            setEnrollees(response.data);
        } catch (error) {
            console.error('Error fetching enrollees:', error);
        } finally {
            setLoadingEnrollees(false);
        }
    };
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await courseAPI.createCourse(courseData);
            const newCourseId = response.data.id;
            setMessage({ type: 'success', text: '🎉 Course created! Redirecting to content manager...' });

            setTimeout(() => {
                navigate(`/teach/course/${newCourseId}`);
            }, 1000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create course' });
        } finally {
            setLoading(false);
        }
    };
    const openAddTask = (courseId) => {
        navigate(`/teach/course/${courseId}`);
    };
    const openAddLesson = (courseId) => {
        navigate(`/teach/course/${courseId}`);
    };
    const handleLogout = () => {
        if (logout) logout();
        navigate('/');
    };
    const handleDeleteClick = (courseId) => {
        setCourseToDelete(courseId);
        setDeleteDialogOpen(true);
    };
    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return;
        setLoading(true);
        try {
            await courseAPI.deleteCourse(courseToDelete);
            setMessage({ type: 'success', text: '🗑️ Course deleted successfully.' });
            fetchMyCourses();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Delete failed:', error);
            setMessage({ type: 'error', text: 'Failed to delete course' });
        } finally {
            setLoading(false);
            setCourseToDelete(null);
        }
    };
    const totalStudents = courses.reduce((acc, course) => acc + (course.studentCount || 0), 0);
    const SidebarItem = ({ id, icon: Icon, label, onClick, isActive }) => (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon size={18} />
            {label}
        </button>
    );
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LayoutDashboard size={18} className="text-primary" />
                    </div>
                    Instructor
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </div>
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 border-r bg-card z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <LayoutDashboard size={20} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Instructor</h2>
                            <p className="text-xs text-muted-foreground">{user?.name || 'Teacher'}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                    <SidebarItem
                        id="overview"
                        icon={TrendingUp}
                        label="Overview"
                        isActive={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        id="courses"
                        icon={BookOpen}
                        label="My Courses"
                        isActive={activeTab === 'courses' || activeTab === 'create'}
                        onClick={() => setActiveTab('courses')}
                    />
                    <SidebarItem
                        id="analytics"
                        icon={Award}
                        label="Analytics"
                        isActive={activeTab === 'analytics'}
                        onClick={() => setActiveTab('analytics')}
                    />
                </nav>
                <div className="p-4 border-t space-y-2">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Home size={18} />
                        Student View
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className="flex-1 lg:ml-64 min-h-screen bg-muted/5 pt-16 lg:pt-0">
                <div className="container py-8 max-w-6xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                                {activeTab === 'overview' ? 'Dashboard Overview' :
                                    activeTab === 'courses' ? 'Course Management' :
                                        activeTab === 'create' ? 'Create New Course' :
                                            activeTab === 'add-lesson' ? 'Add Content' :
                                                activeTab === 'add-task' ? 'Add Assignment' : 'Analytics'}
                            </h1>
                            <p className="text-muted-foreground">
                                {activeTab === 'overview' ? 'Track your teaching performance and student engagement' :
                                    activeTab === 'courses' ? 'Manage your courses and student enrollments' :
                                        activeTab === 'courses' ? 'Manage your courses and student enrollments' :
                                            activeTab === 'create' ? 'Share your knowledge by creating a new course' : 'View detailed analytics'}
                            </p>
                        </div>
                        {activeTab === 'courses' && (
                            <div className="flex gap-2">
                                <Button onClick={() => setActiveTab('import')} variant="outline" className="gap-2">
                                    <Code size={18} />
                                    Import from File
                                </Button>
                                <Button onClick={() => setActiveTab('create')} className="gap-2">
                                    <Plus size={18} />
                                    Create Course
                                </Button>
                            </div>
                        )}
                    </header>
                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                className={cn(
                                    "fixed top-6 right-6 z-[100] flex items-center gap-4 p-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[320px]",
                                    message.type === 'success'
                                        ? "bg-white/90 border-green-200 text-green-800 dark:bg-zinc-900/90 dark:border-green-900"
                                        : "bg-white/90 border-red-200 text-red-800 dark:bg-zinc-900/90 dark:border-red-900"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                                    message.type === 'success' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{message.type === 'success' ? 'Success' : 'Error'}</h4>
                                    <p className="text-sm opacity-90">{message.text}</p>
                                </div>
                                <button onClick={() => setMessage({ type: '', text: '' })} className="text-muted-foreground hover:text-foreground">
                                    <X size={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                    { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                ].map((stat, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                                                </div>
                                                <Badge variant="outline" className="font-mono text-xs">+12%</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                            <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Recent Performance</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('courses')}>
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b">
                                                <tr className="text-left text-muted-foreground">
                                                    <th className="pb-3 font-medium">Course Name</th>
                                                    <th className="pb-3 font-medium">Students</th>
                                                    <th className="pb-3 font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {courses.slice(0, 5).map(course => (
                                                    <tr key={course.id} className="group hover:bg-muted/50 transition-colors">
                                                        <td className="py-4 font-medium">{course.title}</td>
                                                        <td className="py-4 text-muted-foreground">{course.studentCount || 0} enrolled</td>
                                                        <td className="py-4">
                                                            <Badge variant={course.published ? "success" : "warning"} className={cn("bg-opacity-10", course.published ? "text-green-600 bg-green-500 border-green-500/20" : "text-yellow-600 bg-yellow-500 border-yellow-500/20")}>
                                                                {course.published ? 'Published' : 'Draft'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {courses.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground">
                                                No courses yet.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            {courses.length === 0 ? (
                                <Card className="py-12 border-dashed">
                                    <CardContent className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                                        <p className="text-muted-foreground max-w-sm mb-6">
                                            Start your teaching journey by creating your first course and sharing your expertise.
                                        </p>
                                        <Button onClick={() => setActiveTab('create')}>
                                            <Plus size={18} className="mr-2" />
                                            Create Course
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                courses.map(course => (
                                    <Card key={course.id} className="overflow-hidden hover:border-primary/50 transition-colors group">
                                        <div className="p-6 flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-32 h-32 rounded-lg bg-muted relative shrink-0 overflow-hidden group-hover:shadow-md transition-all">
                                                <img
                                                    src={getCourseImage(course.title)}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3
                                                                className="text-xl font-bold truncate cursor-pointer hover:text-primary transition-colors"
                                                                onClick={() => navigate(`/teach/course/${course.id}`)}
                                                            >
                                                                {course.title}
                                                            </h3>
                                                            <Badge variant={course.paid ? "default" : "secondary"}>
                                                                {course.paid ? 'PAID' : 'FREE'}
                                                            </Badge>
                                                            <Badge variant={course.published ? "success" : "warning"} className={cn("bg-opacity-10", course.published ? "text-green-600 bg-green-500 border-green-500/20" : "text-yellow-600 bg-yellow-500 border-yellow-500/20")}>
                                                                {course.published ? 'Published' : 'Draft'}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                            {course.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign size={16} />
                                                        <span className="font-medium text-foreground">
                                                            {course.paid ? `₹${course.price}` : 'Free'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users size={16} />
                                                        <span>{course.studentCount || 0} Students</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Video size={16} />
                                                        <span>{course.lessonCount || 0} Lessons</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 shrink-0 md:border-l pl-0 md:pl-6 md:justify-center md:w-48">
                                                <Button variant="outline" size="sm" onClick={() => openAddLesson(course.id)} className="w-full justify-start">
                                                    <Video size={16} className="mr-2" /> Add Lesson
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => openAddTask(course.id)} className="w-full justify-start">
                                                    <Code size={16} className="mr-2" /> Add Task
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => navigate(`/teach/course/${course.id}`)}
                                                    className="w-full justify-start"
                                                >
                                                    <BookOpen size={16} className="mr-2" /> Manage Content
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(course.id)}
                                                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} className="mr-2" /> Delete Course
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === 'create' && (
                        <Card className="max-w-3xl mx-auto">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle>Create New Course</CardTitle>
                                        <CardDescription>Fill in the details to start your course.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateCourse} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Course Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={courseData.title}
                                            onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                                            placeholder="e.g. Advanced System Design"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            required
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                            value={courseData.description}
                                            onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            className={cn(
                                                "border rounded-lg p-4 cursor-pointer transition-all",
                                                !courseData.paid ? "border-green-500 bg-green-50/50 dark:bg-green-900/10" : "hover:border-primary"
                                            )}
                                            onClick={() => setCourseData({ ...courseData, paid: false })}
                                        >
                                            <span className="font-bold block mb-1">Free Course</span>
                                            <span className="text-xs text-muted-foreground">Accessible to everyone</span>
                                        </div>
                                        <div
                                            className={cn(
                                                "border rounded-lg p-4 cursor-pointer transition-all",
                                                courseData.paid ? "border-primary bg-primary/5" : "hover:border-primary"
                                            )}
                                            onClick={() => setCourseData({ ...courseData, paid: true })}
                                        >
                                            <span className="font-bold block mb-1">Paid Course</span>
                                            <span className="text-xs text-muted-foreground">Monetize your content</span>
                                        </div>
                                    </div>
                                    {courseData.paid && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bold"
                                                value={courseData.price}
                                                onChange={e => setCourseData({ ...courseData, price: e.target.value })}
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setActiveTab('courses')}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? 'Creating...' : 'Create & Manage Content'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'import' && (
                        <Card className="max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle>Import Course from File</CardTitle>
                                <CardDescription>
                                    Upload a text file containing the course structure.
                                </CardDescription>
                                <div className="mt-2 text-xs bg-muted p-2 rounded font-mono">
                                    [COURSE]<br />
                                    Title: My Course<br />
                                    Description: Learn Java...<br />
                                    Paid: false<br />
                                    [LESSON]<br />
                                    Title: Intro<br />
                                    VideoUrl: https://...<br />
                                    [TASK]<br />
                                    Title: First Task...
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!importPreview ? (
                                    <input
                                        type="file"
                                        accept=".txt"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setImportFile(file);

                                            // Read and parse file for preview
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const content = event.target.result;
                                                const lines = content.split('\n');
                                                let preview = { title: '', description: '', lessons: 0, tasks: 0 };

                                                lines.forEach(line => {
                                                    const trimmed = line.trim();
                                                    if (trimmed.startsWith('Title:') && !preview.title) {
                                                        preview.title = trimmed.substring(6).trim();
                                                    } else if (trimmed.startsWith('Description:')) {
                                                        preview.description = trimmed.substring(12).trim();
                                                    } else if (trimmed === '[LESSON]') {
                                                        preview.lessons++;
                                                    } else if (trimmed === '[TASK]') {
                                                        preview.tasks++;
                                                    }
                                                });

                                                setImportPreview(preview);
                                            };
                                            reader.readAsText(file);
                                        }}
                                        className="block w-full text-sm text-slate-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-violet-50 file:text-violet-700
                                          hover:file:bg-violet-100"
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                            <h3 className="font-semibold text-lg">Course Preview</h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Title:</span>
                                                    <p className="font-medium">{importPreview.title || 'Untitled Course'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Description:</span>
                                                    <p className="text-sm">{importPreview.description || 'No description'}</p>
                                                </div>
                                                <div className="flex gap-4 pt-2">
                                                    <Badge variant="outline" className="gap-1">
                                                        <Video size={14} />
                                                        {importPreview.lessons} Lessons
                                                    </Badge>
                                                    <Badge variant="outline" className="gap-1">
                                                        <Code size={14} />
                                                        {importPreview.tasks} Tasks
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setImportFile(null);
                                                    setImportPreview(null);
                                                }}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const formData = new FormData();
                                                    formData.append('file', importFile);
                                                    try {
                                                        const res = await courseAPI.importCourse(formData);
                                                        setMessage({ type: 'success', text: 'Course imported successfully!' });
                                                        setImportFile(null);
                                                        setImportPreview(null);
                                                        setTimeout(() => navigate(`/teach/course/${res.data.id}`), 1000);
                                                    } catch (err) {
                                                        setMessage({ type: 'error', text: 'Import failed: ' + (err.response?.data?.message || err.message) });
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                                disabled={loading}
                                                className="flex-1"
                                            >
                                                {loading ? 'Creating...' : 'Create Course'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'analytics' && (
                        <div className="text-center py-20">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                                <Award className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Analytics Coming Soon</h2>
                            <p className="text-muted-foreground">Detailed insights and performance metrics are being built.</p>
                        </div>
                    )}
                </div>
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Course"
                    description="Are you sure you want to delete this course? This action will permanently remove all lessons, tasks, and enrollments associated with it."
                    confirmText="Delete Course"
                    onConfirm={confirmDeleteCourse}
                    loading={loading}
                />
            </main >
        </div >
    );
};
export default TeacherDashboard;
