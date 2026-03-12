import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => [
  { title: "Quiddity | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
      console.log({ resumeUrl, imageUrl, feedback: data.feedback });
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0 bg-[#050505] min-h-screen">
      {/* Navigation */}
      <nav className="resume-nav border-b border-[#a855f7]/20 hover:border-[#a855f7] hover:shadow-[0_0_20px_#a855f7] transition-all duration-300">
        <Link
          to="/"
          className="back-button flex items-center gap-2 !bg-transparent border border-[#a855f7]/30 hover:border-[#a855f7] hover:shadow-[0_0_15px_#a855f7] transition-all duration-300 rounded-lg p-2"
        >
          <img
            src="/icons/back.svg"
            alt="logo"
            className="w-2.5 h-2.5 invert brightness-200"
          />
          <span className="text-gray-200 text-sm font-semibold tracking-wide">
            Back to Homepage
          </span>
        </Link>
      </nav>

      {/* Two-column layout with sticky left preview */}
      <div className="flex max-w-7xl mx-auto px-4 py-6 gap-8">
        {/* Left sidebar – sticky resume preview */}
        <aside className="w-80 flex-shrink-0 sticky top-40 left-10 self-start">
          {imageUrl && resumeUrl ? (
            <div className="gradient-border hover:border-[#a855f7] hover:shadow-[0_0_20px_#a855f7] transition-all duration-500 rounded-2xl overflow-hidden">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-auto object-contain"
                  title="resume"
                />
              </a>
            </div>
          ) : (
            <div className="h-40 bg-[#1a1a2a] rounded-2xl border border-[#a855f7]/30 flex items-center justify-center text-gray-400">
              Loading preview...
            </div>
          )}
          <p className="text-gray-400 text-sm mt-4 text-center tracking-wide">
            Click image to open PDF
          </p>
        </aside>

        {/* Right content – review sections (scrolls with page) */}
        <section className="flex-1">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899] mb-6 tracking-tight">
            Resume Review
          </h2>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src="/images/resume-scan-2.gif"
                className="w-full max-w-md rounded-2xl border border-[#a855f7]/30"
              />
            </div>
          )}

          <div className="flex justify-center mt-10">
            <Link
              to={`/resume/${id}/improve`}
              className="primary-button inline-block w-auto px-8 py-3 text-center !bg-transparent border-none relative overflow-hidden group"
            >
              <span className="relative z-10 font-semibold text-white tracking-wide">
                Improve Resume with AI
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;