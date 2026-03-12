import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractResumeText = async (blob: Blob): Promise<string> => {

  const arrayBuffer = await blob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const items = textContent.items
      .filter((item: any) => item.str && item.str.trim() !== "")
      .map((item: any) => ({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5]
        
      }));

    // Sort by vertical position then horizontal
    items.sort((a, b) => {
      const yDiff = b.y - a.y;
      if (Math.abs(yDiff) > 5) return yDiff;
      return a.x - b.x;
    });

    let currentY: number | null = null;
    let line = "";
    const lines: string[] = [];

    for (const item of items) {

      if (currentY === null) currentY = item.y;

      if (Math.abs(item.y - (currentY||0)) > 5) {
        lines.push(line.trim());
        line = "";
        currentY = item.y;
      }

      line += item.text + " ";
    }

    if (line.trim()) lines.push(line.trim());

    fullText += lines.join("\n") + "\n";
    console.log("Page:", pageNum);
  console.log("Items count:", textContent.items.length);
  }

  // Clean formatting
  fullText = fullText
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();

  return fullText;
};