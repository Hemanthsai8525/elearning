import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI, lessonAPI, enrollmentAPI, taskAPI, mcqAPI, theoryAPI } from '../services/api';
import {
    BookOpen, Video, Users, ArrowLeft, Play, Code, Plus,
    CheckCircle, AlertCircle, Trash2, Edit, FileText, Eye, Download, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('lessons');
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [lessonData, setLessonData] = useState({
        title: '',
        videoUrl: '',
        lessonOrder: 1,
    });
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        taskType: 'CODING',
        starterCode: '# Write your code here\n',
        testCases: [{ input: '', expectedOutput: '' }],
        mcqQuestions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]
    });

    const [isReviewing, setIsReviewing] = useState(false);
    const [selectedReviewTask, setSelectedReviewTask] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [reviewData, setReviewData] = useState({
        score: '',
        feedback: ''
    });
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
    useEffect(() => {
        fetchCourseData();
    }, [courseId]);
    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const [courseRes, lessonsRes, tasksRes, studentsRes] = await Promise.all([
                courseAPI.getCoursePreview(courseId),
                courseAPI.getCourseLessons(courseId),
                taskAPI.getTasks(courseId),
                enrollmentAPI.getCourseEnrollees(courseId)
            ]);
            setCourse(courseRes.data);
            setLessons(lessonsRes.data);
            setTasks(tasksRes.data);
            setStudents(studentsRes.data);
            setLessonData(prev => ({ ...prev, lessonOrder: lessonsRes.data.length + 1 }));
        } catch (error) {
            console.error('Error fetching course data:', error);
            setMessage({ type: 'error', text: 'Failed to load course data.' });
        } finally {

            setLoading(false);
        }
    };

    const handlePublishToggle = async () => {
        try {
            const newStatus = !course.published;
            await courseAPI.updateCourse(courseId, {
                title: course.title,
                description: course.description,
                paid: course.paid,
                price: course.price,
                published: newStatus
            });
            setCourse(prev => ({ ...prev, published: newStatus }));
            setMessage({ type: 'success', text: newStatus ? '🎉 Course Published!' : 'Course Unpublished (Draft Mode)' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update course status.' });
        }
    };

    const handleAddLesson = async (e, addAnother = false) => {
        e.preventDefault();
        try {
            await lessonAPI.createLesson(courseId, lessonData);
            setMessage({ type: 'success', text: '✅ Lesson added successfully!' });

            if (addAnother) {
                setLessonData({ ...lessonData, title: '', videoUrl: '', lessonOrder: lessonData.lessonOrder + 1 });
            } else {
                setIsAddingLesson(false);
                setLessonData({ title: '', videoUrl: '', lessonOrder: lessons.length + 2 });
            }

            fetchCourseData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add lesson' });
        }
    };

    const handleAddTask = async (e, addAnother = false) => {
        e.preventDefault();

        // Validate based on task type
        if (taskData.taskType === 'CODING') {
            const validTestCases = taskData.testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
            if (validTestCases.length === 0) {
                setMessage({ type: 'error', text: 'Please add at least one valid test case with both input and expected output' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                return;
            }
        } else if (taskData.taskType === 'MCQ') {
            const validQuestions = taskData.mcqQuestions.filter(q =>
                q.question.trim() && q.optionA.trim() && q.optionB.trim() &&
                q.optionC.trim() && q.optionD.trim() && q.correctAnswer
            );
            if (validQuestions.length === 0) {
                setMessage({ type: 'error', text: 'Please add at least one complete MCQ question with all options' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                return;
            }
        }

        try {
            const payload = {
                title: taskData.title,
                description: taskData.description,
                taskType: taskData.taskType
            };

            if (taskData.taskType === 'CODING') {
                payload.starterCode = taskData.starterCode;
                payload.testCases = taskData.testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
            } else if (taskData.taskType === 'MCQ') {
                payload.mcqQuestions = taskData.mcqQuestions.filter(q =>
                    q.question.trim() && q.optionA.trim() && q.optionB.trim() &&
                    q.optionC.trim() && q.optionD.trim()
                );
            }
            // THEORY tasks only need title and description

            await taskAPI.createTask(courseId, payload);
            setMessage({ type: 'success', text: '✅ Task added successfully!' });

            if (addAnother) {
                setTaskData({
                    ...taskData,
                    title: '',
                    description: '',
                    starterCode: '# Write your code here\n',
                    testCases: [{ input: '', expectedOutput: '' }],
                    mcqQuestions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]
                });
            } else {
                setIsAddingTask(false);
                setTaskData({
                    title: '',
                    description: '',
                    taskType: 'CODING',
                    starterCode: '# Write your code here\n',
                    testCases: [{ input: '', expectedOutput: '' }],
                    mcqQuestions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]
                });
            }

            fetchCourseData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add task' });
        }
    };
    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = [...taskData.testCases];
        updatedTestCases[index][field] = value;
        setTaskData({ ...taskData, testCases: updatedTestCases });
    };
    const addTestCase = () => {
        setTaskData({
            ...taskData,
            testCases: [...taskData.testCases, { input: '', expectedOutput: '' }]
        });
    };
    const removeTestCase = (index) => {
        const updatedTestCases = taskData.testCases.filter((_, i) => i !== index);
        setTaskData({ ...taskData, testCases: updatedTestCases });
    };

    const handleMcqQuestionChange = (index, field, value) => {
        const updatedQuestions = [...taskData.mcqQuestions];
        updatedQuestions[index][field] = value;
        setTaskData({ ...taskData, mcqQuestions: updatedQuestions });
    };

    const addMcqQuestion = () => {
        setTaskData({
            ...taskData,
            mcqQuestions: [...taskData.mcqQuestions, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }]
        });
    };

    const removeMcqQuestion = (index) => {
        const updatedQuestions = taskData.mcqQuestions.filter((_, i) => i !== index);
        setTaskData({ ...taskData, mcqQuestions: updatedQuestions });
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            return;
        }
        setLoading(true);
        try {
            await taskAPI.deleteTask(taskId);
            setMessage({ type: 'success', text: 'Task deleted successfully!' });
            fetchCourseData();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete task' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReview = async (task) => {
        setSelectedReviewTask(task);
        setIsReviewing(true);
        setLoading(true);
        try {
            const res = await theoryAPI.getAllSubmissions(task.id);
            setSubmissions(res.data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch submissions' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (submissionId) => {
        if (!reviewData.score || !reviewData.feedback) {
            setMessage({ type: 'error', text: 'Please provide both score and feedback' });
            return;
        }

        try {
            // Calculate status based on score (60% threshold)
            const status = parseFloat(reviewData.score) >= 60 ? 'PASS' : 'FAIL';

            await theoryAPI.reviewSubmission(submissionId, {
                percentage: parseFloat(reviewData.score),
                feedback: reviewData.feedback,
                status: status
            });
            setMessage({ type: 'success', text: 'Review submitted successfully' });
            // Refresh submissions
            const res = await theoryAPI.getAllSubmissions(selectedReviewTask.id);
            setSubmissions(res.data);
            setReviewData({ score: '', feedback: '' });
            setSelectedSubmissionId(null);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit review' });
        }
    };

    const handleDownloadFile = async (submissionId, fileName) => {
        try {
            const response = await theoryAPI.downloadSubmission(submissionId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to download file' });
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
            return;
        }
        setLoading(true);
        try {
            await lessonAPI.deleteLesson(courseId, lessonId);
            setMessage({ type: 'success', text: 'Lesson deleted successfully!' });
            fetchCourseData();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete lesson' });
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }
    if (!course) return <div>Course not found</div>;
    return (
        <div className="min-h-screen bg-muted/5 pb-20">
            <div className="bg-card border-b">
                <div className="container py-6 max-w-6xl mx-auto">
                    <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/teach')}>
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{course.title}</h1>
                            <p className="text-muted-foreground">{course.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <Badge variant={course.paid ? "default" : "secondary"} className="h-fit">
                                {course.paid ? 'PAID' : 'FREE'}
                            </Badge>
                            <Badge variant={course.published ? "success" : "warning"} className={cn("h-fit", course.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200")}>
                                {course.published ? 'PUBLISHED' : 'DRAFT'}
                            </Badge>
                            <Button
                                size="sm"
                                variant={course.published ? "outline" : "default"}
                                onClick={handlePublishToggle}
                                className={cn(course.published ? "border-destructive text-destructive hover:bg-destructive/10" : "")}
                            >
                                {course.published ? 'Unpublish' : 'Publish Course'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container py-8 max-w-6xl mx-auto">
                <div className="flex items-center gap-6 mb-8 border-b overflow-x-auto">
                    {['lessons', 'tasks', 'students'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setIsAddingLesson(false);
                                setIsAddingTask(false);
                            }}
                            className={cn(
                                "pb-3 text-sm font-medium capitalize transition-colors relative whitespace-nowrap",
                                activeTab === tab
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab === 'lessons' && <span className="flex items-center gap-2"><Video size={16} /> Video Lessons ({lessons.length})</span>}
                            {tab === 'tasks' && <span className="flex items-center gap-2"><Code size={16} /> Assignments ({tasks.length})</span>}
                            {tab === 'students' && <span className="flex items-center gap-2"><Users size={16} /> Enrolled Students ({students.length})</span>}
                        </button>
                    ))}
                </div>
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={cn(
                                "fixed top-6 right-6 z-[100] flex items-center gap-4 p-4 rounded-xl shadow-lg border backdrop-blur-md",
                                message.type === 'success' ? "bg-green-100 border-green-200 text-green-800" : "bg-red-100 border-red-200 text-red-800"
                            )}
                        >
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <p className="font-medium text-sm">{message.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="min-h-[400px]">
                    {activeTab === 'lessons' && (
                        <div className="space-y-6">
                            {!isAddingLesson ? (
                                <>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold">Course Content</h3>
                                        <Button onClick={() => setIsAddingLesson(true)}>
                                            <Plus size={18} className="mr-2" /> Add Lesson
                                        </Button>
                                    </div>
                                    {lessons.length === 0 ? (
                                        <Card className="border-dashed py-12 text-center">
                                            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                                                <Video className="text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground">No lessons added yet.</p>
                                        </Card>
                                    ) : (
                                        <div className="space-y-3">
                                            {lessons.map((lesson, idx) => (
                                                <Card key={lesson.id} className="hover:border-primary/50 transition-colors">
                                                    <CardContent className="p-4 flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center shrink-0">
                                                            <Play size={16} className="text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium truncate">{lesson.title}</h4>
                                                            <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">
                                                                {lesson.videoUrl}
                                                            </a>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteLesson(lesson.id)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add New Lesson</CardTitle>
                                        <CardDescription>Add a video lesson to your course.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => handleAddLesson(e, false)} className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Lesson Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={lessonData.title}
                                                    onChange={e => setLessonData({ ...lessonData, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Video URL</label>
                                                <input
                                                    type="url"
                                                    required
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={lessonData.videoUrl}
                                                    onChange={e => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-4">
                                                <Button type="button" variant="outline" onClick={(e) => handleAddLesson(e, true)}>Save & Add Another</Button>
                                                <Button type="submit">Save & Close</Button>
                                                <Button type="button" variant="ghost" onClick={() => setIsAddingLesson(false)}>Cancel</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    {activeTab === 'tasks' && (
                        <div className="space-y-6">
                            {!isAddingTask ? (
                                <>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold">Assignments</h3>
                                        <Button onClick={() => setIsAddingTask(true)}>
                                            <Plus size={18} className="mr-2" /> Add Task
                                        </Button>
                                    </div>
                                    {tasks.length === 0 ? (
                                        <Card className="border-dashed py-12 text-center">
                                            <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                                                <Code className="text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground">No tasks added yet.</p>
                                        </Card>
                                    ) : (
                                        <div className="space-y-3">
                                            {tasks.map((task, idx) => (
                                                <Card key={task.id} className="hover:border-primary/50 transition-colors">
                                                    <CardContent className="p-4 flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-sm font-bold text-orange-600">
                                                            T{idx + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium truncate">{task.title}</h4>
                                                            <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                                                        </div>
                                                        <Badge variant="outline" className={
                                                            task.taskType === 'CODING' ? 'border-blue-500 text-blue-700' :
                                                                task.taskType === 'MCQ' ? 'border-purple-500 text-purple-700' :
                                                                    'border-green-500 text-green-700'
                                                        }>
                                                            {task.taskType || 'CODING'}
                                                        </Badge>
                                                        {task.taskType === 'CODING' && (
                                                            <Badge variant="secondary">{task.testCases?.length || 0} Tests</Badge>
                                                        )}
                                                        {task.taskType === 'MCQ' && (
                                                            <Badge variant="secondary">{task.mcqQuestions?.length || 0} Questions</Badge>
                                                        )}
                                                        {task.taskType === 'THEORY' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleOpenReview(task)}
                                                                className="gap-2"
                                                            >
                                                                <Eye size={16} />
                                                                Review
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteTask(task.id)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add New Task</CardTitle>
                                        <CardDescription>Create an assignment for your students.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => handleAddTask(e, false)} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Task Type</label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={taskData.taskType}
                                                    onChange={e => setTaskData({ ...taskData, taskType: e.target.value })}
                                                >
                                                    <option value="CODING">Coding Challenge</option>
                                                    <option value="MCQ">Multiple Choice Quiz</option>
                                                    <option value="THEORY">Theory Assignment</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Task Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={taskData.title}
                                                    onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Description</label>
                                                <textarea
                                                    required
                                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                                                    value={taskData.description}
                                                    onChange={e => setTaskData({ ...taskData, description: e.target.value })}
                                                />
                                            </div>

                                            {/* CODING Task Fields */}
                                            {taskData.taskType === 'CODING' && (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Starter Code</label>
                                                        <textarea
                                                            className="flex min-h-[150px] w-full rounded-md border border-input bg-slate-950 text-slate-50 px-3 py-2 text-sm font-mono"
                                                            value={taskData.starterCode}
                                                            onChange={e => setTaskData({ ...taskData, starterCode: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="font-medium text-sm">Test Cases</h4>
                                                            <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                                                                Add Case
                                                            </Button>
                                                        </div>
                                                        {taskData.testCases.map((tc, idx) => (
                                                            <div key={idx} className="flex gap-4 items-start">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                                                    <input
                                                                        placeholder="Input"
                                                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                        value={tc.input}
                                                                        onChange={e => handleTestCaseChange(idx, 'input', e.target.value)}
                                                                    />
                                                                    <input
                                                                        placeholder="Expected Output"
                                                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                        value={tc.expectedOutput}
                                                                        onChange={e => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                                                                    />
                                                                </div>
                                                                {taskData.testCases.length > 1 && (
                                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTestCase(idx)} className="text-red-500">
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            {/* MCQ Task Fields */}
                                            {taskData.taskType === 'MCQ' && (
                                                <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-medium text-sm">MCQ Questions</h4>
                                                        <Button type="button" variant="outline" size="sm" onClick={addMcqQuestion}>
                                                            Add Question
                                                        </Button>
                                                    </div>
                                                    {taskData.mcqQuestions.map((q, idx) => (
                                                        <div key={idx} className="space-y-3 p-4 border rounded-lg bg-background">
                                                            <div className="flex justify-between items-start">
                                                                <h5 className="font-medium text-sm">Question {idx + 1}</h5>
                                                                {taskData.mcqQuestions.length > 1 && (
                                                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMcqQuestion(idx)} className="text-red-500">
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <input
                                                                placeholder="Question"
                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                value={q.question}
                                                                onChange={e => handleMcqQuestionChange(idx, 'question', e.target.value)}
                                                            />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    placeholder="Option A"
                                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                    value={q.optionA}
                                                                    onChange={e => handleMcqQuestionChange(idx, 'optionA', e.target.value)}
                                                                />
                                                                <input
                                                                    placeholder="Option B"
                                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                    value={q.optionB}
                                                                    onChange={e => handleMcqQuestionChange(idx, 'optionB', e.target.value)}
                                                                />
                                                                <input
                                                                    placeholder="Option C"
                                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                    value={q.optionC}
                                                                    onChange={e => handleMcqQuestionChange(idx, 'optionC', e.target.value)}
                                                                />
                                                                <input
                                                                    placeholder="Option D"
                                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                    value={q.optionD}
                                                                    onChange={e => handleMcqQuestionChange(idx, 'optionD', e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium">Correct Answer</label>
                                                                <select
                                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                                                    value={q.correctAnswer}
                                                                    onChange={e => handleMcqQuestionChange(idx, 'correctAnswer', e.target.value)}
                                                                >
                                                                    <option value="A">A</option>
                                                                    <option value="B">B</option>
                                                                    <option value="C">C</option>
                                                                    <option value="D">D</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* THEORY Task - No additional fields needed */}
                                            {taskData.taskType === 'THEORY' && (
                                                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                                        Theory assignments require students to upload files (PDF, DOC, DOCX, TXT). You can review and grade submissions from the student dashboard.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-3 pt-4">
                                                <Button type="button" variant="outline" onClick={(e) => handleAddTask(e, true)}>Save & Add Another</Button>
                                                <Button type="submit">Save & Close</Button>
                                                <Button type="button" variant="ghost" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold">Enrolled Students</h3>
                            {students.length === 0 ? (
                                <Card className="border-dashed py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                                        <Users className="text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">No students enrolled yet.</p>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {students.map(student => (
                                        <Card key={student.studentId}>
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                                    {student.studentName.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-medium text-sm truncate">{student.studentName}</p>
                                                        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded">ID: {student.studentId}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Progress value={student.progressPercentage} className="h-1.5 flex-1" />
                                                        <span className="text-[10px] font-bold text-green-600">{student.progressPercentage}%</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isReviewing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Review Submissions: {selectedReviewTask?.title}</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsReviewing(false)}>
                                <X size={20} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {submissions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No submissions found for this task yet.
                                </div>
                            ) : (
                                submissions.map(sub => (
                                    <Card key={sub.id} className="border">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{sub.studentName}</p>
                                                    <p className="text-sm text-muted-foreground">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant={sub.status === 'PASS' ? 'success' : sub.status === 'FAIL' ? 'destructive' : 'secondary'} className={
                                                        sub.status === 'PASS' ? 'bg-green-100 text-green-800' :
                                                            sub.status === 'FAIL' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }>
                                                        {sub.status}
                                                    </Badge>
                                                    <Button size="sm" variant="outline" onClick={() => handleDownloadFile(sub.id, sub.fileName)}>
                                                        <Download size={16} className="mr-2" />
                                                        Download File
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="bg-muted/50 p-3 rounded-md text-sm">
                                                <p className="font-medium mb-1">File:</p>
                                                <p>{sub.fileName}</p>
                                            </div>

                                            {(sub.status === 'PENDING' || selectedSubmissionId === sub.id) ? (
                                                <div className="space-y-3 pt-2 border-t mt-2">
                                                    <p className="font-medium text-sm">Grade & Feedback</p>
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <div className="col-span-1">
                                                            <label className="text-xs font-medium mb-1 block">Score (%)</label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                placeholder="0-100"
                                                                value={selectedSubmissionId === sub.id ? (reviewData.score ?? '') : ''}
                                                                onChange={e => {
                                                                    setSelectedSubmissionId(sub.id);
                                                                    setReviewData({ ...reviewData, score: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <label className="text-xs font-medium mb-1 block">Feedback</label>
                                                            <Input
                                                                placeholder="Enter feedback and suggestions..."
                                                                value={selectedSubmissionId === sub.id ? (reviewData.feedback || '') : ''}
                                                                onChange={e => {
                                                                    setSelectedSubmissionId(sub.id);
                                                                    setReviewData({ ...reviewData, feedback: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        {selectedSubmissionId === sub.id && sub.status !== 'PENDING' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setSelectedSubmissionId(null);
                                                                    setReviewData({ score: '', feedback: '' });
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSubmitReview(sub.id)}
                                                            disabled={selectedSubmissionId !== sub.id || !reviewData.score || !reviewData.feedback}
                                                        >
                                                            Submit Review
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 pt-2 border-t mt-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Score:</span>
                                                        <span className="font-bold">{sub.percentage}%</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-sm text-muted-foreground block">Feedback:</span>
                                                        <p className="text-sm bg-muted p-2 rounded">{sub.teacherFeedback}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full text-xs text-muted-foreground hover:text-primary"
                                                        onClick={() => {
                                                            setSelectedSubmissionId(sub.id);
                                                            setReviewData({ score: sub.percentage, feedback: sub.teacherFeedback || '' });
                                                        }}
                                                    >
                                                        Edit Review
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageCourse;
