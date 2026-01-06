import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, paymentAPI, enrollmentAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { CheckCircle, CreditCard, Lock, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
const PaymentCheckout = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await courseAPI.getCoursePreview(courseId);
                setCourse(response.data);
            } catch (err) {
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);
    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        try {
            await paymentAPI.pay(courseId);
            await enrollmentAPI.enroll(courseId);
            navigate(`/payment/success/${courseId}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };
    if (loading) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-96 w-96" /></div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
    return (
        <div className="min-h-screen bg-muted/10 py-12">
            <div className="container max-w-5xl mx-auto px-4">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                                <CardDescription>Review your purchase details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-bold text-2xl">
                                            {course.title.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{course.lessons?.length || 0} Lessons</Badge>
                                            <Badge variant="outline">Lifetime Access</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Original Price</span>
                                        <span className="line-through text-muted-foreground">₹{course.price * 2}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Discount</span>
                                        <span className="text-green-600">-50%</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span>₹{course.price}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/20 text-xs text-muted-foreground flex gap-2">
                                <ShieldCheck size={14} />
                                30-Day Money-Back Guarantee
                            </CardFooter>
                        </Card>
                    </div>
                    <div>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock size={18} className="text-green-600" />
                                    Secure Payment
                                </CardTitle>
                                <CardDescription>Enter your mock payment details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cardholder Name</label>
                                        <input type="text" className="w-full p-2 border rounded-md bg-background" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <input type="text" className="w-full p-2 pl-9 border rounded-md bg-background" placeholder="0000 0000 0000 0000" maxLength="19" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Expiry</label>
                                            <input type="text" className="w-full p-2 border rounded-md bg-background" placeholder="MM/YY" maxLength="5" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">CVC</label>
                                            <input type="text" className="w-full p-2 border rounded-md bg-background" placeholder="123" maxLength="3" required />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                    )}
                                    <Button className="w-full h-12 text-lg mt-4" disabled={processing}>
                                        {processing ? 'Processing...' : `Pay ₹${course.price}`}
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground mt-4">
                                        This is a secure 256-bit SSL encrypted payment.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PaymentCheckout;
