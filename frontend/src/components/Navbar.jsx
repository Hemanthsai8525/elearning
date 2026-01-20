import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen, User, LogOut, Award, LayoutDashboard, GraduationCap,
    Users, Settings, ShieldCheck, Menu, X, Bell, Search, Sparkles
} from 'lucide-react';
import { notificationAPI } from '../services/api';

import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Poll every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    async function fetchNotifications() {
        try {
            const res = await notificationAPI.getMyNotifications();
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    }

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) { }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const getNavLinks = () => {
        if (!isAuthenticated) {
            return [
                { to: '/courses', label: 'Explore', icon: BookOpen }
            ];
        }
        const commonLinks = [
            { to: '/courses', label: 'Explore', icon: BookOpen }
        ];
        if (user?.role === 'STUDENT') {
            return [
                ...commonLinks,
                { to: '/my-learning', label: 'My Learning', icon: GraduationCap },
                { to: '/certificates', label: 'Certificates', icon: Award }
            ];
        }
        if (user?.role === 'TEACHER') {
            return [
                ...commonLinks,
                { to: '/teach', label: 'Dashboard', icon: LayoutDashboard }
            ];
        }
        if (user?.role === 'ADMIN') {
            return [
                ...commonLinks,
                { to: '/admin/users', label: 'Users', icon: Users },
                { to: '/admin/courses', label: 'Courses', icon: BookOpen },
                { to: '/admin/analytics', label: 'Analytics', icon: LayoutDashboard }
            ];
        }
        return commonLinks;
    };

    const navLinks = getNavLinks();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}
        >
            <div className="container flex h-20 items-center justify-between">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                        <BookOpen className="h-6 w-6 text-white" />
                        <div className="absolute inset-0 rounded-xl bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 hidden sm:inline-block">
                        LearnHub
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                            {location.pathname === link.to && (
                                <motion.div
                                    layoutId="navbar-underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <ThemeToggle />
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative rounded-full hover:bg-muted"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                                    )}
                                </Button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-4 w-80 rounded-2xl border bg-card/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5"
                                        >
                                            <div className="p-4 border-b bg-muted/30 flex justify-between items-center backdrop-blur-sm">
                                                <h3 className="font-semibold text-sm">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                        {unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center">
                                                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                                            <Bell className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-primary/5' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowNotifications(false);

                                                                // Optimistically remove from list and update count
                                                                setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                                                if (!notification.read) {
                                                                    setUnreadCount(prev => Math.max(0, prev - 1));
                                                                    notificationAPI.markAsRead(notification.id).catch(console.error);
                                                                }

                                                                if (notification.type === 'REVIEW' && notification.relatedEntityId) {
                                                                    navigate(`/course/${notification.relatedEntityId}/learn`);
                                                                } else if (notification.type === 'SUBMISSION' && notification.relatedEntityId) {
                                                                    navigate(`/teach/course/${notification.relatedEntityId}`);
                                                                }
                                                            }}
                                                        >
                                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notification.read ? 'bg-primary' : 'bg-muted'}`} />
                                                            <div>
                                                                <p className="text-sm leading-snug">{notification.message}</p>
                                                                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-3 pl-2 border-l">
                                <Link to="/profile">
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-background hover:ring-primary/20 transition-all p-0 overflow-hidden">
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-purple-600 text-sm font-bold text-white">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="text-muted-foreground hover:text-red-500 rounded-full"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link to="/login">
                                <Button variant="ghost" className="font-medium">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="gradient" className="rounded-full px-6 shadow-lg shadow-primary/20">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex md:hidden items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-full"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background/95 backdrop-blur-xl"
                    >
                        <div className="container py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === link.to ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                                >
                                    <link.icon className="h-5 w-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                            <div className="border-t my-2 pt-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                                {user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user?.name}</div>
                                                <div className="text-xs text-muted-foreground">{user?.email}</div>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 w-full transition-colors font-medium mt-1"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3 px-2 pt-2">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full rounded-xl">Sign In</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="gradient" className="w-full rounded-xl">Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
export default Navbar;
