import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, enrollmentAPI, certificateAPI } from '../services/api';
import {
    User, Lock, Mail, Save, ShieldCheck, AlertCircle, CheckCircle,
    Camera, Award, BookOpen, TrendingUp, Calendar, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user]);
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await userAPI.updateProfile(profileData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setLoading(true);
        try {
            await userAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };
    const [statsCounts, setStatsCounts] = useState({ enrolled: 0, certificates: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [enrollmentsRes, certificatesRes] = await Promise.all([
                    enrollmentAPI.getMyEnrollments(),
                    certificateAPI.getMyCertificates()
                ]);
                setStatsCounts({
                    enrolled: enrollmentsRes.data.length,
                    certificates: certificatesRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Courses Enrolled', value: statsCounts.enrolled.toString(), icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
        { label: 'Certificates', value: statsCounts.certificates.toString(), icon: Award, color: 'from-amber-500 to-orange-500' },
        { label: 'Learning Streak', value: `${user?.currentStreak || 0} day${(user?.currentStreak === 1 ? '' : 's')}`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    ];
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
            <div className="container max-w-6xl">
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
                    className="mb-8"
                >
                    <Card className="overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary via-purple-600 to-pink-600"></div>
                        <CardContent className="relative pt-0 pb-8">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-12">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-5xl font-extrabold shadow-2xl border-4 border-background">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-4 w-4 text-primary" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                        <div>
                                            <h1 className="text-3xl font-extrabold mb-2">{user?.name}</h1>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="default" className="gap-1">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    {user?.role}
                                                </Badge>
                                                <Badge variant="outline" className="gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Joined Dec 2024
                                                </Badge>
                                                <Badge variant="secondary" className="gap-1">
                                                    <span className="font-mono text-xs">ID: {user?.id}</span>
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-3 gap-6 mb-8"
                >
                    {stats.map((stat, index) => (
                        <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-extrabold">{stat.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <div className="inline-flex p-1 bg-muted rounded-lg">
                        <Button
                            variant={activeTab === 'profile' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('profile')}
                            className="gap-2"
                        >
                            <User className="h-4 w-4" />
                            Basic Info
                        </Button>
                        <Button
                            variant={activeTab === 'password' ? 'default' : 'ghost'}
                            onClick={() => setActiveTab('password')}
                            className="gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            Security
                        </Button>
                    </div>
                </motion.div>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}
                    >
                        {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span>{message.text}</span>
                    </motion.div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {activeTab === 'profile' ? 'Personal Information' : 'Update Password'}
                            </CardTitle>
                            <CardDescription>
                                {activeTab === 'profile'
                                    ? 'Update your personal details and profile information'
                                    : 'Change your password to keep your account secure'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activeTab === 'profile' ? (
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <input
                                                type="text"
                                                className="input pl-10"
                                                value={profileData.name}
                                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <input
                                                type="email"
                                                className="input pl-10 bg-muted cursor-not-allowed"
                                                value={profileData.email}
                                                disabled
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 italic">
                                            Email cannot be changed for security reasons
                                        </p>
                                    </div>
                                    <Button type="submit" disabled={loading} className="gap-2">
                                        <Save className="h-4 w-4" />
                                        {loading ? 'Saving...' : 'Update Profile'}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            placeholder="••••••••"
                                            value={passwordData.currentPassword}
                                            onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            placeholder="••••••••"
                                            value={passwordData.newPassword}
                                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Must be at least 8 characters long
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            placeholder="••••••••"
                                            value={passwordData.confirmPassword}
                                            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Processing...' : 'Change Password'}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};
export default Profile;
