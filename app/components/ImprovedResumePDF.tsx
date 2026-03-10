import html2pdf from "html2pdf.js";

interface Props {
  content: string;
}

const ImprovedResumePDF = ({ content }: Props) => {

  const downloadPDF = () => {
    const element = document.getElementById("resume-html");

    if (!element) return;

    html2pdf()
      .set({
        margin: 0,
        filename: "improved-resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div>
      <style>{`
  #resume-html h1,
  #resume-html h2,
  #resume-html h3 {
    background: transparent !important;
    color: black !important;
    -webkit-text-fill-color: black !important; /* overrides text-gradient */
    background-image: none !important;
  }
`}</style>
      {/* Resume Preview */}
      <div
        id="resume-html"
        dangerouslySetInnerHTML={{ __html: content }}
        className="bg-white p-8 shadow-md max-w-none"
      />
      <style>{`
  #resume-html h1,
  #resume-html h2,
  #resume-html h3 {
    background: transparent !important;
    color: black !important;
    -webkit-text-fill-color: black !important; /* overrides text-gradient */
    background-image: none !important;
  }
`}</style>

      {/* Download Button */}
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