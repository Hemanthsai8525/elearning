import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, BookOpen, Users, Award, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
const BecomeTeacher = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background">
            <div className="container py-6">
                <Button
                    variant="ghost"
                    className="mb-4 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
            </div>
            <section className="relative py-20 overflow-hidden bg-primary/5">
                <div className="container relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Inspire the Next Generation
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join our community of expert instructors and share your knowledge with millions of students around the world.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" onClick={() => window.location.href = 'mailto:hr@learnhub.com'}>
                            <Mail className="mr-2 h-5 w-5" />
                            Apply via Email
                        </Button>
                        <Link to="/courses">
                            <Button variant="outline" size="lg">
                                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="py-20">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">How to Apply</h2>
                        <div className="grid gap-8">
                            <Card className="border-l-4 border-l-primary">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        1. Prepare Your Portfolio
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Gather your resume, certificates, and examples of your teaching experience or subject matter expertise.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-primary">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        2. Send an Email
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Email us at <strong className="text-foreground">hr@learnhub.com</strong> with the subject line
                                        "Instructor Application - [Your Name]".
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-primary">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        3. Review & Verification
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Our trusted Admin team will review your credentials. This process ensures only qualified professionals join our faculty.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-primary">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        4. Get Your Credentials
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Once approved, the Admin will create your specialized Teacher Account and send you the login details.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default BecomeTeacher;
