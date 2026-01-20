import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, CheckCircle, Cpu, Wifi } from 'lucide-react';

const CodeLine = ({ line, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.3 }}
            className="flex gap-4 text-sm font-mono leading-relaxed"
        >
            <span className="text-muted-foreground select-none w-6 text-right">{line.num}</span>
            <span dangerouslySetInnerHTML={{ __html: line.html }} />
        </motion.div>
    );
};

const TechDemo = () => {
    const [step, setStep] = useState(0);

    // Simulated code lines with simple syntax highlighting
    const codeLines = [
        { num: 1, html: '<span class="text-purple-400">import</span> { <span class="text-yellow-300">Course</span> } <span class="text-purple-400">from</span> <span class="text-green-300">\'@learnhub/core\'</span>;' },
        { num: 2, html: '' },
        { num: 3, html: '<span class="text-purple-400">const</span> <span class="text-blue-400">startLearning</span> = <span class="text-purple-400">async</span> (<span class="text-orange-300">user</span>) => {' },
        { num: 4, html: '&nbsp;&nbsp;<span class="text-gray-400">// Initialize personalized curriculum</span>' },
        { num: 5, html: '&nbsp;&nbsp;<span class="text-purple-400">const</span> <span class="text-red-300">path</span> = <span class="text-purple-400">await</span> <span class="text-yellow-300">AI</span>.<span class="text-blue-400">generatePath</span>(<span class="text-orange-300">user</span>.<span class="text-blue-300">goals</span>);' },
        { num: 6, html: '' },
        { num: 7, html: '&nbsp;&nbsp;<span class="text-purple-400">if</span> (<span class="text-orange-300">user</span>.<span class="text-blue-300">ready</span>) {' },
        { num: 8, html: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-purple-400">return</span> <span class="text-green-300">&lt;SuccessFuture /&gt;</span>;' },
        { num: 9, html: '&nbsp;&nbsp;}' },
        { num: 10, html: '};' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev < codeLines.length + 3 ? prev + 1 : 0));
        }, 800);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative rounded-xl overflow-hidden bg-[#0f1117] border border-white/10 shadow-2xl font-mono text-sm md:text-base w-full max-w-3xl mx-auto h-[400px] flex flex-col">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-black/20 px-3 py-1 rounded-full">
                    <Cpu className="w-3 h-3" />
                    <span>demo.tsx</span>
                </div>
                <div className="flex gap-3">
                    <Wifi className="w-4 h-4 text-green-500/50" />
                </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-6 overflow-hidden relative">
                <div className="space-y-1">
                    {codeLines.map((line, index) => (
                        <div key={index} className={step > index ? 'opacity-100' : 'opacity-0'}>
                            <div className="flex gap-4 text-sm font-mono leading-relaxed">
                                <span className="text-gray-600 select-none w-6 text-right">{line.num}</span>
                                <span dangerouslySetInnerHTML={{ __html: line.html }} />
                            </div>
                        </div>
                    ))}

                    {/* Blinking Cursor */}
                    {step < codeLines.length && (
                        <motion.div
                            style={{
                                marginTop: `${step * 24}px`,
                                marginLeft: '32px'
                            }}
                            className="w-2 h-5 bg-primary absolute top-6 left-0"
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                    )}
                </div>

                {/* Simulated Terminal Notification */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: step > codeLines.length ? 0 : 100, opacity: step > codeLines.length ? 1 : 0 }}
                    className="absolute bottom-6 right-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg backdrop-blur-sm"
                >
                    <div className="p-1 bg-green-500/20 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-bold text-xs uppercase tracking-wider">Build Successful</div>
                        <div className="text-xs opacity-80">Compiled in 128ms</div>
                    </div>
                </motion.div>
            </div>

            {/* Status Bar */}
            <div className="bg-primary/5 px-4 py-2 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <Terminal className="w-3 h-3" />
                        <span>Ready</span>
                    </div>
                    <div>master*</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Online</span>
                </div>
            </div>
        </div>
    );
};

export default TechDemo;
