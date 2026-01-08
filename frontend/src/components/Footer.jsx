import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Button } from './ui/Button';
const Footer = () => {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                LearnHub
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Empowering learners worldwide to achieve their dreams through accessible,
                            high-quality education from industry experts.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6">Platform</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Browse Courses
                                </Link>
                            </li>
                            <li>
                                <Link to="/become-teacher" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Become a Teacher
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Student Signup
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Partner Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Cookie Settings
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold mb-2">Subscribe</h4>
                        <p className="text-sm text-muted-foreground">
                            Join our newsletter for the latest updates and exclusive offers.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <Button>
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2025 LearnHub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                        <span>for better education</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
