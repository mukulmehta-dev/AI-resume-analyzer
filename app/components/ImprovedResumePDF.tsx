import React from "react";

interface Props {
  content: string;
}

const ImprovedResumePDF = ({ content }: Props) => {

  const downloadPDF = () => {

    if (!content) {
      console.error("No LaTeX content provided");
      return;
    }

    const encodedLatex = encodeURIComponent(content);

    const url = `https://latexonline.cc/compile?text=${encodedLatex}`;

    // open compilation directly in new tab
    window.open(url, "_blank");
  };

  return (
    <div>

      <div
        id="resume-html"
        className="bg-white p-8 shadow-md max-w-none overflow-auto"
      >
        <h2>if the link fails, copy the download link and paste it on overleaf.com terminal</h2>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg"
      >
        Download PDF
      </button>

    </div>
  );
};

export default ImprovedResumePDF;