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
- [ ] T2: Transcribe classes 05–08 with the same checks; commit the work unit.
- [ ] T3: Transcribe classes 09–12 with the same checks; commit the work unit.
- [ ] T4: Transcribe classes 13–16 with the same checks; commit the work unit.
- [ ] T5: Transcribe the project draft and study plan with the same checks; commit the work unit.
- [ ] T6: Add a Markdown reading index and audit all 18 outputs against their sources, then commit the work unit.

## Progress and next step

- Git initialized locally on `feature/pdf-transcriptions`. Source PDFs are untracked; add only intended files to each commit.
- T1 evidence: 54 PDF pages across classes 01–04; all 54 sequential page markers verified. Spot checks of source text/code and native PDF links passed per file (8/8, 6/6, 4/4, 5/5). Captions describe meaningful visuals; decorative headers and images are disclosed. No runnable app or TDD runner applies. Commit: `0008f15`.
- T2 evidence: 48 PDF pages across classes 05–08; all 48 sequential markers verified; PDF hyperlink targets preserved (5/5, 4/4, 4/4, 5/5). Class 06 p. 3 contains two broken glyphs in the printed equation, explicitly marked as illegible. Visuals described per page; no runnable app applies.
- Next: commit T2, then begin T3. Update this document and mirror the entire current content under `odd/pdf-course-transcription/tasks` after each task. Record real check results and commit IDs; never check off work on intent alone.
