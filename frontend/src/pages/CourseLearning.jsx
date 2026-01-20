import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI, progressAPI, certificateAPI, taskAPI, mcqAPI, theoryAPI } from '../services/api';
import {
    CheckCircle, Circle, PlayCircle, Award, Lock, ChevronLeft,
    ChevronRight, Menu, X, Play, FileText, Download, MessageSquare, Code, Terminal, ArrowLeft, ExternalLink
} from 'lucide-react';
import Editor from "@monaco-editor/react";
import { Card, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
const LANGUAGE_CONFIG = {
    python: { version: '3.10.0', file: 'main.py' },
    javascript: { version: '18.15.0', file: 'index.js' },
    java: { version: '15.0.2', file: 'Main.java' },
    cpp: { version: '10.2.0', file: 'main.cpp' }
};
const CourseLearning = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
    const [activeTab, setActiveTab] = useState('overview');
    const [toast, setToast] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [code, setCode] = useState('');
    const [executionResults, setExecutionResults] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [language, setLanguage] = useState('python');
    const [mcqAnswers, setMcqAnswers] = useState({});
    const [mcqSubmission, setMcqSubmission] = useState(null);
    const [theoryFile, setTheoryFile] = useState(null);
    const [theorySubmission, setTheorySubmission] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const showToast = (type, text) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3000);
    };
    useEffect(() => {
        fetchCourseData();
    }, [courseId]);
    useEffect(() => {
        if (currentLesson) {
            console.log('Current Lesson Data:', currentLesson);
            console.log('Video URL:', currentLesson.videoUrl);
            setVideoError(false);
        }
    }, [currentLesson]);
    const fetchCourseData = async () => {
        try {
            const [lessonsRes, tasksRes] = await Promise.all([
                courseAPI.getCourseLessons(courseId),
                taskAPI.getTasks(courseId)
            ]);

            setLessons(lessonsRes.data);
            setTasks(tasksRes.data);
            if (lessonsRes.data.length > 0) {
                // Check if a specific lesson ID was passed via navigation state
                const targetLessonId = location.state?.lessonId;
                const targetLesson = targetLessonId
                    ? lessonsRes.data.find(l => l.id === targetLessonId)
                    : lessonsRes.data[0];

                setCurrentLesson(targetLesson || lessonsRes.data[0]);
            }
            try {
                const progressRes = await progressAPI.getProgress(courseId);
                setProgress(progressRes.data);
                if (progressRes.data.completedLessonIds) {
                    setCompletedLessons(new Set(progressRes.data.completedLessonIds));
                }
            } catch (err) {
                console.log('Progress fetch failed (likely valid for non-students):', err);
                setProgress({ progressPercentage: 0, completedLessons: 0, totalLessons: lessonsRes.data.length });
            }
        } catch (error) {
            console.error('Error fetching course data:', error);
            setToast({ type: 'error', text: 'Failed to load course content' });
        } finally {
            setLoading(false);
        }
    };
    const markLessonComplete = async (lessonId) => {
        console.log('Marking lesson complete:', lessonId);
        try {
            setCompletedLessons(prev => new Set([...prev, lessonId]));
            setCompletedLessons(prev => new Set([...prev, lessonId]));
            showToast('success', 'Lesson Completed!');
            await progressAPI.markComplete(courseId, lessonId);
            const progressRes = await progressAPI.getProgress(courseId);
            setProgress(progressRes.data);
        } catch (error) {
            console.error('Error marking lesson complete:', error);
            setToast({ type: 'error', text: 'Failed to save progress' });
        }
    };
    const handleClaimCertificate = async () => {
        try {
            await certificateAPI.generate(courseId);
            navigate('/certificates');
        } catch (error) {
            console.error('Error generating certificate:', error);
            navigate('/certificates');
        }
    };
    const selectLesson = (lesson) => {
        setCurrentLesson(lesson);
        setActiveTask(null);
        setActiveTab('overview');
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    const selectTask = async (task) => {
        setActiveTask(task);
        setCode(task.starterCode || '# Write your Python code here\n# Input is via stdin (input())\n# Print output to stdout (print())\n\nimport sys\n\ndef solve():\n    # read input\n    data = sys.stdin.read().strip()\n    # process\n    \n    # output\n    print(data)\n\nsolve()');
        setExecutionResults(null);
        setCurrentLesson(null);
        setActiveTab('tasks');

        // Fetch existing submissions for MCQ or Theory tasks
        if (task.taskType === 'MCQ') {
            try {
                const res = await mcqAPI.getSubmission(task.id);
                setMcqSubmission(res.data);
            } catch (err) {
                console.log('No existing MCQ submission');
                setMcqSubmission(null);
                setMcqAnswers({});
            }
        } else if (task.taskType === 'THEORY') {
            try {
                const res = await theoryAPI.getSubmission(task.id);
                setTheorySubmission(res.data);
            } catch (err) {
                console.log('No existing Theory submission');
                setTheorySubmission(null);
                setTheoryFile(null);
            }
        }

        if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    const getVideoId = (url) => {
        if (!url) return '';
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : '';
        } catch (e) {
            console.error('Error extracting video ID:', e);
            return '';
        }
    };
    const getDriveEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /\/file\/d\/([a-zA-Z0-9_-]+)/;
        const match = url.match(regExp);
        if (match && match[1]) {
            return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
        return null;
    };

    const isDriveUrl = (url) => {
        return url && (url.includes('drive.google.com') || url.includes('docs.google.com'));
    };

    // State for Drive video auto-completion
    const [autoCompleteTimer, setAutoCompleteTimer] = useState(30);

    useEffect(() => {
        let interval;
        if (currentLesson && isDriveUrl(currentLesson.videoUrl) && !completedLessons.has(currentLesson.id)) {
            // Reset timer when lesson changes
            setAutoCompleteTimer(30);

            interval = setInterval(() => {
                setAutoCompleteTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        markLessonComplete(currentLesson.id);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentLesson, completedLessons]);

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <div className="flex-1 p-8">
                    <Skeleton className="w-full aspect-video rounded-xl mb-8" />
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-8" />
                </div>
                <div className="w-96 border-l p-6 hidden lg:block">
                    <Skeleton className="h-8 w-full mb-6" />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full mb-4" />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="flex min-h-screen bg-background relative">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={cn(
                            "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2",
                            toast.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        )}
                    >
                        {toast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                        {toast.text}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 relative",
                sidebarOpen ? "lg:mr-96" : ""
            )}>
                <Button
                    variant="ghost"
                    className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm"
                    onClick={() => navigate(`/courses/${courseId}`)}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Course
                </Button>
                {!activeTask && (
                    <div className="bg-black relative group flex-shrink-0 bg-zinc-950 flex flex-col justify-center">
                        {currentLesson && currentLesson.videoUrl ? (
                            isDriveUrl(currentLesson.videoUrl) ? (
                                <div className="w-full relative pt-[56.25%] bg-black">
                                    <iframe
                                        src={getDriveEmbedUrl(currentLesson.videoUrl)}
                                        className="absolute top-0 left-0 w-full h-full border-0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        title="Course Video"
                                    ></iframe>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                                        <Button
                                            size="sm"
                                            className={cn(
                                                "gap-2 shadow-lg backdrop-blur-md transition-all duration-500",
                                                completedLessons.has(currentLesson.id)
                                                    ? "bg-green-600/90 hover:bg-green-700/90 text-white"
                                                    : "bg-black/50 hover:bg-black/70 text-white border border-white/20"
                                            )}
                                            onClick={() => markLessonComplete(currentLesson.id)}
                                            disabled={completedLessons.has(currentLesson.id)}
                                        >
                                            {completedLessons.has(currentLesson.id) ? (
                                                <><CheckCircle size={16} /> Completed</>
                                            ) : (
                                                <>
                                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-1" />
                                                    Auto-completing in {autoCompleteTimer}s
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : getVideoId(currentLesson.videoUrl) ? (
                                videoError ? (
                                    <div className="aspect-video w-full flex flex-col items-center justify-center text-white bg-zinc-900 border-b border-zinc-800">
                                        <div className="text-center p-6 max-w-md">
                                            <div className="bg-zinc-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <PlayCircle className="w-8 h-8 text-zinc-500" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">Video Unavailable in Player</h3>
                                            <p className="text-sm text-zinc-400 mb-6">
                                                The owner of this video has disabled playback on other websites. You can still watch it directly on YouTube.
                                            </p>
                                            <a
                                                href={currentLesson.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                <Play size={16} fill="currentColor" /> Watch on YouTube <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full relative pt-[56.25%] bg-black">
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <YouTube
                                                className="w-full h-full"
                                                iframeClassName="w-full h-full absolute top-0 left-0"
                                                videoId={getVideoId(currentLesson.videoUrl)}
                                                opts={{
                                                    height: '100%',
                                                    width: '100%',
                                                    playerVars: {
                                                        autoplay: 1,
                                                        origin: window.location.origin,
                                                    },
                                                }}
                                                onEnd={() => {
                                                    console.log('Video ended event fired for:', currentLesson.title);
                                                    markLessonComplete(currentLesson.id);
                                                }}
                                                onError={(e) => {
                                                    console.error('Video Error:', e);
                                                    if (e.data === 150 || e.data === 101) {
                                                        setVideoError(true);
                                                    } else {
                                                        setToast({ type: 'error', text: 'Error loading video.' });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="aspect-video w-full flex flex-col items-center justify-center text-white bg-zinc-900">
                                    <div className="text-center p-6">
                                        <p className="text-red-400 mb-2 font-bold">Video Unavailable</p>
                                        <p className="text-sm text-zinc-500">The provided video URL is not supported or invalid.</p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="aspect-video w-full flex flex-col items-center justify-center text-white bg-zinc-900">
                                {currentLesson ? (
                                    <div className="text-center p-6">
                                        <p className="text-red-400 mb-2 font-bold">Video Unavailable</p>
                                        <p className="text-sm text-zinc-500">
                                            {currentLesson.videoUrl ? 'The provided video URL is invalid.' : 'No URL provided for this lesson.'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <PlayCircle className="w-20 h-20 mb-4 opacity-20" />
                                        <h3 className="text-xl font-medium text-zinc-400">Select a lesson to begin</h3>
                                    </>
                                )}
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-4 right-4 z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                )}
                <div className="flex-1 bg-background">
                    <div className="border-b bg-background">
                        <div className="container max-w-5xl mx-auto">
                            <div className="flex gap-6 px-4 md:px-0 overflow-x-auto pb-2 scrollbar-none">
                                {['Overview', 'Tasks', 'Resources', 'Q&A', 'Notes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab.toLowerCase());
                                            if (tab.toLowerCase() !== 'tasks' && activeTask) {
                                            }
                                        }}
                                        className={cn(
                                            "pb-3 pt-4 text-sm font-medium transition-colors relative",
                                            activeTab === tab.toLowerCase()
                                                ? "text-primary border-b-2 border-primary"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="container py-6 max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                            <div>
                                <h1 className="text-2xl font-extrabold mb-2">
                                    {activeTask ? activeTask.title : currentLesson?.title}
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {activeTask ? (
                                        <Badge variant="outline" className={cn(
                                            "gap-1",
                                            activeTask.taskType === 'CODING' ? "border-blue-500/50 text-blue-700 dark:text-blue-400" :
                                                activeTask.taskType === 'MCQ' ? "border-purple-500/50 text-purple-700 dark:text-purple-400" :
                                                    "border-green-500/50 text-green-700 dark:text-green-400"
                                        )}>
                                            {activeTask.taskType === 'CODING' && <><Code className="h-3 w-3" /> Coding Challenge</>}
                                            {activeTask.taskType === 'MCQ' && <><CheckCircle className="h-3 w-3" /> Multiple Choice Quiz</>}
                                            {activeTask.taskType === 'THEORY' && <><FileText className="h-3 w-3" /> Theory Assignment</>}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="gap-1">
                                            <PlayCircle className="h-3 w-3" /> Video Lesson
                                        </Badge>
                                    )}
                                    {activeTask && activeTask.completed && (
                                        <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1">
                                            <CheckCircle className="h-3 w-3" /> Completed
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {!activeTask && (
                                <div className="flex items-center gap-2">
                                    {completedLessons.has(currentLesson?.id) ? (
                                        <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1 px-3 py-1.5 text-sm font-medium">
                                            <CheckCircle className="h-4 w-4" /> Completed
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground gap-1 px-3 py-1.5 text-sm font-medium border-dashed">
                                            <Circle className="h-4 w-4" /> Watch to Complete
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="prose dark:prose-invert max-w-none min-h-[400px] pb-32">
                            {activeTab === 'overview' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="py-6"
                                >
                                    <h3 className="text-lg font-bold mb-4">About this {activeTask ? 'Assignment' : 'Lesson'}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-base mb-6">
                                        {activeTask
                                            ? "This is a hands-on coding challenge to test your understanding."
                                            : `In this lesson, we dive deep into the core concepts of ${currentLesson?.title || 'the current topic'}.`
                                        }
                                    </p>
                                </motion.div>
                            )}
                            {activeTab === 'tasks' && (
                                <div className="space-y-4 h-full">
                                    {activeTask ? (
                                        <div className="flex flex-col h-full space-y-4">
                                            {/* CODING Task */}
                                            {(!activeTask.taskType || activeTask.taskType === 'CODING') && (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
                                                    <div className="space-y-6 overflow-y-auto pr-2 h-full custom-scrollbar">
                                                        <div>
                                                            <h2 className="text-2xl font-bold mb-2">{activeTask.title}</h2>
                                                            <div className="prose dark:prose-invert max-w-none text-sm bg-muted/30 p-4 rounded-lg">
                                                                <p className="whitespace-pre-wrap">{activeTask.description}</p>
                                                            </div>
                                                        </div>
                                                        {executionResults && (
                                                            <div className="space-y-3">
                                                                <h3 className="font-semibold flex items-center gap-2">
                                                                    <Terminal size={18} /> Test Results
                                                                </h3>
                                                                <div className="space-y-2">
                                                                    {executionResults.map((result, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={cn(
                                                                                "p-3 rounded-md border text-sm flex items-start justify-between gap-4",
                                                                                result.passed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                                                                            )}
                                                                        >
                                                                            <div className="space-y-1">
                                                                                <div className="flex items-center gap-2 font-medium">
                                                                                    <span className="text-muted-foreground">Test Case {idx + 1}:</span>
                                                                                    {result.passed ? (
                                                                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Passed</span>
                                                                                    ) : (
                                                                                        <span className="text-red-600 flex items-center gap-1"><X size={14} /> Failed</span>
                                                                                    )}
                                                                                </div>
                                                                                {!result.passed && (
                                                                                    <div className="text-xs text-muted-foreground font-mono mt-2 bg-black/5 p-2 rounded">
                                                                                        <div>Input: {result.input}</div>
                                                                                        <div className="text-green-600">Expected: {result.expected}</div>
                                                                                        <div className="text-red-600">Actual: {result.actual}</div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {executionResults.every(r => r.passed) && (
                                                                    <Button
                                                                        className="w-full mt-4"
                                                                        onClick={async () => {
                                                                            try {
                                                                                await taskAPI.markComplete(activeTask.id);
                                                                                setTasks(prev => prev.map(t =>
                                                                                    t.id === activeTask.id ? { ...t, completed: true } : t
                                                                                ));
                                                                                setToast({ type: 'success', text: 'Task completed! Great job!' });
                                                                                setTimeout(() => setToast(null), 3000);
                                                                            } catch (err) {
                                                                                setToast({ type: 'error', text: 'Failed to save completion' });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Submit Assignment
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-[#1e1e1e]">
                                                        <div className="flex items-center justify-between p-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    value={language}
                                                                    onChange={(e) => setLanguage(e.target.value)}
                                                                    className="bg-[#3e3e3e] text-white text-xs px-2 py-1 rounded border-none outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-[#4e4e4e]"
                                                                >
                                                                    <option value="python">Python (3.10)</option>
                                                                    <option value="javascript">JavaScript (Node 18)</option>
                                                                    <option value="java">Java (OpenJDK 15)</option>
                                                                    <option value="cpp">C++ (GCC 10)</option>
                                                                </select>
                                                                <div className="px-3 py-1 bg-[#3e3e3e]/50 rounded text-xs text-gray-500 font-mono border border-white/5">
                                                                    {LANGUAGE_CONFIG[language]?.file}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                onClick={async () => {
                                                                    setIsRunning(true);
                                                                    setExecutionResults(null);
                                                                    try {
                                                                        const results = [];
                                                                        for (const tc of activeTask.testCases) {
                                                                            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                                                                                method: 'POST',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({
                                                                                    language: language,
                                                                                    version: LANGUAGE_CONFIG[language].version,
                                                                                    files: [{ content: code }],
                                                                                    stdin: tc.input
                                                                                })
                                                                            });
                                                                            const data = await response.json();
                                                                            if (data.run) {
                                                                                const actualOutput = data.run.stdout.trim();
                                                                                const expectedOutput = tc.expectedOutput.trim();
                                                                                if (data.run.stderr && !actualOutput) {
                                                                                    results.push({
                                                                                        input: tc.input,
                                                                                        expected: expectedOutput,
                                                                                        actual: "Error: " + data.run.stderr.trim(),
                                                                                        passed: false
                                                                                    });
                                                                                } else {
                                                                                    results.push({
                                                                                        input: tc.input,
                                                                                        expected: expectedOutput,
                                                                                        actual: actualOutput,
                                                                                        passed: actualOutput === expectedOutput
                                                                                    });
                                                                                }
                                                                            } else {
                                                                                results.push({
                                                                                    input: tc.input,
                                                                                    expected: tc.expectedOutput.trim(),
                                                                                    actual: data.message || "Unknown execution error",
                                                                                    passed: false
                                                                                });
                                                                            }
                                                                        }
                                                                        setExecutionResults(results);
                                                                    } catch (error) {
                                                                        console.error("Executor Error:", error);
                                                                        setToast({ type: 'error', text: 'Execution failed: ' + error.message });
                                                                    } finally {
                                                                        setIsRunning(false);
                                                                    }
                                                                }}
                                                                disabled={isRunning}
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                {isRunning ? 'Running...' : <><Play size={14} className="mr-2" /> Run Code</>}
                                                            </Button>
                                                        </div>
                                                        <Editor
                                                            height="100%"
                                                            language={language}
                                                            value={code}
                                                            onChange={(value) => setCode(value)}
                                                            theme="vs-dark"
                                                            options={{
                                                                minimap: { enabled: false },
                                                                fontSize: 14,
                                                                padding: { top: 16 },
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* THEORY Task - File Upload */}
                                            {activeTask.taskType === 'THEORY' && (
                                                <div className="max-w-3xl mx-auto space-y-6">
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-2">{activeTask.title}</h2>
                                                        <Badge variant="outline" className="gap-1 mb-4">
                                                            <FileText className="h-3 w-3" /> Theory Assignment
                                                        </Badge>
                                                        <div className="prose dark:prose-invert max-w-none bg-muted/30 p-6 rounded-lg">
                                                            <p className="whitespace-pre-wrap">{activeTask.description}</p>
                                                        </div>
                                                    </div>

                                                    {theorySubmission ? (
                                                        <Card>
                                                            <CardContent className="pt-6 space-y-4">
                                                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                                                    <div>
                                                                        <h4 className="font-semibold">Submission Status</h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Submitted on {new Date(theorySubmission.submittedAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <Badge variant={theorySubmission.status === 'PASS' ? 'success' : theorySubmission.status === 'FAIL' ? 'destructive' : 'secondary'}>
                                                                        {theorySubmission.status}
                                                                    </Badge>
                                                                </div>

                                                                {theorySubmission.status !== 'PENDING' && (
                                                                    <div className="space-y-3 p-4 border rounded-lg">
                                                                        <h4 className="font-semibold">Teacher Review</h4>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm text-muted-foreground">Score:</span>
                                                                            <span className="text-2xl font-bold">{theorySubmission.percentage}%</span>
                                                                        </div>
                                                                        {theorySubmission.feedback && (
                                                                            <div>
                                                                                <span className="text-sm font-medium">Feedback:</span>
                                                                                <p className="text-sm text-muted-foreground mt-1">{theorySubmission.feedback}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <Button variant="outline" className="w-full">
                                                                    <Download className="w-4 h-4 mr-2" />
                                                                    Download Your Submission
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        <Card>
                                                            <CardContent className="pt-6">
                                                                <h3 className="font-semibold mb-4">Submit Your Assignment</h3>
                                                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx,.txt"
                                                                        onChange={(e) => setTheoryFile(e.target.files[0])}
                                                                        className="block w-full text-sm text-slate-500
                                                                          file:mr-4 file:py-2 file:px-4
                                                                          file:rounded-full file:border-0
                                                                          file:text-sm file:font-semibold
                                                                          file:bg-primary file:text-primary-foreground
                                                                          hover:file:bg-primary/90"
                                                                    />
                                                                    <p className="text-xs text-muted-foreground mt-2">
                                                                        Accepted formats: PDF, DOC, DOCX, TXT (Max 10MB)
                                                                    </p>
                                                                    {theoryFile && (
                                                                        <p className="text-sm text-green-600 mt-2">
                                                                            Selected: {theoryFile.name}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    className="w-full mt-4"
                                                                    disabled={!theoryFile || isSubmitting}
                                                                    onClick={async () => {
                                                                        if (!theoryFile) return;
                                                                        setIsSubmitting(true);
                                                                        try {
                                                                            const formData = new FormData();
                                                                            formData.append('file', theoryFile);
                                                                            const res = await theoryAPI.submitTheory(activeTask.id, formData);
                                                                            setTheorySubmission(res.data);
                                                                            showToast('success', 'Assignment submitted successfully!');
                                                                        } catch (error) {
                                                                            setToast({ type: 'error', text: error.response?.data?.message || 'Failed to upload file' });
                                                                        } finally {
                                                                            setIsSubmitting(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {isSubmitting ? 'Uploading...' : 'Upload Assignment'}
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </div>
                                            )}

                                            {/* MCQ Task */}
                                            {activeTask.taskType === 'MCQ' && (
                                                <div className="max-w-3xl mx-auto space-y-6">
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-2">{activeTask.title}</h2>
                                                        <Badge variant="outline" className="gap-1 mb-4">
                                                            <CheckCircle className="h-3 w-3" /> Multiple Choice Quiz
                                                        </Badge>
                                                        <div className="prose dark:prose-invert max-w-none bg-muted/30 p-6 rounded-lg mb-6">
                                                            <p className="whitespace-pre-wrap">{activeTask.description}</p>
                                                        </div>
                                                    </div>

                                                    {mcqSubmission ? (
                                                        <Card className={mcqSubmission.passed ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}>
                                                            <CardContent className="pt-6">
                                                                <div className="text-center space-y-4">
                                                                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${mcqSubmission.passed ? 'bg-green-500' : 'bg-red-500'}`}>
                                                                        {mcqSubmission.passed ? <CheckCircle className="w-8 h-8 text-white" /> : <X className="w-8 h-8 text-white" />}
                                                                    </div>
                                                                    <h3 className="text-2xl font-bold">{mcqSubmission.passed ? 'Passed!' : 'Not Passed'}</h3>
                                                                    <div className="text-4xl font-bold">{mcqSubmission.percentage}%</div>
                                                                    <p className="text-muted-foreground">
                                                                        You got {mcqSubmission.correctAnswers} out of {mcqSubmission.totalQuestions} questions correct
                                                                    </p>
                                                                    <div className="flex items-center justify-center gap-4 text-sm">
                                                                        <Badge variant="outline">
                                                                            Attempt {mcqSubmission.attemptNumber} of 2
                                                                        </Badge>
                                                                        {mcqSubmission.remainingAttempts > 0 && (
                                                                            <Badge variant="secondary">
                                                                                {mcqSubmission.remainingAttempts} attempt{mcqSubmission.remainingAttempts > 1 ? 's' : ''} remaining
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Pass threshold: 60%
                                                                    </p>
                                                                    {mcqSubmission.attemptNumber < 2 && !mcqSubmission.passed && (
                                                                        <Button
                                                                            variant="outline"
                                                                            className="mt-4"
                                                                            onClick={() => {
                                                                                setMcqSubmission(null);
                                                                                setMcqAnswers({});
                                                                            }}
                                                                        >
                                                                            Try Again
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        <Card>
                                                            <CardContent className="pt-6 space-y-6">
                                                                {activeTask.mcqQuestions && activeTask.mcqQuestions.map((question, idx) => (
                                                                    <div key={idx} className="space-y-3 p-4 border rounded-lg">
                                                                        <h4 className="font-semibold">Question {idx + 1}</h4>
                                                                        <p className="text-sm">{question.question}</p>
                                                                        <div className="space-y-2">
                                                                            {['A', 'B', 'C', 'D'].map(option => (
                                                                                <label key={option} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`question-${question.id}`}
                                                                                        value={option}
                                                                                        checked={mcqAnswers[question.id] === option}
                                                                                        onChange={() => setMcqAnswers({ ...mcqAnswers, [question.id]: option })}
                                                                                        className="w-4 h-4"
                                                                                    />
                                                                                    <span className="text-sm">
                                                                                        <strong>{option}.</strong> {question[`option${option}`]}
                                                                                    </span>
                                                                                </label>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <Button
                                                                    className="w-full"
                                                                    disabled={isSubmitting || Object.keys(mcqAnswers).length !== (activeTask.mcqQuestions?.length || 0)}
                                                                    onClick={async () => {
                                                                        setIsSubmitting(true);
                                                                        try {
                                                                            // Convert answers object to JSON string
                                                                            // Backend expects: {"questionId":"answer", ...}
                                                                            const answersJson = JSON.stringify(mcqAnswers);

                                                                            const res = await mcqAPI.submitMcq({
                                                                                taskId: activeTask.id,
                                                                                answers: answersJson
                                                                            });
                                                                            setMcqSubmission(res.data);

                                                                            if (res.data.passed) {
                                                                                setTasks(prev => prev.map(t =>
                                                                                    t.id === activeTask.id ? { ...t, completed: true } : t
                                                                                ));
                                                                                setActiveTask(prev => ({ ...prev, completed: true }));
                                                                            }

                                                                            setToast({ type: 'success', text: 'Quiz submitted successfully!' });
                                                                            setTimeout(() => setToast(null), 3000);
                                                                        } catch (error) {
                                                                            setToast({ type: 'error', text: error.response?.data?.message || 'Failed to submit quiz' });
                                                                        } finally {
                                                                            setIsSubmitting(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                                                </Button>
                                                                {Object.keys(mcqAnswers).length !== (activeTask.mcqQuestions?.length || 0) && (
                                                                    <p className="text-xs text-center text-muted-foreground">
                                                                        Please answer all questions before submitting
                                                                    </p>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold mb-4">Course Assignments</h3>
                                            {tasks.length === 0 ? (
                                                <p className="text-muted-foreground">No tasks assigned for this course yet.</p>
                                            ) : (
                                                <div className="grid gap-4">
                                                    {tasks.map((task) => (
                                                        <Card key={task.id} className="p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => selectTask(task)}>
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <h4 className="font-bold text-lg flex items-center gap-2">
                                                                        <Code size={18} className="text-primary" />
                                                                        {task.title}
                                                                    </h4>
                                                                    <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{task.description}</p>
                                                                </div>
                                                                {task.completed ? (
                                                                    <Badge className="bg-green-600 text-white shrink-0">
                                                                        <CheckCircle className="w-3 h-3 mr-1" /> Completed
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="secondary" className="shrink-0">
                                                                        Solve Challenge <ChevronRight size={14} className="ml-1" />
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'resources' && (
                                <div className="text-center py-12 text-muted-foreground min-h-[300px] flex flex-col items-center justify-center">
                                    <Download className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>No resources attached to this {activeTask ? 'task' : 'lesson'}.</p>
                                </div>
                            )}
                            {activeTab === 'q&a' && (
                                <div className="py-6 min-h-[300px]">
                                    <h3 className="text-lg font-bold mb-4">Questions & Answers</h3>
                                    <div className="text-center py-12 text-muted-foreground">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No questions yet. Be the first to ask!</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'notes' && (
                                <div className="py-6 min-h-[300px]">
                                    <h3 className="text-lg font-bold mb-4">My Notes</h3>
                                    <div className="text-center py-12 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>You haven't added any notes for this lesson yet.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AnimatePresence mode='wait'>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed lg:absolute inset-y-0 right-0 w-full lg:w-96 bg-background border-l shadow-2xl z-40 flex flex-col"
                    >
                        <div className="p-4 border-b bg-muted/30">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Course Content</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            {progress && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                                        <span>{Math.round(progress.progressPercentage)}% Completed</span>
                                        <span>{progress.completedLessons}/{progress.totalLessons} Lessons</span>
                                    </div>
                                    <Progress value={progress.progressPercentage} className="h-2" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {(() => {
                                const sortedLessons = [...lessons].sort((a, b) =>
                                    ((a.dayNumber || 1) - (b.dayNumber || 1)) || (a.lessonOrder - b.lessonOrder)
                                );
                                const days = {};
                                lessons.forEach(l => {
                                    const d = l.dayNumber || 1;
                                    if (!days[d]) days[d] = { lessons: [], tasks: [] };
                                    days[d].lessons.push(l);
                                });
                                tasks.forEach(t => {
                                    const d = t.dayNumber || 1;
                                    if (!days[d]) days[d] = { lessons: [], tasks: [] };
                                    days[d].tasks.push(t);
                                });
                                if (Object.keys(days).length === 0) {
                                    return <div className="p-8 text-center text-muted-foreground text-sm">No content available yet.</div>;
                                }
                                return Object.keys(days).sort((a, b) => a - b).map(dayNum => (
                                    <div key={dayNum}>
                                        <div className="sticky top-0 z-10 p-3 py-2 text-xs font-bold text-primary bg-primary/5 uppercase tracking-wider border-y border-border/50 backdrop-blur-md">
                                            Day {dayNum} Content
                                        </div>
                                        {days[dayNum].lessons.sort((a, b) => a.lessonOrder - b.lessonOrder).map((lesson) => {
                                            const currentDay = progress?.currentDay || 1;
                                            const daysElapsed = progress?.daysElapsed || 1000; // Default to unlocked if missing (backwards compat)
                                            const isLocked = (user?.role === 'TEACHER' || user?.role === 'ADMIN') ? false :
                                                (lesson.dayNumber > currentDay || lesson.dayNumber > daysElapsed);
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    disabled={isLocked}
                                                    onClick={() => !isLocked && selectLesson(lesson)}
                                                    className={cn(
                                                        "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-border/50 hover:bg-muted/50",
                                                        currentLesson?.id === lesson.id && "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary",
                                                        isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                                    )}
                                                >
                                                    <div className="mt-0.5">
                                                        {completedLessons.has(lesson.id) ? (
                                                            <CheckCircle className="h-5 w-5 text-green-500 fill-green-500/10" />
                                                        ) : isLocked ? (
                                                            <Lock className="h-5 w-5 text-muted-foreground" />
                                                        ) : currentLesson?.id === lesson.id ? (
                                                            <PlayCircle className="h-5 w-5 text-primary fill-primary/10" />
                                                        ) : (
                                                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                                                                {lesson.lessonOrder}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            "text-sm font-medium leading-none mb-1.5 truncate",
                                                            currentLesson?.id === lesson.id ? "text-primary" : "text-foreground"
                                                        )}>
                                                            {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Play className="h-3 w-3" />
                                                            <span>Video Lesson</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {days[dayNum].tasks.map((task) => {
                                            const currentDay = progress?.currentDay || 1;
                                            const daysElapsed = progress?.daysElapsed || 1000;
                                            const isTaskLocked = (user?.role === 'TEACHER' || user?.role === 'ADMIN') ? false :
                                                (task.dayNumber > currentDay || task.dayNumber > daysElapsed);

                                            // Determine icon based on task type
                                            const getTaskIcon = () => {
                                                if (task.completed) {
                                                    return <CheckCircle className="h-5 w-5 text-green-500 fill-green-500/10" />;
                                                }
                                                if (isTaskLocked) {
                                                    return <Lock className="h-5 w-5 text-muted-foreground" />;
                                                }

                                                const isActive = activeTask?.id === task.id;
                                                const iconClass = isActive ? "h-5 w-5 text-primary fill-primary/10" : "h-5 w-5 text-muted-foreground";

                                                if (task.taskType === 'MCQ') {
                                                    return <CheckCircle className={iconClass} />;
                                                } else if (task.taskType === 'THEORY') {
                                                    return <FileText className={iconClass} />;
                                                } else {
                                                    return <Code className={iconClass} />;
                                                }
                                            };

                                            const getTaskTypeLabel = () => {
                                                if (task.taskType === 'MCQ') return 'MCQ Quiz';
                                                if (task.taskType === 'THEORY') return 'Theory';
                                                return 'Coding';
                                            };

                                            return (
                                                <button
                                                    key={task.id}
                                                    disabled={isTaskLocked}
                                                    onClick={() => !isTaskLocked && selectTask(task)}
                                                    className={cn(
                                                        "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-border/50 hover:bg-muted/50",
                                                        activeTask?.id === task.id && "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary",
                                                        isTaskLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                                    )}
                                                >
                                                    <div className="mt-0.5">
                                                        {getTaskIcon()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            "text-sm font-medium leading-none mb-1.5 truncate",
                                                            activeTask?.id === task.id ? "text-primary" : "text-foreground"
                                                        )}>
                                                            {task.title}
                                                        </p>
                                                        <div className="text-xs text-muted-foreground">{getTaskTypeLabel()}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ));
                            })()}
                        </div>
                        {progress?.progressPercentage === 100 && (
                            <div className="p-4 bg-green-500/10 border-t border-green-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-700 dark:text-green-400">Course Completed!</h4>
                                        <p className="text-xs text-green-600 dark:text-green-500 mb-2">
                                            Congratulations! You've finished this course.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full border-green-500/30 text-green-600 hover:bg-green-500/10"
                                            onClick={handleClaimCertificate}
                                        >
                                            Claim Certificate
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>
            {!sidebarOpen && (
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 z-50 rounded-full shadow-xl lg:hidden h-14 w-14"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
};
export default CourseLearning;
