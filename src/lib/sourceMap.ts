export const SOURCE_MAP = {
  aim: {
    journalPage: 568,
    pdfPage: 2
  },
  design: {
    journalPage: 568,
    pdfPage: 2
  },
  recruitment: {
    journalPage: 568,
    pdfPage: 2
  },
  interviews: {
    journalPage: 568,
    pdfPage: 2
  },
  thematicAnalysis: {
    journalPage: 568,
    pdfPage: 2
  },
  learningTheme: {
    journalPage: 569,
    pdfPage: 3
  },
  safeSpaceTheme: {
    journalPage: 569,
    pdfPage: 3
  },
  leaderTheme: {
    journalPage: 569,
    pdfPage: 3
  },
  researcherBias: {
    journalPage: 568, // Mention of independent cultural expert
    pdfPage: 2
  },
  limitations: {
    journalPage: 572,
    pdfPage: 6
  },
  disclosure: {
    journalPage: 572,
    pdfPage: 6
  }
};

export function getPdfPageForJournalPage(journalPage: number): number {
  // Page 1 in PDF = 567 in Journal
  return journalPage - 566;
}
