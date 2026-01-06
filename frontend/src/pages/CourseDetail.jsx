import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI, enrollmentAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Clock, Users, Award, BookOpen, PlayCircle, CheckCircle, ChevronRight,
    Share2, Heart, ShieldCheck, Star, TrendingUp, Globe, Smartphone, Trophy, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { getCourseImage } from '../lib/courseImages';
const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    useEffect(() => {
        fetchCourseDetails();
    }, [id]);
    const fetchCourseDetails = async () => {
        try {
            const courseRes = await courseAPI.getCoursePreview(id);
            setCourse(courseRes.data);
            if (isAuthenticated) {
                try {
                    const enrollRes = await enrollmentAPI.checkEnrollment(id);
                    setEnrolled(enrollRes.data);
                } catch (e) {
                    console.error("Could not check enrollment", e);
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (enrolled) {
            navigate(`/course/${id}/learn`);
            return;
        }
        if (course.paid) {
            navigate(`/checkout/${id}`);
            return;
        }
        setEnrolling(true);
        try {
            await enrollmentAPI.enroll(id);
            setEnrolled(true);
            navigate('/my-learning');
        } catch (error) {
            console.error('Error enrolling:', error);
            alert(error.response?.data?.message || 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container">
                    <Skeleton className="h-96 w-full mb-8" />
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-96 w-full" />
                        </div>
                        <Skeleton className="h-[600px] w-full" />
                    </div>
                </div>
            </div>
        );
    }
    if (!course) {
        return (
            <div className="container py-20 text-center">
                <Card className="p-12">
                    <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                    <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
                </Card>
            </div>
        );
    }
    const learningPoints = [
        `Master the fundamentals and advanced concepts of ${course.title}`,
        'Build real-world projects to strengthen your portfolio',
        'Learn industry best practices and modern techniques',
        'Get hands-on experience with practical exercises'
    ];
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-b">
                <div className="container py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2">
                            <Button
                                variant="ghost"
                                className="mb-4 pl-0 hover:pl-2 transition-all"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft size={18} className="mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <span>Courses</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-foreground font-medium">{course.title}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {course.title}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="font-bold">4.9</span>
                                    <span className="text-muted-foreground">(2,432 ratings)</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>5,231 students</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Updated Dec 2025</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {course.teacherName?.charAt(0) || 'T'}
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Instructor</div>
                                    <div className="font-semibold">{course.teacherName || 'Expert Instructor'}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="container py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>What you'll learn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {learningPoints.map((point, i) => (
                                            <div key={i} className="flex gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                                <span className="text-sm">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Course Curriculum</CardTitle>
                                        <span className="text-sm text-muted-foreground">
                                            {course.lessons?.length || 0} lessons • 12h 45m
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {course.lessons?.map((lesson, idx) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                                        {idx + 1}
                                                    </div>
                                                    <PlayCircle className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                            {lesson.title}
                                                        </h4>
                                                        <span className="text-xs text-muted-foreground">Preview • 12:45</span>
                                                    </div>
                                                </div>
                                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                    <div className="lg:sticky lg:top-24 h-fit">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="overflow-hidden">
                                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-600/20">
                                    <img
                                        src={getCourseImage(course.title)}
                                        alt="Course preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                                            <PlayCircle className="h-8 w-8 text-white" />
                                        </div>
                                        <span className="text-white font-semibold text-sm">Preview Course</span>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        {course.paid ? (
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-4xl font-extrabold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                    ₹{course.price}
                                                </span>
                                                <span className="text-muted-foreground line-through">₹{Number(course.price) * 2}</span>
                                                <Badge variant="success">50% OFF</Badge>
                                            </div>
                                        ) : (
                                            <span className="text-4xl font-extrabold text-green-600 dark:text-green-400">Free</span>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleEnroll}
                                        className="w-full h-12 text-lg mb-4"
                                        disabled={enrolling}
                                    >
                                        {enrolling ? 'Processing...' : enrolled ? 'Go to Course 🚀' : course.paid ? 'Buy Now' : 'Enroll Now'}
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground mb-6">
                                        30-Day Money-Back Guarantee
                                    </p>
                                    <div className="space-y-3 mb-6 pb-6 border-b">
                                        <h4 className="font-semibold text-sm">This course includes:</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm">
                                                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                                <span>12 hours on-demand video</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span>{course.lessons?.length || 0} lessons</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Award className="h-4 w-4 text-muted-foreground" />
                                                <span>Certificate of completion</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <span>Full lifetime access</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                                <span>Access on mobile and desktop</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button variant="ghost" size="sm">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Wishlist
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CourseDetail;
