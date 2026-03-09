import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useRef, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
    resume: { id, companyName, jobTitle, feedback, imagePath, resumePath },
    onDelete,
}: {
    resume: Resume;
    onDelete?: (id: string) => void;
}) => {
    const { fs, kv } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState("");
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            setResumeUrl(url);
        };
        loadResume();
    }, [imagePath]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowDeleteMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const startLongPress = () => {
        longPressTimer.current = setTimeout(() => {
            setShowDeleteMenu(true);
        }, 600);
    };

    const cancelLongPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(true);
        try {
            if (imagePath) await fs.delete(imagePath).catch(() => {});
            if (resumePath) await fs.delete(resumePath).catch(() => {});
            await kv.delete(`resume:${id}`);
            onDelete?.(id);
        } catch (err) {
            console.error("Failed to delete resume:", err);
        } finally {
            setIsDeleting(false);
            setShowDeleteMenu(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <Link
                to={showDeleteMenu ? "#" : `/resume/${id}`}
                onClick={(e) => showDeleteMenu && e.preventDefault()}
                className={`resume-card animate-in fade-in duration-1000 select-none ${
                    isDeleting ? "opacity-40 pointer-events-none" : ""
                }`}
                onMouseDown={startLongPress}
                onMouseUp={cancelLongPress}
                onMouseLeave={cancelLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={cancelLongPress}
                onTouchMove={cancelLongPress}
            >
                <div className="resume-card-header">
                    <div className="flex flex-col gap-2">
                        {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                        {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                        {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                    </div>
                    <div className="flex-shrink-0">
                        <ScoreCircle score={feedback.overallScore} />
                    </div>
                </div>
                {resumeUrl && (
                    <div className="gradient-border animate-in fade-in duration-1000">
                        <div className="w-full h-full">
                            <img
                                src={resumeUrl}
                                alt="resume"
                                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                            />
                        </div>
                    </div>
                )}
            </Link>

            {showDeleteMenu && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/60 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 mx-4">
                        <p className="font-semibold text-gray-800 text-center">Delete this resume?</p>
                        <p className="text-sm text-gray-500 text-center">
                            {companyName || "This resume"} — {jobTitle}
                        </p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={(e) => { e.preventDefault(); setShowDeleteMenu(false); }}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeCard;