export const sbuData = {
  domains: [
    {
      id: "d1",
      title: "1. Överensstämmelse",
      subtitle: "Mellan filosofisk hållning/teori och urval och metodik",
      questions: [
        {
          id: "sbu_1_1",
          text: "Hänger syfte och fråga ihop med teori/filosofisk hållning?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m3"
        }
      ]
    },
    {
      id: "d2",
      title: "2. Deltagare",
      subtitle: "Hur gjordes urvalet?",
      questions: [
        {
          id: "sbu_2_1",
          text: "Är urvalet lämpligt för att besvara frågan?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m1"
        },
        {
          id: "sbu_2_2",
          text: "Är rekryteringsmetoden lämpligt vald och genomförd?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m1"
        },
        {
          id: "sbu_2_3",
          text: "Finns det allvarliga brister i urvalet som kan påverka tillförlitligheten?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m1"
        }
      ]
    },
    {
      id: "d3",
      title: "3. Datainsamling",
      subtitle: "Vilka metoder användes för datainsamling?",
      questions: [
        {
          id: "sbu_3_1",
          text: "Finns det allvarliga brister i datainsamlingen som kan påverka tillförlitligheten?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m2"
        }
      ]
    },
    {
      id: "d4",
      title: "4. Analys",
      subtitle: "Vilka metoder användes för analys?",
      questions: [
        {
          id: "sbu_4_1",
          text: "Är vald analysmetod lämplig och genomförd på ett lämpligt sätt?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m3"
        },
        {
          id: "sbu_4_2",
          text: "Var forskarna reflexiva vid tolkning av data?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m3"
        },
        {
          id: "sbu_4_3",
          text: "Validerades tolkningarna?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m4"
        },
        {
          id: "sbu_4_4",
          text: "Finns det allvarliga brister i analysen som kan påverka tillförlitligheten?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m3"
        }
      ]
    },
    {
      id: "d5",
      title: "5. Forskaren",
      subtitle: "Vilken bakgrund och kompetens hade forskarna?",
      questions: [
        {
          id: "sbu_5_1",
          text: "Har forskarna någon relation till studiedeltagarna som kan påverka datainsamlingen?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m4"
        },
        {
          id: "sbu_5_2",
          text: "Har forskarna hanterat sin förförståelse på ett acceptabelt sätt?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m4"
        },
        {
          id: "sbu_5_3",
          text: "Var forskarna oberoende av finansiella eller andra förutsättningar som kunde påverka analysen?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m4"
        },
        {
          id: "sbu_5_4",
          text: "Finns det allvarliga brister hos forskaren som kan påverka tillförlitligheten?",
          options: ["Ja", "Nej", "Oklart"],
          evidenceRef: "m4"
        }
      ]
    }
  ],
  finalAppraisal: {
    id: "final",
    title: "Sammanvägd bedömning av metodologiska brister",
    options: [
      "Obetydliga eller mindre",
      "Måttliga",
      "Stora brister, studien ingår inte i syntesen"
    ]
  }
};
