import { useEffect, useState } from 'react';
import { certificateAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Award, Download, Share2, CheckCircle, ExternalLink, Calendar, Hash, Eye, X, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
const Certificates = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);
    useEffect(() => {
        fetchCertificates();
    }, []);
    const fetchCertificates = async () => {
        try {
            const response = await certificateAPI.getMyCertificates();
            setCertificates(response.data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };
    const copyVerificationLink = (code) => {
        const link = `${window.location.origin}/verify-certificate/${code}`;
        navigator.clipboard.writeText(link);
        alert('Link copied!');
    };
    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-muted/5 py-12">
            <div className="container max-w-6xl">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:pl-2 transition-all"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                        <Award size={40} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Your Achievements</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Showcase your success. View, download, and share your verified certificates with the world.
                    </p>
                </div>
                {certificates.length === 0 ? (
                    <div className="bg-card rounded-2xl p-12 text-center border shadow-sm max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award size={32} className="text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No certificates earned yet</h2>
                        <p className="text-muted-foreground mb-8">Complete a course to earn your first certificate of accomplishment.</p>
                        <Button onClick={() => window.location.href = '/courses'} size="lg">
                            Explore Courses
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Award className="text-primary/20 h-24 w-24 transform rotate-12" />
                                </div>
                                <div className="p-8 relative">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold mb-6 border border-green-200">
                                        <CheckCircle size={12} /> VERIFIED
                                    </div>
                                    <div className="mb-8">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Certificate of Completion</p>
                                        <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                            {cert.courseTitle}
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-4 border-t border-border">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">ISSUED DATE</p>
                                            <p className="font-medium">
                                                {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground mb-1">ID</p>
                                            <p className="font-mono text-xs font-bold bg-muted px-2 py-1 rounded">
                                                {cert.certificateCode.substring(0, 8)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-muted/30 p-4 flex gap-3 border-t">
                                    <Button
                                        variant="default"
                                        className="flex-1"
                                        onClick={() => setSelectedCert(cert)}
                                    >
                                        <Eye size={16} className="mr-2" /> View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => copyVerificationLink(cert.certificateCode)}
                                        title="Copy Link"
                                    >
                                        <Share2 size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <AnimatePresence>
                {selectedCert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-4xl bg-white shadow-2xl rounded-sm overflow-hidden my-8"
                        >
                            <div className="bg-zinc-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 no-print">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Award size={18} className="text-yellow-500" />
                                    Certificate Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => window.print()}>
                                        <Printer size={16} className="mr-2" /> Print
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSelectedCert(null)}>
                                        <X size={20} />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-8 md:p-16 bg-white text-center relative selection:bg-yellow-100 selection:text-yellow-900 print:p-0">
                                <div className="absolute inset-8 border-4 border-double border-slate-200 pointer-events-none"></div>
                                <div className="absolute inset-10 border border-slate-300 pointer-events-none"></div>
                                <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-yellow-600 rounded-tl-3xl opacity-20"></div>
                                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-yellow-600 rounded-br-3xl opacity-20"></div>
                                <div className="relative py-12 px-6">
                                    <div className="flex justify-center mb-10">
                                        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
                                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                                                <Award size={22} />
                                            </div>
                                            LearnHub
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Certificate of Completion</h4>
                                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 italic">
                                        This is to certify that
                                    </h1>
                                    <div className="relative inline-block mb-8 min-w-[300px]">
                                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 pb-4 border-b-2 border-slate-300 font-serif">
                                            {selectedCert.studentName}
                                        </h2>
                                    </div>
                                    <p className="text-xl text-slate-600 mb-6 font-serif italic">
                                        has successfully completed the course
                                    </p>
                                    <h3 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-12 max-w-2xl mx-auto leading-tight">
                                        {selectedCert.courseTitle}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-2xl mx-auto pt-12">
                                        <div className="text-center">
                                            <div className="h-16 flex items-end justify-center pb-2">
                                                <img src="https://via.placeholder.com/150x50/000/fff?text=Signature" alt="Signature" className="h-12" />
                                            </div>
                                            <div className="border-t border-slate-300 pt-2">
                                                <p className="font-bold text-slate-900">Dr. Sarah Wilson</p>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Head of Education</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h-16 flex items-end justify-center pb-2">
                                                <p className="font-serif text-lg">
                                                    {new Date(selectedCert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="border-t border-slate-300 pt-2">
                                                <p className="font-bold text-slate-900">Date Issued</p>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Official Date</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-20 right-20 hidden md:block opacity-80">
                                        <div className="w-24 h-24 rounded-full border-4 border-yellow-600/30 flex items-center justify-center p-1">
                                            <div className="w-full h-full rounded-full border-2 border-dotted border-yellow-600/50 flex items-center justify-center bg-yellow-50/50 text-yellow-700/50">
                                                <div className="text-[10px] font-bold uppercase tracking-widest rotate-[-15deg] text-center">
                                                    Official<br />Seal
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-16 text-center">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                                            Certificate ID: {selectedCert.certificateCode}
                                        </p>
                                        <p className="text-[10px] text-slate-300 mt-2">
                                            Verify authenticity at {window.location.origin}/verify
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .fixed.inset-0, .fixed.inset-0 * {
                            visibility: visible;
                        }
                        .fixed.inset-0 {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background: white;
                            padding: 0;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};
export default Certificates;
