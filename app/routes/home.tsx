import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Quiddity" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

export default function Home() {
    const { auth, kv, fs } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [showConfirmAll, setShowConfirmAll] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) navigate("/auth?next=/");
    }, [auth.isAuthenticated]);

    const loadResumes = async () => {
        setLoadingResumes(true);
        const items = (await kv.list("resume:*", true)) as KVItem[];
        const parsed = items?.map((r) => JSON.parse(r.value) as Resume);
        setResumes(parsed || []);
        setLoadingResumes(false);
    };

    useEffect(() => {
        loadResumes();
    }, []);

    const handleSingleDelete = (id: string) => {
        setResumes((prev) => prev.filter((r) => r.id !== id));
    };

    const handleDeleteAll = async () => {
        setIsDeletingAll(true);
        try {
            for (const resume of resumes) {
                if (resume.imagePath) await fs.delete(resume.imagePath).catch(() => {});
                if (resume.resumePath) await fs.delete(resume.resumePath).catch(() => {});
                await kv.delete(`resume:${resume.id}`).catch(() => {});
            }
            setResumes([]);
        } catch (err) {
            console.error("Failed to delete all resumes:", err);
        } finally {
            setIsDeletingAll(false);
            setShowConfirmAll(false);
        }
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-8">
                    <h1>Track Your Resume's Competency</h1>
                    {!loadingResumes && resumes?.length === 0 ? (
                        <h2> Upload your first resume now and get AI-powered Feedback.</h2>
                    ) : (
                        <h2>Review your submissions and check AI-powered feedback.</h2>
                    )}
                </div>

                {loadingResumes && (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                    </div>
                )}

                {!loadingResumes && resumes.length > 0 && (
                    <>
                        <div className="resumes-section">
                            {resumes.map((resume) => (
                                <ResumeCard
                                    key={resume.id}
                                    resume={resume}
                                    onDelete={handleSingleDelete}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center px-4 mt-8 mb-8">
                            <button
                                onClick={() => setShowConfirmAll(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 border border-red-200 text-red-500 font-medium hover:bg-red-100 transition-colors text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                                Delete All Resumes
                            </button>
                        </div>
                    </>
                )}

                {!loadingResumes && resumes?.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                            Upload Resume
                        </Link>
                    </div>
                )}
            </section>

            {showConfirmAll && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 mx-4 max-w-sm w-full">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-800 text-lg">Delete all resumes?</p>
                            <p className="text-sm text-gray-500 mt-1">
                                This will permanently delete all {resumes.length} resume{resumes.length > 1 ? "s" : ""} and their files. This cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setShowConfirmAll(false)}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={isDeletingAll}
                                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                <Link to="/wipe">
                                    Wipe Data
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}