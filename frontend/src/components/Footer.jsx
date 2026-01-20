import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Github, Linkedin, Mail, Heart, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const Footer = () => {
    return (
        <footer className="relative border-t bg-background/50 backdrop-blur-xl z-20">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 pointer-events-none" />
            <div className="container relative py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                LearnHub
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Empowering learners worldwide to achieve their dreams through accessible,
                            high-quality education from industry experts.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {[Twitter, Github, Linkedin].map((Icon, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                >
                                    <Icon className="h-5 w-5" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {[
                                { to: "/courses", label: "Browse Courses" },
                                { to: "/become-teacher", label: "Become a Teacher" },
                                { to: "/register", label: "Student Signup" },
                                { to: "/login", label: "Partner Login" }
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4">
                            {[
                                { to: "#", label: "Help Center" },
                                { to: "#", label: "Terms of Service" },
                                { to: "#", label: "Privacy Policy" },
                                { to: "#", label: "Cookie Settings" }
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground">
                            Join our newsletter for the latest updates, course discounts, and exclusive offers.
                        </p>
                        <div className="space-y-3">
                            <div className="flex gap-2 relative">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-background/50 border-white/20 focus:border-primary/50 pr-12 rounded-xl h-11"
                                />
                                <Button size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90">
                                    <Send className="h-4 w-4 text-white" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                By subscribing, you agree to our Privacy Policy and consent to receive updates.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LearnHub Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 px-4 py-2 rounded-full">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>for better education</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
