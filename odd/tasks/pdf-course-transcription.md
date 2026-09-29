# PDF course transcription

## Objective

Make all 18 source PDFs in `docs/` consultable as faithful, page-referenced Markdown without having to reopen the PDFs for ordinary questions. Keep the originals unchanged. Describe meaningful diagrams, screenshots and charts in text; clearly mark details that cannot be read, rather than guessing.

## Problem and scope

- Sources: `docs/ML CLASE _ 01.pdf` through `docs/ML CLASE _ 16.pdf`, `docs/Preentrega(BORRADOR).pdf`, and `docs/Talento Tech -Machine learning.pdf`.
- Outputs: one `.md` beside each PDF, plus a navigational `docs/README.md`.
- Preserve the source language and substantive content, including links, exercises, tables and formulas where present; cite the PDF filename and page in each output.
- Avoid treating a text-only dump as a complete transcription: include concise descriptions of meaningful visual content and explicitly identify uncertain or illegible details.
- Do not edit the source PDFs, publish a remote repository, or invent educational content.

## Authority and conventions

- User authorized local Git initialization, Markdown transcription, and describing visual content; no remote operation was authorized.
- Route: delegated direct for every transcription batch (multiple non-trivial documents and PDF reading to prepare writes); the parent maintains this document and its Engram mirror.
- TDD: not applicable to document transcription; no test runner/configuration exists. Functional checks: page coverage, nonempty text for source pages, visual annotations, file correspondence and spot checks against PDFs.
- Delivery strategy: `ask-on-risk` if a later pull request is requested; no PR or remote work authorized now. Size heuristic is advisory only. Forecast: 18 substantial Markdown documents, well over 400 authored lines; each coherent batch is one work unit and commit.

## Tasks

- [x] T1: Transcribe classes 01–04 with page references and meaningful visual descriptions; verify page coverage and text samples, then commit the work unit.
- [x] T2: Transcribe classes 05–08 with the same checks; commit the work unit.
- [x] T3: Transcribe classes 09–12 with the same checks; commit the work unit.
- [x] T4: Transcribe classes 13–16 with the same checks; commit the work unit.
- [ ] T5: Transcribe the project draft and study plan with the same checks; commit the work unit.
- [ ] T6: Add a Markdown reading index and audit all 18 outputs against their sources, then commit the work unit.

## Progress and next step

- Git initialized locally on `feature/pdf-transcriptions`. Source PDFs are untracked; add only intended files to each commit.
- T1 evidence: 54 PDF pages across classes 01–04; all 54 sequential page markers verified. Spot checks of source text/code and native PDF links passed per file (8/8, 6/6, 4/4, 5/5). Captions describe meaningful visuals; decorative headers and images are disclosed. No runnable app or TDD runner applies. Commit: `0008f15`.
- T2 evidence: 48 PDF pages across classes 05–08; all 48 sequential markers verified; PDF hyperlink targets preserved (5/5, 4/4, 4/4, 5/5). Class 06 p. 3 contains two broken glyphs in the printed equation, explicitly marked as illegible. Visuals described per page; no runnable app applies. Commit: `6fbc687`.
- T3 evidence: 45 PDF pages across classes 09–12; all 45 sequential markers verified and unique PDF link targets preserved (4/4, 4/4, 2/2, 4/4). Class 11 source repeats «kkk» and mentions an unlinked resource; both are disclosed without correction or invention. Visual diagrams were described; no runnable app applies. Commit: `c94b767`.
- T4 evidence: 37 PDF pages across classes 13–16; all 37 sequential markers verified, and the two native links in class 13 are preserved; classes 14–16 have no native PDF link targets. Source/Markdown text samples matched; minor uncertain lettering in the class 16 visual is explicitly identified. No runnable app applies. Commit: `407486e`.
- T5 evidence: project draft 2/2 pages and study plan 15/15 pages have ordered markers; page-level text was checked and the study plan's image-only resources page 13 was visually transcribed. No native PDF hyperlinks; its page 2 OCR repetition was not duplicated. No runnable app applies.
- Next: commit T5, then begin T6. Update this document and mirror the entire current content under `odd/pdf-course-transcription/tasks` after each task. Record real check results and commit IDs; never check off work on intent alone.
