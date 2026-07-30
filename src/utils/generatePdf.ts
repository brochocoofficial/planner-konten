import jsPDF from "jspdf";
import { GeneratedContentResult } from "../types";

export const downloadPdfReport = (result: GeneratedContentResult) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const maxLineWidth = pageWidth - margin * 2;
  let y = 15;

  const checkPageBreak = (neededHeight: number = 8) => {
    if (y + neededHeight > pageHeight - 15) {
      doc.addPage();
      y = 15;
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(56, 189, 248); // sky-400
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("PAKET STRATEGI KONTEN AFFILIATE PRO", margin, 12);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const subInfo = `Produk: ${result.productInfo.productName}  |  Durasi: ${result.productInfo.duration}`;
  doc.text(subInfo, margin, 20);

  y = 34;

  // Helper for Section Title
  const addSectionTitle = (title: string) => {
    checkPageBreak(12);
    doc.setFillColor(224, 242, 254); // sky-100
    doc.rect(margin, y - 4, maxLineWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(3, 105, 161); // sky-700
    doc.text(title, margin + 3, y + 1.5);
    y += 9;
  };

  // Helper for adding lines of text
  const addParagraph = (
    text: string,
    fontStyle: "normal" | "bold" | "italic" = "normal",
    fontSize = 8.5,
    color: [number, number, number] = [30, 41, 59],
    lineGap = 3.8
  ) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(text, maxLineWidth);
    for (const line of lines) {
      checkPageBreak(lineGap);
      doc.text(line, margin, y);
      y += lineGap;
    }
  };

  // 1. KONTEN PILAR
  addSectionTitle("1. KONTEN PILAR STRATEGIS");
  result.contentPillars.forEach((p, idx) => {
    checkPageBreak(10);
    addParagraph(`Pilar ${idx + 1}: ${p.title} (${p.percentage})`, "bold", 9, [14, 116, 144]);
    addParagraph(`Deskripsi: ${p.description}`, "normal", 8.5, [51, 65, 85]);
    addParagraph(`Contoh Tema: ${p.examples.join(", ")}`, "italic", 8, [71, 85, 105]);
    y += 2;
  });

  y += 2;

  // 2. 30 IDE KONTEN
  addSectionTitle("2. 30 IDE KONTEN & SKRIP VIDEO");
  result.contentIdeas.forEach((i) => {
    checkPageBreak(14);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y - 3, maxLineWidth, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`IDE #${i.id}: ${i.title}`, margin + 2, y + 1);
    y += 7;

    addParagraph(`• Pilar: ${i.pillar}  |  Format: ${i.format}  |  Angle: ${i.angle}`, "normal", 8, [71, 85, 105]);
    addParagraph(`• Formula: ${i.formulaUsed || "Standard"}`, "bold", 8, [2, 132, 199]);
    addParagraph(`• Quick Hook (VO): "${i.quickHook}"`, "bold", 8.5, [180, 83, 9]);
    if (i.visualHook) {
      addParagraph(`• Visual Hook (0-2s): ${i.visualHook}`, "italic", 8, [100, 116, 139]);
    }
    addParagraph(`• Ringkasan Konsep: ${i.summary}`, "normal", 8, [51, 65, 85]);

    if (i.videoScript && i.videoScript.length > 0) {
      checkPageBreak(6);
      addParagraph("  Skrip Video Scene demi Scene:", "bold", 8, [30, 41, 59]);
      i.videoScript.forEach((s) => {
        checkPageBreak(10);
        addParagraph(
          `   Scene ${s.sceneNumber} (${s.timeFrame}) [${s.formulaStage || "Scene"}]:`,
          "bold",
          8,
          [14, 116, 144]
        );
        addParagraph(`     Visual: ${s.visual}`, "normal", 7.5, [71, 85, 105]);
        addParagraph(`     Audio (VO): "${s.audio}"`, "italic", 7.5, [15, 23, 42]);
        addParagraph(`     Teks Overlay: "${s.overlayText}"`, "bold", 7.5, [217, 119, 6]);
      });
    }

    y += 3;
  });

  y += 2;

  // 3. HOOK 2 DETIK UTAMA
  addSectionTitle("3. HOOK 2 DETIK PERTAMA UTAMA");
  result.hooks.forEach((h, idx) => {
    checkPageBreak(12);
    addParagraph(`Hook #${idx + 1} (${h.type})`, "bold", 8.5, [14, 116, 144]);
    addParagraph(`Visual Kamera: ${h.visualAction}`, "normal", 8, [51, 65, 85]);
    addParagraph(`Voiceover: "${h.verbalHook}"`, "bold", 8.5, [180, 83, 9]);
    addParagraph(`Alasan Efektif: ${h.whyItWorks}`, "italic", 7.5, [100, 116, 139]);
    y += 2;
  });

  y += 2;

  // 4. HERO VIDEO SCRIPT
  addSectionTitle(`4. SKRIP CERITA VIDEO HERO (${result.videoScript.duration})`);
  addParagraph(`Ringkasan Konsep: ${result.videoScript.conceptSummary}`, "normal", 8.5, [51, 65, 85]);
  addParagraph(`Formula Utama: ${result.videoScript.formulaUsed}`, "bold", 8.5, [2, 132, 199]);
  y += 2;

  result.videoScript.scenes.forEach((s) => {
    checkPageBreak(12);
    addParagraph(`Scene ${s.sceneNumber} (${s.timeFrame}) - ${s.formulaStage}`, "bold", 8.5, [15, 23, 42]);
    addParagraph(`  Visual: ${s.visual}`, "normal", 8, [71, 85, 105]);
    addParagraph(`  Voiceover: "${s.audio}"`, "italic", 8, [180, 83, 9]);
    addParagraph(`  Text Overlay: "${s.overlayText}"`, "bold", 8, [217, 119, 6]);
    if (s.tips) {
      addParagraph(`  Tips: ${s.tips}`, "italic", 7.5, [100, 116, 139]);
    }
    y += 2;
  });

  y += 2;

  // 5. CAPTION, CTA & HASHTAG
  addSectionTitle("5. CAPTION, CTA & HASHTAG AFFILIATE");
  addParagraph(result.captionData.fullText, "normal", 8.5, [30, 41, 59]);

  y += 3;

  // 6. TEKS OVERLAY
  addSectionTitle("6. REKOMENDASI TEKS OVERLAY");
  result.textOverlays.forEach((t) => {
    checkPageBreak(8);
    addParagraph(`Scene ${t.sceneNumber} (${t.timeFrame}): "${t.text}"`, "bold", 8.5, [14, 116, 144]);
    addParagraph(`  Tips Style: ${t.styleTip}`, "italic", 7.5, [100, 116, 139]);
  });

  // Footer / Page numbers
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Halaman ${i} dari ${totalPages}  |  Generated by Affiliate Content Studio`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  const safeFileName = result.productInfo.productName.replace(/[^a-zA-Z0-9]/g, "-") || "Affiliate-Strategy";
  doc.save(`Affiliate-Strategy-${safeFileName}.pdf`);
};
