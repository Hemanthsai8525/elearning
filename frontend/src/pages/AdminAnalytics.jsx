import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { courseAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Calendar, TrendingUp, Users, DollarSign, ArrowLeft } from 'lucide-react';
const AdminAnalytics = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeCoursesCount, setActiveCoursesCount] = useState(0);
    const [timeRange, setTimeRange] = useState('7d');
    const revenueData = [
        { name: 'Mon', revenue: 4000, students: 24 },
        { name: 'Tue', revenue: 3000, students: 13 },
        { name: 'Wed', revenue: 2000, students: 98 },
        { name: 'Thu', revenue: 2780, students: 39 },
        { name: 'Fri', revenue: 1890, students: 48 },
        { name: 'Sat', revenue: 2390, students: 38 },
        { name: 'Sun', revenue: 3490, students: 43 },
    ];
    const categoryData = [
        { name: 'Web Dev', value: 400 },
        { name: 'Mobile', value: 300 },
        { name: 'Data Science', value: 300 },
        { name: 'DevOps', value: 200 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
        const fetchStats = async () => {
            try {
                const response = await courseAPI.getAllCourses();
                setActiveCoursesCount(response.data.length);
            } catch (error) {
                console.error("Failed to fetch courses count", error);
            }
        };
        fetchStats();
    }, []);
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
                        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
                        <p className="text-muted-foreground">Deep dive into platform performance, revenue, and user growth.</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 3 Months</option>
                        </select>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <DollarSign className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-2xl font-bold">₹45,231</div>
                            <p className="text-xs text-green-500 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" /> +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">New Students</p>
                                <Users className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-green-500 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1" /> +180.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-2xl font-bold">{activeCoursesCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                +2 new this week
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                                <TrendingUp className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="text-2xl font-bold">24.5%</div>
                            <p className="text-xs text-red-500 flex items-center mt-1">
                                <TrendingUp className="h-3 w-3 mr-1 rotate-180" /> -4% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
                    <Card className="col-span-1 lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Daily revenue trends for the selected period.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`₹${value}`, 'Revenue']}
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#8884d8"
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Popular Categories</CardTitle>
                            <CardDescription>Distribution of student interest by topic.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Engagement</CardTitle>
                            <CardDescription>Daily active students on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        />
                                        <Bar dataKey="students" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Latest course purchases.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Course Purchase</p>
                                                <p className="text-xs text-muted-foreground">User #{1000 + i}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">+₹499.00</p>
                                            <p className="text-xs text-muted-foreground">2 mins ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
export default AdminAnalytics;
