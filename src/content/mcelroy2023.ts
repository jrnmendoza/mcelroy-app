export const STUDY_CONTENT = {
  background: {
    title: "Bakgrund och syfte",
    content: `Kirurgi är en högriskverksamhet där yrkesgrupper från olika specialiteter arbetar tillsammans under tidskritiska operationer där säkerhet är av största vikt. I likhet med team inom flyg och motorsport kan kirurgiska team beskrivas som handlingsinriktade team (action teams). Det som skiljer kirurgiska team är mångfalden av roller inom gruppen: sjuksköterskor, anestesiläkare, tekniker och kirurger, från studenter till seniorer.

För att fungera effektivt måste teammedlemmarna känna sig trygga (psychological safety) med att dela observationer och åsikter med resten av teamet. Mångfacetterade kirurgiska team drabbas dock ofta av rivalitet mellan olika grupper baserat på profession, kön och anciennitet. Den maktobalans som uppstår hindrar effektivt lagarbete. 

Ett sätt att motverka problemet med hierarki inom kirurgin kan vara regelbunden team-debriefing. Syftet med studien var att "få insikter från medarbetare i frontlinjen om hur man utformar en effektiv policy för debriefing för vår operationsavdelning, att utforska operationspersonalens erfarenheter av debriefing, och att kritiskt reflektera över vad debriefing betyder för psykologisk trygghet, hierarki och lagarbete."`,
    reference: "McElroy et al., Introduction, s. 567-568"
  },
  methods: {
    title: "Metod",
    content: `**Design & Paradigm:**
Studien var en kvalitativ studie som använde reflexiv tematisk analys (RTA) enligt Braun och Clarke, och genomfördes utifrån en kritisk-realistisk forskningsansats (critical realism paradigm).

**Kontext:**
Studien genomfördes på en operationsavdelning för barn vid ett tertiärsjukhus på Nya Zeeland.

**Deltagare:**
Ett strategiskt urval (purposive sampling) resulterade i 40 intervjuer med operationspersonal:
- 14 Sjuksköterskor
- 7 Anestesiläkare
- 7 Anestesisjuksköterskor/tekniker
- 12 Kirurger
25 (65%) av de intervjuade var kvinnor.

**Datainsamling & Analys:**
Två forskare utförde semistrukturerade intervjuer (efter träning från en oberoende kulturexpert) mellan dec 2021 och feb 2022. Intervjuerna ljudspelades in på en mobil enhet och transkriberades ordagrant (verbatim). Deltagarna fick godkänna sin transkribering. Kodning och temautveckling var rekursiva processer som innebar fördjupning i data och djup reflektion. Två forskare kodade data separat och träffades regelbundet för att diskutera och forma teman. Kvaliteten vägleddes av Braun & Clarkes checklistor och Nelson's conceptual depth scale.`,
    reference: "McElroy et al., Materials and Methods, s. 568"
  },
  results: {
    title: "Resultat",
    content: `Forskarna utvecklade tre huvudteman som var relevanta för psykologisk trygghet och hierarki:

**1. Committed to learning (Engagemang för lärande)**
Ett starkt tema var hur engagerade frontlinjepersonalen är för inlärning och kvalitetsförbättring. Inlärning sågs som en av de viktigaste sakerna inom hälso- och sjukvård, och debriefing sågs som ett verktyg för detta, både för individen, teamet och hela organisationen. Om debriefing inte ledde till kvalitetsförbättringar sågs den som ett slöseri med tid ("Groundhog Day").

**2. It is a safe space (Det är ett tryggt rum)**
Betydelsen av psykologisk trygghet i teamet var ett starkt tema genomgående. Psykologisk trygghet främjades av debriefing och var samtidigt en förutsättning för effektiv debriefing. Intervjupersonerna ansåg att en konsekvent debriefing skulle underlätta bättre kommunikation, bidra till att platta till hierarkin och skapa en mer inkluderande arbetsmiljö. Positiv feedback ansågs vara ett effektivt sätt att uppmuntra till att våga tala ("speak up").

**3. Natural leader (Naturlig ledare)**
Tanken på att det skulle finnas en "naturlig" ledare var ett tema, även om åsikterna gick isär om vem eller vad denna ledare skulle vara. Många ansåg att seniora läkare (kirurgen eller anestesiläkaren) var huvudledarna, medan andra ansåg att sjuksköterskor (som koordinerar operationslistan) var bäst lämpade. En del menade att vem som helst med rätt kompetens kunde leda. Temat belyser hur idén om en "naturlig ledare" ibland kan förstärka hierarkiska strukturer.`,
    reference: "McElroy et al., Results, s. 568-569"
  }
};

export const SBU_DOMAINS = [
  {
    id: "domain-1",
    title: "1. Överensstämmelse mellan filosofisk hållning/teori och urval och metodik",
    questions: [
      {
        id: "q1_1",
        text: "Hänger syfte och fråga ihop med teori/filosofisk hållning?",
        article_evidence: {
          reported: "Syftet var att få insikter från medarbetare om debriefing, utforska erfarenheter och reflektera kring psykologisk trygghet och hierarki. De utgick från ett 'critical realism paradigm' och använde Reflexiv Tematisk Analys (RTA).",
          reference: "McElroy et al., Materials and Methods, s. 568",
          extraContext: "Författarna använde 'critical realism' som söker förklara mekanismer i sociala sammanhang. Syftet att undersöka erfarenheter och utforma policys stämmer väl överens med en reflexiv tematisk analys (RTA)."
        },
        options: ["Ja", "Nej", "Oklart"]
      }
    ]
  },
  {
    id: "domain-2",
    title: "2. Deltagare",
    questions: [
      {
        id: "q2_1",
        text: "Är urvalet lämpligt för att besvara frågan?",
        article_evidence: {
          reported: "40 operationsmedarbetare intervjuades: sjuksköterskor (14), anestesitekniker (7), anestesiläkare (7) och kirurger (12). Urvalet var strategiskt (purposive) för att fånga en rad olika professioner.",
          reference: "McElroy et al., Materials and Methods, s. 568 & Table 1",
          extraContext: "Urvalet var strategiskt för att säkerställa att erfarenheter från flera yrkesgrupper som deltar i operationer hördes, vilket passar syftet om team-debriefing."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q2_2",
        text: "Är rekryteringsmetoden lämpligt vald och genomförd?",
        article_evidence: {
          reported: "Personalen gjordes medveten om projektet på möten. Två forskare rekryterade aktivt deltagare att medverka. Skriftligt samtycke inhämtades.",
          reference: "McElroy et al., Materials and Methods, s. 568",
          extraContext: "Rekryteringen skedde 'in the moment' när personal var tillgänglig på sjukhuset."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q2_3",
        text: "Finns det allvarliga brister som kan påverka tillförlitligheten?",
        options: ["Ja", "Nej", "Oklart"]
      }
    ]
  },
  {
    id: "domain-3",
    title: "3. Datainsamling",
    questions: [
      {
        id: "q3_1",
        text: "Finns det allvarliga brister i datainsamlingen som kan påverka tillförlitligheten?",
        article_evidence: {
          reported: "Datainsamlingen var semistrukturerade intervjuer i avskilda rum, ljudinspelade och transkriberade ordagrant. Intervjuerna varade i 10-20 minuter och leddes med öppna frågor där informanten fick prata fritt.",
          reference: "McElroy et al., Materials and Methods, s. 568",
          extraContext: "10-20 minuter kan vara kort för kvalitativa djupintervjuer, men acceptabelt i en stressig sjukhusmiljö."
        },
        options: ["Ja", "Nej", "Oklart"]
      }
    ]
  },
  {
    id: "domain-4",
    title: "4. Analys",
    questions: [
      {
        id: "q4_1",
        text: "Är vald analysmetod lämplig och genomförd på ett lämpligt sätt?",
        article_evidence: {
          reported: "Forskarna använde Braun och Clarkes metod för reflexiv tematisk analys (RTA). Kodning gjordes oberoende av två forskare (C.M. och J.H.) som därefter träffades för att forma teman. Tre teman utvecklades.",
          reference: "McElroy et al., Materials and Methods, s. 568",
          extraContext: "Att två forskare kodar oberoende och sedan diskuterar för att forma gemensamma teman är en god metodologisk praxis inom RTA för att stärka trovärdigheten."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q4_2",
        text: "Var forskarna reflexiva vid tolkning av data?",
        article_evidence: {
          reported: "De uppger att de använde RTA och 'djup reflektion'. De redovisar dock inte detaljerat hur deras egna yrkesroller i gruppen inverkade på tolkningen av datan (t.ex. att överläkare intervjuar sjuksköterskor).",
          reference: "McElroy et al., Materials and Methods & Limitations, s. 568, 572",
          extraContext: "Författarna nämner i limitations att deltagarna var från en enda avdelning, men problematiserar inte maktpositionen mellan intervjuare och respondent i sin analys."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q4_3",
        text: "Validerades tolkningarna?",
        article_evidence: {
          reported: "Deltagarna fick kopior av sina transkriberingar för godkännande. Formell 'member-checking' (validering av temana med intervjupersonerna) gjordes dock inte, vilket forskarna själva anger som en limitation.",
          reference: "McElroy et al., Limitations, s. 572",
          extraContext: "De validerade rådatan (transkriptionerna), men inte den slutgiltiga analysen (temana)."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q4_4",
        text: "Finns det allvarliga brister i analysen som kan påverka tillförlitligheten?",
        options: ["Ja", "Nej", "Oklart"]
      }
    ]
  },
  {
    id: "domain-5",
    title: "5. Forskaren",
    questions: [
      {
        id: "q5_1",
        text: "Har forskarna någon relation till studiedeltagarna som kan påverka datainsamlingen?",
        article_evidence: {
          reported: "Författarna (inklusive kirurger och annan personal) arbetade på samma institution (Starship Children's Hospital). Detta kan påverka frivilligheten och maktdynamiken i intervjusituationen.",
          reference: "McElroy et al., Affiliations & Methods, s. 567",
          extraContext: "Närhet till deltagarna kan underlätta rekrytering men också skapa partiskhet (bias) där deltagarna svarar det de tror att forskaren/kollegan vill höra."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q5_2",
        text: "Har forskarna hanterat sin förförståelse på ett acceptabelt sätt?",
        article_evidence: {
          reported: "Två forskare (C.M. och E.S.) fick träningssessioner av en oberoende kulturexpert inför intervjuerna för att hantera detta, och de uppger ett reflexivt förhållningssätt. Dock är informationen kortfattad.",
          reference: "McElroy et al., Materials and Methods, s. 568",
          extraContext: "Det är oklart i hur stor utsträckning kulturexpertens träning hjälpte till att motverka den hierarkiska förförståelsen på kliniken."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q5_3",
        text: "Var forskarna oberoende av finansiella eller andra förutsättningar som kunde påverka analysen?",
        article_evidence: {
          reported: "Forskningen var stöttad av The Starship Foundation. Författarna deklarerar 'None declared' under Disclosure (jäv).",
          reference: "McElroy et al., Disclosure & Funding, s. 572",
          extraContext: "Stiftelsen bakom sjukhuset stod för finansieringen. Inga andra intressekonflikter anges."
        },
        options: ["Ja", "Nej", "Oklart"]
      },
      {
        id: "q5_4",
        text: "Finns det allvarliga brister som kan påverka tillförlitligheten?",
        options: ["Ja", "Nej", "Oklart"]
      }
    ]
  }
];
