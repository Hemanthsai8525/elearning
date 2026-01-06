import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { enrollmentAPI } from '../services/api';
import { getCourseImage } from '../lib/courseImages';
import {
    BookOpen, Clock, Award, TrendingUp, ChevronRight, Play,
    Target, Zap, Trophy, Calendar, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
const MyLearning = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchEnrollments();
    }, []);
    const fetchEnrollments = async () => {
        try {
            const response = await enrollmentAPI.getMyEnrollments();
            setEnrollments(response.data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };
    const avgProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) / enrollments.length)
        : 0;
    const completedCourses = enrollments.filter(e => e.progressPercentage === 100).length;
    const stats = [
        {
            label: 'Enrolled Courses',
            value: enrollments.length,
            icon: BookOpen,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10'
        },
        {
            label: 'Average Progress',
            value: `${avgProgress}%`,
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10'
        },
        {
            label: 'Completed',
            value: completedCourses,
            icon: Trophy,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10'
        },
        {
            label: 'Learning Streak',
            value: `${user?.currentStreak || 0} day${(user?.currentStreak === 1 ? '' : 's')}`,
            icon: Zap,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10'
        }
    ];
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
                <div className="container">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-48" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
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
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                My Learning
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Keep pushing your boundaries and achieve your goals! 🚀
                            </p>
                        </div>
                        <Link to="/courses">
                            <Button className="gap-2">
                                <Target className="h-4 w-4" />
                                Explore More Courses
                            </Button>
                        </Link>
                    </div>
                </motion.div>
                {enrollments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                                <BookOpen className="h-12 w-12 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-3">Start Your Learning Journey</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                You haven't enrolled in any courses yet. Explore our catalog and start learning today!
                            </p>
                            <Link to="/courses">
                                <Button size="lg" className="gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Browse Courses
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                        >
                            {stats.map((stat, index) => (
                                <Card key={stat.label} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                        <p className="text-3xl font-extrabold">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Continue Learning</h2>
                                <Badge variant="outline" className="gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {enrollments.length} Active
                                </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {enrollments.map((enrollment, index) => (
                                    <motion.div
                                        key={enrollment.courseId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <Link to={`/course/${enrollment.courseId}/learn`}>
                                            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 group">
                                                <div className="flex flex-col sm:flex-row h-full">
                                                    <div className="relative w-full sm:w-40 h-48 sm:h-auto bg-muted shrink-0">
                                                        <img
                                                            src={getCourseImage(enrollment.courseTitle)}
                                                            alt={enrollment.courseTitle}
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                <Play className="h-6 w-6 text-white fill-white" />
                                                            </div>
                                                        </div>
                                                        {enrollment.progressPercentage === 100 && (
                                                            <Badge className="absolute top-3 right-3 bg-green-600 text-white border-0">
                                                                <Trophy className="h-3 w-3 mr-1" />
                                                                Completed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                                {enrollment.courseTitle}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                by {enrollment.teacherName}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-semibold text-muted-foreground">
                                                                    Your Progress
                                                                </span>
                                                                <span className="text-sm font-bold text-primary">
                                                                    {enrollment.progressPercentage || 0}%
                                                                </span>
                                                            </div>
                                                            <Progress value={enrollment.progressPercentage || 0} className="mb-4" />
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>Last accessed 2 days ago</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                                                    Continue
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};
export default MyLearning;
