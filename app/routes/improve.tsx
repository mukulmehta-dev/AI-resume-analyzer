import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { extractResumeText } from "~/lib/extractResumeText";
import ATS from "~/components/ATS";
import ImprovedResumePDF from "~/components/ImprovedResumePDF";


export const meta = () => ([
  { title: "Resumind | Improve Resume" },
  { name: "description", content: "AI powered resume wording improvement" },
]);

const Improve = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { auth, isLoading, fs, kv, ai } = usePuterStore();

  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState("");
  const [improvedResume, setImprovedResume] = useState("");

  // auth protection
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}/improve`);
    }
  }, [isLoading]);
      useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            setFeedback(data.feedback);
            console.log({ feedback: data.feedback });
        }

        loadResume();
    }, [id]);

  useEffect(() => {

    const improveResume = async () => {

      try {

        const resume = await kv.get(`resume:${id}`);
        if (!resume) return;

        const data = JSON.parse(resume);

        // read resume file
        const resumeBlob = await fs.read(data.resumePath);
        if (!resumeBlob) return;

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });

        const url = URL.createObjectURL(pdfBlob);
        setResumeUrl(url);

        // STEP 3: extract text from pdf
        const resumeText = await extractResumeText(pdfBlob);
        <ATS score={feedback?.ATS.score || 0} suggestions={feedback?.ATS.tips || []} />

        // STEP 4: send to AI
        const prompt = `
You are a professional resume writer and ATS optimization expert.

Rewrite and improve the following resume while preserving all factual information.

Return ONLY valid HTML with embedded CSS.
Do not include explanations or markdown.
Wrap the resume inside <div class="resume">.

ATS Feedback:
Score: ${feedback}

Improvement Tips:
${feedback?.ATS?.tips}

Rules:
- Do NOT invent achievements.
- Do NOT change education or experience facts.
- Improve wording using strong action verbs.
- Convert responsibilities into achievement-focused bullet points.
- Quantify results if numbers already exist.
- Keep the resume concise and ATS-friendly.

Formatting instructions:
- Return ONLY valid HTML with embedded CSS.
- Do NOT include explanations or markdown.
- The resume must be a clean one-page layout.
- Use professional typography.
- Use clear sections: Header, Summary, Skills, Experience, Projects, Education.
- Use bullet points for achievements.

HTML structure requirements:
- Use a container div with class "resume"
- Section titles should be <h2>
- Bullet points must use <ul><li>
- Contact information should appear under the name.
- Use Inline styling

if it extends till page 2 format it accordingly for correct spacial allignment

Name
Contact
Summary
Skills/Competencies (bullet list)
Projects (bullet list)
Experience (bullet list)
Education

Example structure:
<div class="resume">
  
  <h1>NAME</h1>
  <p>Email | Phone | LinkedIn</p>

  <h2>Summary</h2>
  <p>...</p>
<hr/>
  <h2>Skills</h2>
  <ul>
    <li>...</li>
  </ul>
<hr/>
  <h2>Experience</h2>
  <ul>
    <li>...</li>
  </ul>
<hr/>
</div>

Resume:
${resumeText}
`;



const response = await ai.chat(prompt);

console.log("AI RESPONSE:", response);

const improvedText =
  (response as any)?.message?.content ??
  "AI failed to generate resume.";

setImprovedResume(improvedText);
setLoading(false);
      } catch (error) {
        console.error("Improve resume error:", error);
        setImprovedResume("Something went wrong while improving the resume.");
        setLoading(false);
      }
    };

    improveResume();

  }, [id]);

  return (
    <main className="!pt-0">

      <nav className="resume-nav">
        <Link to={`/`} className="back-button">
          <img src="/icons/back.svg" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to home
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col">

        {/* Resume Preview */}
       <section className="feedback-section">

  <h2 className="text-4xl !text-black font-bold mb-6">
    Improved Resume
  </h2>

  {loading ? (
    <img src="/images/resume-scan-2.gif" className="w-full" />
  ) : (
    <>
       <div 
      className="whitespace-pre-wrap"
    />
      {/* DOWNLOAD BUTTON */}
      {!loading && improvedResume && (
        <div className="mt-6">
          <ImprovedResumePDF content={improvedResume}></ImprovedResumePDF>
        </div>
      )}
    </>
  )}

</section>

      </div>

    </main>
  );
};

export default Improve;