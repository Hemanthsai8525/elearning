import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI } from '../services/api';
import { getCourseImage } from '../lib/courseImages';
import { Search, Star, Clock, BookOpen, ChevronRight, Users, TrendingUp, Filter, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    useEffect(() => {
        fetchCourses();
    }, []);
    useEffect(() => {
        filterCourses();
    }, [searchTerm, filter, courses]);
    const fetchCourses = async () => {
        try {
            const response = await courseAPI.getAllCourses();
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };
    const filterCourses = () => {
        let filtered = courses;
        if (searchTerm) {
            filtered = filtered.filter(
                (course) =>
                    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filter === 'free') {
            filtered = filtered.filter((course) => !course.paid);
        } else if (filter === 'paid') {
            filtered = filtered.filter((course) => course.paid);
        }
        setFilteredCourses(filtered);
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
            <div className="container">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Explore Courses
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover world-class learning from industry experts
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="input pl-10 h-12"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={filter === 'all' ? 'default' : 'outline'}
                                        onClick={() => setFilter('all')}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={filter === 'free' ? 'default' : 'outline'}
                                        onClick={() => setFilter('free')}
                                    >
                                        Free
                                    </Button>
                                    <Button
                                        variant={filter === 'paid' ? 'default' : 'outline'}
                                        onClick={() => setFilter('paid')}
                                    >
                                        Premium
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-muted-foreground">
                        {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Sorted by popularity</span>
                    </div>
                </div>
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <Skeleton className="h-48 w-full rounded-none" />
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-3" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3 mb-4" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                                <Search className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your search or filters
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilter('all');
                                }}
                            >
                                Reset Filters
                            </Button>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                            >
                                <Link to={`/courses/${course.id}`}>
                                    <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 relative">
                                        <div className="relative h-48 overflow-hidden bg-muted">
                                            <img
                                                src={getCourseImage(course.title)}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {course.paid && (
                                                <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 z-10 shadow-lg">
                                                    Premium
                                                </Badge>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                            {index < 3 && (
                                                <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse z-10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    <span className="text-sm font-bold">4.8</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {course.description}
                                            </p>
                                            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {course.teacherName?.charAt(0) || 'T'}
                                                </div>
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    {course.teacherName || 'Expert Instructor'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                    <span>{course.lessonCount || 0} lessons</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{Math.max(1, Math.ceil((course.lessonCount || 0) * 0.5))}h</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3.5 w-3.5" />
                                                    <span>{course.studentCount || 0}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-2xl font-extrabold">
                                                    {course.paid ? (
                                                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                            ₹{course.price}
                                                        </span>
                                                    ) : (
                                                        <span className="text-green-600 dark:text-green-400">Free</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                                    View Details
                                                    <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Courses;
