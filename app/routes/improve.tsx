import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { extractResumeText } from "~/lib/extractResumeText";
import ATS from "~/components/ATS";
import ImprovedResumePDF from "~/components/ImprovedResumePDF";

export const meta = () => [
  { title: "Quiddity | Improve Resume" },
  { name: "description", content: "AI powered resume wording improvement" },
];

const Improve = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { auth, isLoading, fs, kv, ai } = usePuterStore();

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState("");
  const [improvedResume, setImprovedResume] = useState("");

  // auth protection
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}/improve`);
    }
  }, [isLoading]);

  // load feedback from KV
  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      setFeedback(data.feedback);
      console.log("Loaded feedback:", data.feedback);
    };

    loadResume();
  }, [id]);

  // Improve resume using AI
  useEffect(() => {
    if (!feedback) return;

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

        // extract text from PDF
        const resumeText = await extractResumeText(pdfBlob);

        const atsScore = feedback?.ATS?.score || 0;
        const atsTips = feedback?.ATS?.tips || [];

        const prompt = `You are a professional resume writer and ATS (Applicant Tracking System) optimization expert.

Your job is to improve the resume below to maximize ATS compatibility and recruiter readability while preserving all factual information.

The output must strictly follow the provided LaTeX template.

---

PRIMARY OBJECTIVE

Improve the resume to maximize ATS score by:

• Adding strong industry buzzwords
• Improving bullet point wording
• Using powerful action verbs
• Making achievements measurable when numbers already exist
• Highlighting technical skills clearly
• Optimizing phrasing for ATS keyword scanning

ATS optimization is the most important goal.

---

STRICT RULES

DO NOT:
• invent fake projects
• invent achievements
• modify education facts
• change company names
• change dates
• change contact information
• use - instead of --
• use special characters , for example do not use & use \\& instead
ONLY improve:
• wording
• bullet points
• skill descriptions
• project descriptions
• respond under 6500 characters 

---

ATS FEEDBACK

ATS Score:
${feedback?.ATS?.score}

ATS Improvement Tips:
${feedback?.ATS?.tips?.map((tip:any)=>`- ${tip}`).join("\\\\n")}

Use these tips while improving the resume.

---

ATS KEYWORDS / BUZZWORDS

Where appropriate, incorporate relevant technical buzzwords such as:

• problem solving
• algorithm design
• data structures
• software development
• performance optimization
• debugging
• scalable systems
• clean code
• version control
• collaborative development
• software engineering principles
• competitive programming
• system design fundamentals

Only use keywords where they naturally fit.

---

WRITING STYLE RULES

Each bullet point should:

• start with a strong action verb
• highlight impact or technical implementation
• emphasize problem solving or system design
• remain concise (1–2 lines max)

Examples of strong verbs:

Developed
Engineered
Designed
Implemented
Optimized
Built
Automated
Enhanced
Architected
Analyzed

---

OUTPUT FORMAT REQUIREMENTS

Return ONLY valid LaTeX code.

DO NOT:
• include markdown any mark down
• include explanations
• include code fences
• include comments
• close all the {} braces
• do not include the template details in the output. use resume text attached as the text source.
• if git hub or linked or email is not found do not include it.

The output must begin with:

\\\\documentclass[a4paper,10pt]{article}

The output must end with:

\\\\end{document}

---

LATEX TEMPLATE

You MUST preserve this exact structure and formatting.

\\documentclass[a4paper,10pt]{article}

\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}

\\geometry{left=0.7in, top=0.7in, right=0.7in, bottom=0.7in}

\\pagestyle{fancy}
\\fancyhf{}
\\rfoot{\\thepage}

\\titleformat{\\section}{\\large\\scshape\\raggedright}{}{0em}{}[\\titlerule]

% Custom Commands
\\newcommand{\\resumeItem}[1]{
\\item #1
}

\\newcommand{\\resumeSubheading}[4]{
\\vspace{2pt}
\\textbf{#1} \\hfill #2 \\\\
\\textit{#3} \\hfill \\textit{#4}
\\vspace{-4pt}
}

\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\textbf{Arin Gupta}} \\\\
    \\vspace{2pt}
    Phone: +91-9343717006 \\quad
    Email: \\href{mailto:reliablearin@gmail.com}{reliablearin@gmail.com} \\\\ \\vspace{2pt}
    \\href{https://linkedin.com/in/your-profile}{LinkedIn} \\quad
    \\href{https://github.com/your-username}{GitHub}
\\end{center}

%----------EDUCATION----------
\\section{Education}

\\resumeSubheading
{International Institute of Professional Studies (IIPS-DAVV)}{Indore, India}
{Integrated BCA-MCA --- CGPA: 7.12}{2024--2029}

\\resumeSubheading
{Higher Secondary Education}{Indore, India}
{Class XII --- 78.4\\%}{2023}

\\resumeSubheading
{Secondary Education}{Indore, India}
{Class X --- 84.4\\%}{2021}

%----------SKILLS----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=*]
\\item \\textbf{Languages:} C, C++, Java, Python, JavaScript
\\item \\textbf{Frameworks:} Node.js, Express.js
\\item \\textbf{Databases:} PostgreSQL, MySQL
\\item \\textbf{Core CS:} Data Structures, Algorithms, Object-Oriented Programming
\\item \\textbf{Tools:} Git, VS Code
\\item \\textbf{Concepts:} Servers, Cloud Infrastructure Basics
\\end{itemize}

%----------PROJECTS----------
\\section{Projects}

\\textbf{AI Resume Analyzer}
\\begin{itemize}[leftmargin=*, noitemsep]
\\resumeItem{Engineered an AI-powered resume analysis tool to assess ATS compatibility and generate actionable improvement recommendations.}
\\resumeItem{Delivers targeted improvement suggestions to boost ATS pass rates and recruiter engagement.}
\\end{itemize}

\\textbf{Exercise Rep Counter (Squats \\& Pushups)}
\\begin{itemize}[leftmargin=*, noitemsep]
\\resumeItem{Designed and implemented an application that automatically counts workout repetitions to help users monitor exercise performance.}
\\end{itemize}

\\textbf{Discipline Building App}
\\begin{itemize}[leftmargin=*, noitemsep]
\\resumeItem{Built a productivity-focused application using TypeScript to help users maintain consistent habits and discipline.}
\\end{itemize}

\\textbf{Employee Salary Calculator}
\\begin{itemize}[leftmargin=*, noitemsep]
\\resumeItem{Implemented a salary calculator that computes daily wages and enforces stacked leave policies using local storage for privacy.}
\\end{itemize}

%----------ACHIEVEMENTS----------
\\section{Achievements}
\\begin{itemize}[leftmargin=*]
\\resumeItem{Selected for National Cadet Corps (NCC) National Camp as a college senior, achieving a perfect selection score.}
\\resumeItem{Competed in 3 hackathons; advanced to Round 2 in two events.}
\\resumeItem{Awarded winner in the Blind Coding Competition at Chameli Devi Institute.}
\\resumeItem{Cleared NDA written exam; shortlisted for SSB interview.}
\\end{itemize}

\\end{document}

---

Resume Content Extracted From PDF:

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
        setImprovedResume(
          "Something went wrong while improving the resume."
        );
        setLoading(false);
      }
    };

    improveResume();
  }, [id, feedback]);

    return (
    <main className="!pt-0 bg-[#050505] min-h-screen">
      {/* Navigation */}
      <nav className="resume-nav border-b border-[#a855f7]/20 hover:border-[#a855f7] hover:shadow-[0_0_20px_#a855f7] transition-all duration-300">
        <Link
          to={`/`}
          className="back-button flex items-center gap-2 !bg-transparent border border-[#a855f7]/30 hover:border-[#a855f7] hover:shadow-[0_0_15px_#a855f7] transition-all duration-300 rounded-lg p-2"
        >
          <img
            src="/icons/back.svg"
            alt="logo"
            className="w-2.5 h-2.5 invert brightness-200"
          />
          <span className="text-gray-200 text-sm font-semibold tracking-wide">
            Back to home
          </span>
        </Link>
      </nav>

      {/* Main content – full width, large preview */}
      <div className="w-full px-4 md:px-8 py-8">
        <section className="feedback-section no-glow relative overflow-hidden">
          
          
          <div className="flex items-center gap-3 mb-6">
            
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899] tracking-tight">
              Improved Resume
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <img
                src="/images/resume-scan-2.gif"
                className="w-full max-w-2xl rounded-2xl border border-[#a855f7]/30"
              />
            </div>
          ) : (
            <>
              {/* AI generated badge with icon */}
              <div className="flex items-center gap-2 mb-4 text-gray-300 border border-[#a855f7]/30 rounded-full px-4 py-1 w-fit bg-[#0a0a0f]">
                
                <span className="text-sm">Enhanced with AI....</span>
              </div>

              {/* Improved resume content – now larger */}
              {improvedResume && (
                <div className="mt-2 w-full">
                  <ImprovedResumePDF content={improvedResume} />
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