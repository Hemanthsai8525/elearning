import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, GraduationCap, Users, Award, TrendingUp,
    CheckCircle, Star, Play, ArrowRight, Sparkles, Target, Zap,
    LayoutDashboard, PlusCircle, BarChart3, Settings
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import TechDemo from '../components/TechDemo';
const Home = () => {
    const { user } = useAuth();
    const getDashboardLink = () => {
        if (!user) return '/register';
        if (user.role === 'ADMIN') return '/admin/users';
        if (user.role === 'TEACHER') return '/teach';
        return '/my-learning';
    };
    const features = [
        {
            icon: BookOpen,
            title: 'Expert-Led Courses',
            description: 'Learn from industry professionals with real-world experience',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Users,
            title: 'Interactive Learning',
            description: 'Engage with peers and instructors in live sessions',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Award,
            title: 'Certified Programs',
            description: 'Earn recognized certificates upon course completion',
            color: 'from-amber-500 to-orange-500'
        },
        {
            icon: TrendingUp,
            title: 'Track Progress',
            description: 'Monitor your learning journey with detailed analytics',
            color: 'from-green-500 to-emerald-500'
        }
    ];
    const stats = [
        { label: 'Active Students', value: '50K+', icon: Users },
        { label: 'Expert Instructors', value: '500+', icon: GraduationCap },
        { label: 'Courses Available', value: '1000+', icon: BookOpen },
        { label: 'Success Rate', value: '95%', icon: Target }
    ];
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            content: 'LearnHub transformed my career. The courses are practical and the instructors are amazing!',
            rating: 5,
            avatar: 'SJ'
        },
        {
            name: 'Michael Chen',
            role: 'Data Scientist',
            content: 'Best online learning platform I\'ve used. The content is top-notch and always up-to-date.',
            rating: 5,
            avatar: 'MC'
        },
        {
            name: 'Emily Rodriguez',
            role: 'UX Designer',
            content: 'The interactive sessions and project-based learning helped me land my dream job!',
            rating: 5,
            avatar: 'ER'
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -z-10"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"
                />
                <div className="container relative">
                    {!user ? (
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Badge variant="default" className="mb-4">
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    #1 E-Learning Platform
                                </Badge>
                                <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Transform Your Future with Expert-Led Learning
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                    Join thousands of learners mastering new skills with our comprehensive courses,
                                    taught by industry experts. Start your journey today.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/courses">
                                        <Button size="lg" className="group">
                                            Explore Courses
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="lg" variant="outline">
                                            Start Free Trial
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 backdrop-blur-sm mb-4">
                                                <Play className="h-12 w-12 text-primary" />
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground">Watch Demo</p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-3xl opacity-50"></div>
                                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl opacity-50"></div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center py-12"
                        >
                            <Badge variant="outline" className="mb-6 px-4 py-1 text-base border-primary/20 bg-primary/5 text-primary">
                                {user.role === 'TEACHER' ? 'Instructor Portal' : user.role === 'ADMIN' ? 'Administrator Access' : 'Student Dashboard'}
                            </Badge>
                            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6">
                                Welcome back, <span className="text-primary">{user.name}</span>!
                            </h1>
                            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                                {user.role === 'TEACHER' ? 'Ready to inspire the next generation of learners?' :
                                    user.role === 'ADMIN' ? 'Manage your platform metrics and user base efficiently.' :
                                        'Pick up where you left off and continue mastering new skills today.'}
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
                                {user.role === 'TEACHER' ? (
                                    <>
                                        <Link to="/teach">
                                            <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50 group">
                                                <CardContent className="p-6 flex items-center gap-4">
                                                    <div className="p-4 rounded-xl bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform">
                                                        <LayoutDashboard size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">My Dashboard</h3>
                                                        <p className="text-muted-foreground text-sm">Manage courses & students</p>
                                                    </div>
                                                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" size={16} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                        <Link to="/teach">
                                            <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50 group">
                                                <CardContent className="p-6 flex items-center gap-4">
                                                    <div className="p-4 rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
                                                        <PlusCircle size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">Create Course</h3>
                                                        <p className="text-muted-foreground text-sm">Publish new content</p>
                                                    </div>
                                                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" size={16} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </>
                                ) : user.role === 'ADMIN' ? (
                                    <>
                                        <Link to="/admin/analytics">
                                            <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50 group">
                                                <CardContent className="p-6 flex items-center gap-4">
                                                    <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:scale-110 transition-transform">
                                                        <BarChart3 size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">Analytics</h3>
                                                        <p className="text-muted-foreground text-sm">View platform stats</p>
                                                    </div>
                                                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" size={16} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                        <Link to="/admin/users">
                                            <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50 group">
                                                <CardContent className="p-6 flex items-center gap-4">
                                                    <div className="p-4 rounded-xl bg-pink-500/10 text-pink-600 group-hover:scale-110 transition-transform">
                                                        <Users size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">User Management</h3>
                                                        <p className="text-muted-foreground text-sm">Control accounts & roles</p>
                                                    </div>
                                                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" size={16} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/my-learning">
                                            <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50 group">
                                                <CardContent className="p-6 flex items-center gap-4">
                                                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                                                        <BookOpen size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">My Learning</h3>
                                                        <p className="text-muted-foreground text-sm">Continue your courses</p>
                                                    </div>
                                                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" size={16} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                        <Link to="/courses">
                                            <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50 group">
                                                <CardContent className="p-6 flex items-center gap-4">
                                                    <div className="p-4 rounded-xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
                                                        <TrendingUp size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">Browse Library</h3>
                                                        <p className="text-muted-foreground text-sm">Find your next skill</p>
                                                    </div>
                                                    <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" size={16} />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
            <section className="py-16 bg-muted/30">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                                    <stat.icon className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-4xl font-extrabold mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"></div>
                <div className="container relative">
                    <div className="text-center mb-16">
                        <Badge variant="default" className="mb-4">Experience It Live</Badge>
                        <h2 className="text-4xl font-extrabold mb-4">See How It Works</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Watch our platform in action and discover the future of online learning
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <TechDemo />

                            {/* Decorative Elements around the demo */}
                            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
                            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] -z-10" />

                            <div className="absolute -bottom-6 -right-6 bg-card/80 backdrop-blur-xl px-5 py-3 rounded-2xl border shadow-2xl flex items-center gap-4 z-20 animate-bounce-slow">
                                <div className="flex -space-x-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br ${i % 2 === 0 ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'} flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}>
                                            {i === 3 ? '50k+' : ''}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Join the Community</div>
                                    <div className="text-xs text-muted-foreground">Devs shipping daily</div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h3 className="text-3xl font-bold mb-4">Start Coding in Seconds</h3>
                                <p className="text-lg text-muted-foreground">
                                    Our state-of-the-art interactive coding environment lets you write, run, and test code directly in your browser. No setup required.
                                </p>
                            </div>
                            <div className="grid gap-6">
                                {[
                                    { title: "Real-time Feedback", desc: "Get instant validation on your code submissions.", icon: Zap },
                                    { title: "Project-Based Learning", desc: "Build real applications for your portfolio.", icon: Target },
                                    { title: "Expert Mentorship", desc: "24/7 support from industry veterans.", icon: Users }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <item.icon className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link to="/courses">
                                <Button size="lg" className="mt-4 gap-2">
                                    Try It Yourself <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
            <section className="py-20">
                <div className="container">
                    <div className="text-center mb-16">
                        <Badge variant="default" className="mb-4">Features</Badge>
                        <h2 className="text-4xl font-extrabold mb-4">Why Choose LearnHub?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to succeed in your learning journey
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 group">
                                    <CardHeader>
                                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="h-7 w-7 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        <CardDescription className="text-base">{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20 bg-muted/30">
                <div className="container">
                    <div className="text-center mb-16">
                        <Badge variant="default" className="mb-4">Testimonials</Badge>
                        <h2 className="text-4xl font-extrabold mb-4">What Our Students Say</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of satisfied learners worldwide
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-xl transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{testimonial.name}</div>
                                                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-20">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Card className="relative overflow-hidden border-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"></div>
                            <CardContent className="relative p-12 text-center">
                                <Zap className="h-16 w-16 mx-auto mb-6 text-primary" />
                                <h2 className="text-4xl font-extrabold mb-4">Ready to Start Learning?</h2>
                                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    Join our community of learners and unlock your potential with expert-led courses
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link to={user ? getDashboardLink() : "/register"}>
                                        <Button size="lg" className="group">
                                            {user ? 'Go to Dashboard' : 'Get Started Free'}
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link to="/courses">
                                        <Button size="lg" variant="outline">
                                            Browse Courses
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
export default Home;
