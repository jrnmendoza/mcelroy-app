export const mcelroy2023 = {
  id: "mcelroy-2023",
  title: "Psychological Safety and Hierarchy in Operating Room Debriefing: Reflexive Thematic Analysis",
  authors: "McElroy et al.",
  year: 2023,
  citation: "McElroy, C., Skegg, E., Mudgway, M., Murray, N., Holmes, L., Weller, J., & Hamill, J. (2023). Psychological Safety and Hierarchy in Operating Room Debriefing: Reflexive Thematic Analysis. Journal of Surgical Research, 295, 567-573.",
  
  // Stage 1: Study Snapshot
  snapshot: {
    aim: "Syftet var att få insikter från personal på golvet om hur man skapar en effektiv rutin för debriefing på operationssalen, utforska deras erfarenheter och kritiskt reflektera över debriefingens betydelse för psykologisk trygghet, hierarki och teamarbete.",
    setting: "Operationssalen på ett barnsjukhus (framförallt barnkirurgi och ÖNH).",
    participants: "40 anställda (14 sjuksköterskor, 7 anestesisjuksköterskor/tekniker, 7 anestesiläkare, 12 kirurger). Studenter och tillfälliga besökare exkluderades.",
    design: "Kvalitativ studie med semistrukturerade intervjuer. Reflexiv tematisk analys inom ramen för kritisk realism.",
  },

  // Stage 2: Methods Detective
  methods: [
    {
      id: "m1",
      fact: "Deltagarna valdes ut genom 'purposive sampling' (ändamålsenligt urval) för att få en spridning av yrken och specialiteter.",
      implication: "Säkerställer att flera olika perspektiv i operationsteamet (sjuksköterskor, läkare) belyses.",
      reference: "Methods, s. 568"
    },
    {
      id: "m2",
      fact: "Intervjuerna genomfördes av två forskare (C.M. och E.S.) och spelades in ljudmässigt i ett enskilt rum.",
      implication: "Bidrar till datakvalitet genom att deltagarna kan tala ostört och att inget utelämnas från transkriberingen.",
      reference: "Methods, s. 568"
    },
    {
      id: "m3",
      fact: "Deltagarna fick läsa och godkänna sina transkriberade intervjuer (dock gjordes ingen formell 'member-checking' av själva temana).",
      implication: "Stärker trovärdigheten i rådatan, även om tolkningen av temana gjordes av forskarna.",
      reference: "Methods & Limitations, s. 568, 572"
    }
  ],

  // Stage 3: Theme Match
  themes: [
    {
      id: "t1",
      name: "Committed to learning (Engagemang för lärande)",
      description: "Sjukvårdspersonal vill lära sig och förbättra verksamheten. Debriefing ses som ett verktyg för både individuellt lärande och organisatorisk förändring."
    },
    {
      id: "t2",
      name: "It is a safe space (Det är ett tryggt rum)",
      description: "Psykologisk trygghet är en förutsättning för debriefing, men skapas också genom debriefing. Det krävs en miljö fri från dömande för att platta ut hierarkier."
    },
    {
      id: "t3",
      name: "Natural leader (Naturlig ledare)",
      description: "Olika åsikter fanns om vem som ska leda debriefingen (kirurg, narkosläkare, sjuksköterska eller den med bäst ledaregenskaper). Visar på existerande maktstrukturer."
    }
  ],

  themeMatches: [
    {
      id: "tm1",
      evidence: "'Is there anything that we can learn from this... what can we do better next time so that we can avoid this situation?'",
      correctThemeId: "t1",
      explanation: "Visar ett tydligt fokus på att använda debriefing för att identifiera förbättringsmöjligheter och lära sig av misstag.",
      reference: "Results, s. 569"
    },
    {
      id: "tm2",
      evidence: "'I think that starts from before the brief... having an expectation that there's a flattened hierarchy, we would welcome people speaking up...'",
      correctThemeId: "t2",
      explanation: "Betonar vikten av att bygga en kultur där alla vågar tala, vilket är kärnan i psykologisk trygghet.",
      reference: "Results, s. 569"
    },
    {
      id: "tm3",
      evidence: "Vissa ansåg att en 'senior doctor' alltid borde leda, medan andra tyckte sjuksköterskan som koordinerar listan var bäst lämpad för ett mer inkluderande tillvägagångssätt.",
      correctThemeId: "t3",
      explanation: "Belyser hur synen på ledarskap i debriefingen är starkt kopplad till professionella roller och hierarkier.",
      reference: "Results, s. 569-571"
    }
  ],

  // Stage 4: SBU Challenge
  sbuDomains: [
    {
      id: "sbu1",
      title: "1. Teori och syfte",
      question: "Hänger syfte och fråga ihop med teori/filosofisk hållning?",
      evidence: "Studien utgår från en 'critical realism paradigm' och använder reflexiv tematisk analys. Syftet är att förstå personalens upplevelser av hierarki och psykologisk trygghet.",
      reference: "Methods, s. 568"
    },
    {
      id: "sbu2",
      title: "2. Deltagare",
      question: "Är urvalet och rekryteringsmetoden lämpliga utan allvarliga brister som påverkar tillförlitligheten?",
      evidence: "Purposive sampling användes för att få 40 deltagare från olika professioner (läkare, ssk). Frivilligt deltagande kan introducera 'sampling bias' enligt författarna.",
      reference: "Methods & Limitations, s. 568, 572"
    },
    {
      id: "sbu3",
      title: "3. Datainsamling",
      question: "Finns det allvarliga brister i datainsamlingen som kan påverka tillförlitligheten?",
      evidence: "Semistrukturerade intervjuer, ljudinspelade och ordagrant transkriberade. Genomförda privat.",
      reference: "Methods, s. 568"
    },
    {
      id: "sbu4",
      title: "4. Analys",
      question: "Är analysmetoden (reflexiv tematisk analys) lämplig och genomförd på ett acceptabelt sätt?",
      evidence: "Två forskare kodade separat och möttes regelbundet för att diskutera. Följde Braun & Clarkes riktlinjer (15-punkts checklista användes). 'Member-checking' användes dock ej.",
      reference: "Methods, s. 568"
    },
    {
      id: "sbu5",
      title: "5. Forskaren",
      question: "Har forskarna hanterat sin förförståelse och relation till deltagarna acceptabelt?",
      evidence: "Forskarna var från samma sjukhus. Intervjuarna tränades av en 'kulturell expert' och senior forskare. Studien är finansierad av sjukhusets stiftelse.",
      reference: "Methods & Funding, s. 568, 572"
    }
  ],
  
  sbuOptions: [
    { value: "ja", label: "Ja" },
    { value: "nej", label: "Nej" },
    { value: "oklart", label: "Oklart" }
  ],

  // Stage 5: Final Appraisal
  finalAppraisalOptions: [
    { value: "obetydliga", label: "Obetydliga eller mindre brister" },
    { value: "mattliga", label: "Måttliga brister" },
    { value: "stora", label: "Stora brister (studien ingår ej i syntes)" }
  ]
};
