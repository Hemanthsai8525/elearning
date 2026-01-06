import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import confetti from 'canvas-confetti';
const PaymentSuccess = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="min-h-screen bg-muted/10 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="text-center overflow-hidden border-2 border-green-500/20 shadow-2xl">
                    <div className="bg-green-500/10 p-8 flex justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                            <CheckCircle size={48} strokeWidth={3} />
                        </motion.div>
                    </div>
                    <CardContent className="p-8 pt-6 space-y-4">
                        <h1 className="text-3xl font-extrabold text-foreground">Payment Successful!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. You have been successfully enrolled in the course.
                        </p>
                        <div className="bg-muted p-4 rounded-lg my-6 text-sm">
                            <p className="font-semibold mb-1">Transaction ID</p>
                            <p className="font-mono text-muted-foreground">TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => navigate(`/course/${courseId}/learn`)}
                                className="w-full h-12 text-lg gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <BookOpen size={20} />
                                Start Learning Now
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/my-learning')}
                                className="w-full h-12"
                            >
                                Go to My Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
export default PaymentSuccess;
