import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-gray-200 text-xl animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg p-4">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
                {/* User info card */}
                <div className="mb-8 p-4 border border-[#a855f7]/30 rounded-xl bg-[#0a0a0f] shadow-[0_0_15px_#a8557f]/20">
                    <p className="text-lg">
                        <span className="text-gray-400">Authenticated as:</span>{" "}
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#3b82f6]">
                            {auth.user?.username}
                        </span>
                    </p>
                </div>

                {/* Files section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899]">
                        Existing Files
                    </h2>
                    {files.length === 0 ? (
                        <p className="text-gray-400 italic border border-[#a855f7]/20 rounded-lg p-4 bg-[#0a0a0f]">
                            No files found.
                        </p>
                    ) : (
                        <div className="grid gap-3">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center p-3 border border-[#a855f7]/30 rounded-lg bg-[#0f0f17] hover:border-[#a855f7] hover:shadow-[0_0_10px_#a855f7] transition-all duration-200"
                                >
                                    <span className="text-gray-300 truncate flex-1">{file.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {new Date(file.modified).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Wipe button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleDelete}
                        className="primary-button inline-block px-8 py-3 text-center !bg-transparent border-none relative overflow-hidden group"
                    >
                        <span className="relative z-10 font-semibold text-white tracking-wide">
                            Wipe App Data
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></span>
                    </button>
                </div>

                {/* Warning note */}
                <p className="mt-6 text-center text-sm text-gray-500 border-t border-[#a855f7]/20 pt-4">
                    ⚠️ This action will permanently delete all your resume files and data.
                </p>
            </div>
        </main>
    );
};

export default WipeApp;