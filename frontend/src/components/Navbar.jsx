import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen, User, LogOut, Award, LayoutDashboard, GraduationCap,
    Users, Settings, ShieldCheck, Menu, X, Bell
} from 'lucide-react';
import { notificationAPI } from '../services/api';

import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useState } from 'react';
const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useState(() => {
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
                { to: '/courses', label: 'Discover', icon: BookOpen }
            ];
        }
        const commonLinks = [
            { to: '/courses', label: 'Discover', icon: BookOpen }
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
                { to: '/teach', label: 'Instructor Dashboard', icon: LayoutDashboard }
            ];
        }
        if (user?.role === 'ADMIN') {
            return [
                ...commonLinks,
                { to: '/admin/users', label: 'Manage Users', icon: Users },
                { to: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
                { to: '/admin/analytics', label: 'Analytics', icon: LayoutDashboard }
            ];
        }
        return commonLinks;
    };
    const navLinks = getNavLinks();
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text hidden sm:inline">LearnHub</span>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 ml-2">
                            <ThemeToggle />
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background animate-pulse"></span>
                                    )}
                                </Button>
                                {showNotifications && (
                                    <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-card text-card-foreground shadow-lg z-50 overflow-hidden">
                                        <div className="p-3 border-b bg-muted/50 flex justify-between items-center">
                                            <span className="font-semibold text-sm">Notifications</span>
                                            {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground text-sm">
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                                                        onClick={() => {
                                                            if (!notification.read) handleMarkAsRead(notification.id);

                                                            if (notification.type === 'REVIEW' && notification.relatedEntityId) {
                                                                navigate(`/course/${notification.relatedEntityId}/learn`);
                                                                setShowNotifications(false);
                                                            } else if (notification.type === 'SUBMISSION' && notification.relatedEntityId) {
                                                                navigate(`/teach/assignments/${notification.relatedEntityId}`); // Assuming this route exists or will be created
                                                                setShowNotifications(false);
                                                            }
                                                        }}
                                                    >
                                                        <p className="text-sm">{notification.message}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Link to="/profile">
                                    <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-sm font-semibold text-white">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    </Button>
                                </Link>
                                {user?.role && (
                                    <Badge
                                        variant={
                                            user.role === 'ADMIN' ? 'default' :
                                                user.role === 'TEACHER' ? 'warning' :
                                                    'outline'
                                        }
                                        className="gap-1 hidden lg:flex"
                                    >
                                        {user.role === 'ADMIN' && <ShieldCheck className="h-3 w-3" />}
                                        {user.role === 'TEACHER' && <LayoutDashboard className="h-3 w-3" />}
                                        {user.role === 'STUDENT' && <GraduationCap className="h-3 w-3" />}
                                        {user.role}
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link to="/login">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
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
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <link.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <>
                                <div className="border-t pt-3 mt-3">
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user?.name}</div>
                                            <div className="text-xs text-muted-foreground">{user?.email}</div>
                                        </div>
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors w-full text-left text-red-600 dark:text-red-400"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="border-t pt-3 mt-3 space-y-2">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar;
