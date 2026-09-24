# Content Audit & Implementation Plan

## 1. Inspection & Comparison
- **Current App:** Focused on a synchronous, presenter-led "Kahoot" style experience. Lacks the depth of the McElroy study and only glosses over the SBU appraisal with generic questions.
- **McElroy PDF:** Contains deep methodological details (Reflexive Thematic Analysis, critical realism paradigm, semi-structured interviews of 40 staff). Main themes: "Committed to learning", "It is a safe space", "Natural leader".
- **SBU Form:** A strict qualitative appraisal tool with 5 specific domains (Philosophy/Theory, Participants, Data Collection, Analysis, Researcher) and one overall judgement.

## 2. Missing Content
- **McElroy:** Specifics on paradigm, transcription, coding, and the exact verified findings under the three themes. Page references for evidence.
- **SBU Items:** The precise phrasing of the SBU questions (e.g., "Är urvalet lämpligt för att besvara frågan?", "Var forskarna reflexiva vid tolkning av data?").

## 3. Generic/Inaccurate Content
- The old app used generic "yes/no" or "rate 1-5" questions that didn't align with SBU's "Ja/Nej/Oklart" or "Obetydliga/Måttliga/Stora brister".
- The game show format implied correct/incorrect methodological judgments.

## 4. Information Architecture Redesign
- **Authentication:** Anonymous sign-in on load; progress saved to Supabase `participant_progress`.
- **Navigation:** Self-paced router.
  - `/` -> Start / Continue
  - `/study/background`, `/study/methods`, `/study/results` -> Progressive learning
  - `/interactive/match`, `/interactive/detective` -> Deepen understanding
  - `/appraisal/:domainId` -> SBU domains 1-5
  - `/appraisal/overall` -> Final judgment
  - `/results` -> Asynchronous group aggregation

## 5. Implementation Steps
1. ✅ Drop old synchronous `journal_sessions` schema.
2. ✅ Apply new asynchronous `participant_progress`, `responses`, `overall_appraisal` schema.
3. 🔄 Rewrite React router and state store.
4. 🔄 Implement progressive article reading components with evidence cards.
5. 🔄 Implement interactive learning components (Method detective, Theme match).
6. 🔄 Implement the strict SBU appraisal forms.
7. 🔄 Implement the asynchronous Results dashboard.
