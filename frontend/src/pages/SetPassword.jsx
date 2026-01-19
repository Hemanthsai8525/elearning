import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { Lock } from 'lucide-react';

const SetPassword = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { success, error } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            error("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await userAPI.forceChangePassword(password);
            success('Password set successfully! Please login again.');
            logout(); // Logout to force re-login with clean state or just update local user status
            navigate('/login');
        } catch (err) {
            error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        For security reasons, you must set a new password before continuing.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center"
                        >
                            {loading ? 'Updating...' : 'Set Password'}
                        </Button>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={logout}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
