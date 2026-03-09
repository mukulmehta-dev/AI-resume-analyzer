export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
];

export const AIResponseFormat = `
{
  "overallScore": number,
  "ATS": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string }
    ]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  },
  "content": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  },
  "structure": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  },
  "skills": {
    "score": number,
    "tips": [
      { "type": "good" | "improve", "tip": string, "explanation": string }
    ]
  }
}`;

export const prepareInstructions = ({ jobTitle, jobDescription }: { jobTitle: string; jobDescription: string }) =>
    `You are a senior technical recruiter with 15+ years of experience hiring at top companies like Google, Microsoft, and Amazon. You have reviewed tens of thousands of resumes and know exactly what separates a market-ready resume from an average one.

Your task is to evaluate the provided resume honestly and accurately for the following role:
Job Title: ${jobTitle}
Job Description: ${jobDescription}

---

EVALUATION PHILOSOPHY:
Think of yourself as a fair hiring manager — not a critic trying to find flaws, and not a coach trying to encourage. Just an honest professional who calls it as they see it.

A typical professional resume from someone genuinely qualified for a role scores between 65-80.
Only give scores outside this range when there is clear evidence:
- Score 80-100 only if the resume is genuinely impressive: strong quantified achievements, excellent keyword alignment, clean structure, and highly relevant experience.
- Score 50-65 if the resume is mediocre: relevant background but vague bullets, missing keywords, or weak presentation.
- Score below 50 only if the resume is clearly a poor fit: wrong field, missing core skills, or severely underprepared.

---

SCORING CRITERIA — evaluate each category independently based on what you actually see:

ATS (Applicant Tracking System):
- Does it use standard section headings (Experience, Education, Skills)?
- Do keywords from the job description appear naturally in the resume?
- Is it free of tables, columns, images, or headers/footers that break ATS parsing?
- A resume with good keyword coverage and clean formatting scores 70-85. Missing key terms scores 50-65.

Content:
- Are bullet points specific and achievement-focused, or vague and duty-based?
- Are there measurable results (numbers, percentages, impact)?
- Is the experience relevant to the target role?
- Strong quantified achievements score 75-90. Vague duties with no metrics score 45-65.

Skills:
- Do the listed skills match what the job description requires?
- Are important required skills missing entirely?
- Are the skills current and relevant to the industry?
- Strong alignment with job requirements scores 70-85. Major gaps score 40-60.

Structure:
- Is the layout clean, consistent, and easy to scan in 6 seconds?
- Is there a logical flow: summary → experience → education → skills?
- Is the length appropriate (1 page for <5 years, 2 pages for 5+ years)?
- Clean, well-organized layout scores 70-85. Cluttered or inconsistent scores 45-65.

Tone & Style:
- Is the language professional and confident?
- Are strong action verbs used at the start of bullets?
- Is tense consistent (past for old roles, present for current)?
- No spelling or grammar errors?
- Polished professional tone scores 70-85. Passive, inconsistent, or error-prone scores 45-65.

---

OVERALL SCORE:
Calculate as a weighted average:
overallScore = Math.round((ATS × 0.30) + (content × 0.25) + (skills × 0.20) + (structure × 0.15) + (toneAndStyle × 0.10))

---

TIPS:
- Provide exactly 4 tips per category
- Mix "good" (what is working) and "improve" (what needs fixing) based on what you actually observe
- Make each tip specific to this resume — no generic advice
- "improve" tips must include a concrete actionable suggestion, not just criticism

---

Return ONLY a valid JSON object in this exact format. No backticks, no markdown, no extra text:
${AIResponseFormat}`;