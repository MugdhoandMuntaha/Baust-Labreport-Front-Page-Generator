"use client";

import { useState, useRef, useCallback } from "react";
import type { FormData, ReportContent } from "./download";

const DEPARTMENTS = [
  "Computer Science and Engineering (CSE)",
  "Electrical and Electronic Engineering (EEE)",
  "Civil Engineering (CE)",
  "Mechanical Engineering (ME)",
  "Textile Engineering (TE)",
  "Industrial and Production Engineering (IPE)",
  "Architecture",
];

const COURSE_PRESETS = [
  { courseNo: "CSE 2201", courseTitle: "Data Structures and Algorithm II" },
  { courseNo: "CSE 2202", courseTitle: "Data Structures and Algorithm II Sessional" },
  { courseNo: "CSE 2203", courseTitle: "Theory of Computation" },
  { courseNo: "CSE 2205", courseTitle: "Database Management Systems" },
  { courseNo: "CSE 2206", courseTitle: "Database Management Systems Sessional" },
  { courseNo: "EEE 2269", courseTitle: "Electrical Drives and Instrumentation" },
  { courseNo: "EEE 2270", courseTitle: "Electrical Drives and Instrumentation Sessional" },
  { courseNo: "HUM 2221", courseTitle: "History of the Emergence of Bangladesh" },
  { courseNo: "MATH 2247", courseTitle: "Laplace Transformation and Fourier Analysis" },
];

const TEACHER_PRESETS = [
  { name: "Md Atiq Shariar", designation: "Lecturer, Dept. of EEE, BAUST" },
  { name: "Roman Raihan", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "Shifa Tasmiah Tisha", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "AKZ Rasel Rahman", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "Md. Osama", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "S. M Golam Rifat", designation: "Lecturer, Dept. of CSE, BAUST" },
];

const INITIAL_FORM: FormData = {
  department: "",
  courseTitle: "",
  courseNo: "",
  experimentNo: "",
  experimentName: "",
  studentName: "",
  studentId: "",
  level: "",
  term: "",
  experimentDate: "",
  submissionDate: "",
  teachers: [{ name: "", designation: "" }],
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

import Link from "next/link";

export default function GeneratorPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState({ pdf: false, png: false, docx: false });
  const [aiLoading, setAiLoading] = useState(false);
  const [reportContent, setReportContent] = useState<ReportContent | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (field: keyof Omit<FormData, "teachers">, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateTeacher = useCallback(
    (index: number, field: "name" | "designation", value: string) => {
      setForm((prev) => {
        const teachers = [...prev.teachers];
        teachers[index] = { ...teachers[index], [field]: value };
        return { ...prev, teachers };
      });
    },
    []
  );

  const addTeacher = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      teachers: [...prev.teachers, { name: "", designation: "" }],
    }));
  }, []);

  const removeTeacher = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((_, i) => i !== index),
    }));
  }, []);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setLoading((l) => ({ ...l, pdf: true }));
    try {
      const { downloadPDF } = await import("./download");
      await downloadPDF(previewRef.current, form);
    } catch (e) {
      console.error(e);
      alert("Error generating PDF.");
    }
    setLoading((l) => ({ ...l, pdf: false }));
  };

  const handleDownloadPNG = async () => {
    if (!previewRef.current) return;
    setLoading((l) => ({ ...l, png: true }));
    try {
      const { downloadPNG } = await import("./download");
      await downloadPNG(previewRef.current, form);
    } catch (e) {
      console.error(e);
      alert("Error generating PNG.");
    }
    setLoading((l) => ({ ...l, png: false }));
  };

  const handleDownloadDOCX = async () => {
    setLoading((l) => ({ ...l, docx: true }));
    try {
      const { downloadDOCX } = await import("./download");
      await downloadDOCX(form, reportContent);
    } catch (e) {
      console.error(e);
      alert("Error generating DOCX.");
    }
    setLoading((l) => ({ ...l, docx: false }));
  };

  const handleGenerateAI = async () => {
    if (!form.experimentName.trim()) {
      alert("Please enter an Experiment Name first.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentName: form.experimentName,
          courseTitle: form.courseTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to generate report.");
      } else {
        setReportContent(data.report);
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
    }
    setAiLoading(false);
  };

  const updateReportField = (field: keyof ReportContent, value: string | string[]) => {
    setReportContent((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <>
      {/* Background Glows */}
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />
      <div className="bg-glow glow-3" />

      <header className="app-header">
        <div className="header-content">
          <Link href="/" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block', fontWeight: 500 }}>
            &larr; Back to Home
          </Link>
          <h1 className="app-title">
            <span className="title-icon">📄</span>
            BAUST Lab Report Generator
          </h1>
          <p className="app-subtitle">
            Generate professional lab report front pages instantly
          </p>
        </div>
      </header>

      <main className="app-container">
        {/* ===== FORM PANEL ===== */}
        <section className="form-panel">
          <div className="panel-header">
            <h2>Fill in Details</h2>
            <p>Enter your lab report information below</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
            {/* Course & Experiment */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">📚</span>
                Course &amp; Experiment
              </h3>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="coursePreset">Quick Select Course</label>
                <select
                  id="coursePreset"
                  value=""
                  onChange={(e) => {
                    const preset = COURSE_PRESETS.find(c => c.courseNo === e.target.value);
                    if (preset) {
                      setForm(prev => ({ ...prev, courseTitle: preset.courseTitle, courseNo: preset.courseNo }));
                    }
                  }}
                >
                  <option value="">— Select a course —</option>
                  {COURSE_PRESETS.map((c) => (
                    <option key={c.courseNo} value={c.courseNo}>
                      {c.courseNo} — {c.courseTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="courseTitle">Course Title</label>
                  <input
                    id="courseTitle"
                    value={form.courseTitle}
                    onChange={(e) => update("courseTitle", e.target.value)}
                    placeholder="e.g. Data Structures Lab"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="courseNo">Course No</label>
                  <input
                    id="courseNo"
                    value={form.courseNo}
                    onChange={(e) => update("courseNo", e.target.value)}
                    placeholder="e.g. CSE 2102"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="experimentNo">Experiment No</label>
                <input
                  id="experimentNo"
                  value={form.experimentNo}
                  onChange={(e) => update("experimentNo", e.target.value)}
                  placeholder="e.g. 01"
                  style={{ maxWidth: "48%" }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="experimentName">Experiment Name</label>
                <input
                  id="experimentName"
                  value={form.experimentName}
                  onChange={(e) => update("experimentName", e.target.value)}
                  placeholder="e.g. Implementation of Stack using Linked List"
                />
              </div>
              <button
                type="button"
                className={`btn-ai-generate${aiLoading ? " loading" : ""}`}
                onClick={handleGenerateAI}
                disabled={aiLoading}
              >
                <span className="ai-sparkle">✨</span>
                {aiLoading ? "AI is writing..." : "Generate Report with AI"}
              </button>
            </div>

            {/* Submitted By */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🎓</span>
                Submitted By
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="studentName">Name</label>
                  <input
                    id="studentName"
                    value={form.studentName}
                    onChange={(e) => update("studentName", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="studentId">ID</label>
                  <input
                    id="studentId"
                    value={form.studentId}
                    onChange={(e) => update("studentId", e.target.value)}
                    placeholder="e.g. 2021334001"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="level">Level</label>
                  <select
                    id="level"
                    value={form.level}
                    onChange={(e) => update("level", e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="1">Level - 1</option>
                    <option value="2">Level - 2</option>
                    <option value="3">Level - 3</option>
                    <option value="4">Level - 4</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="term">Term</label>
                  <select
                    id="term"
                    value={form.term}
                    onChange={(e) => update("term", e.target.value)}
                  >
                    <option value="">Select Term</option>
                    <option value="I">Term - I</option>
                    <option value="II">Term - II</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experimentDate">Date of Experiment</label>
                  <input
                    type="date"
                    id="experimentDate"
                    value={form.experimentDate}
                    onChange={(e) => update("experimentDate", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="submissionDate">Date of Submission</label>
                  <input
                    type="date"
                    id="submissionDate"
                    value={form.submissionDate}
                    onChange={(e) => update("submissionDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submitted To */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">👨‍🏫</span>
                Submitted To
              </h3>
              {form.teachers.map((teacher, i) => (
                <div key={i} className="teacher-entry">
                  <div className="teacher-entry-header">
                    <span className="teacher-number">Teacher {i + 1}</span>
                    {i > 0 && (
                      <button
                        type="button"
                        className="btn-remove-teacher"
                        onClick={() => removeTeacher(i)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Quick Select Teacher</label>
                    <select
                      value=""
                      onChange={(e) => {
                        const preset = TEACHER_PRESETS.find(t => t.name === e.target.value);
                        if (preset) {
                          updateTeacher(i, "name", preset.name);
                          updateTeacher(i, "designation", preset.designation);
                        }
                      }}
                    >
                      <option value="">— Select a teacher —</option>
                      {TEACHER_PRESETS.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name} — {t.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Name of the Teacher</label>
                    <input
                      value={teacher.name}
                      onChange={(e) =>
                        updateTeacher(i, "name", e.target.value)
                      }
                      placeholder="Instructor's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      value={teacher.designation}
                      onChange={(e) =>
                        updateTeacher(i, "designation", e.target.value)
                      }
                      placeholder="e.g. Lecturer, Dept. of CSE, BAUST"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-add-teacher"
                onClick={addTeacher}
              >
                <span>+</span> Add Another Teacher
              </button>
            </div>
          </form>

          {/* AI Generated Report Content */}
          {reportContent && (
            <div className="form-section ai-report-section">
              <h3 className="section-title">
                <span className="section-icon">🤖</span>
                AI-Generated Report Content
              </h3>
              <p className="ai-hint">Edit any section below before downloading.</p>

              <div className="form-group">
                <label>Objectives</label>
                <textarea
                  className="ai-textarea"
                  rows={4}
                  value={Array.isArray(reportContent.objectives) ? reportContent.objectives.join("\n") : reportContent.objectives}
                  onChange={(e) => updateReportField("objectives", e.target.value.split("\n"))}
                />
              </div>

              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  className="ai-textarea"
                  rows={6}
                  value={reportContent.introduction}
                  onChange={(e) => updateReportField("introduction", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Algorithm</label>
                <textarea
                  className="ai-textarea"
                  rows={6}
                  value={Array.isArray(reportContent.algorithm) ? reportContent.algorithm.join("\n") : reportContent.algorithm}
                  onChange={(e) => updateReportField("algorithm", e.target.value.split("\n"))}
                />
              </div>

              <div className="form-group">
                <label>Source Code</label>
                <textarea
                  className="ai-textarea"
                  rows={10}
                  style={{ fontFamily: 'monospace' }}
                  value={reportContent.sourceCode}
                  onChange={(e) => updateReportField("sourceCode", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Diagram</label>
                <textarea
                  className="ai-textarea"
                  rows={2}
                  value={reportContent.diagram}
                  onChange={(e) => updateReportField("diagram", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Conclusion</label>
                <textarea
                  className="ai-textarea"
                  rows={3}
                  value={reportContent.conclusion}
                  onChange={(e) => updateReportField("conclusion", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Download Buttons */}
          <div className="download-section">
            <h3 className="section-title">
              <span className="section-icon">⬇️</span>
              Download Options
            </h3>
            <div className="download-buttons">
              <button
                className={`btn btn-pdf${loading.pdf ? " loading" : ""}`}
                onClick={handleDownloadPDF}
              >
                <span className="btn-icon">📕</span>
                {loading.pdf ? "Generating..." : "Download PDF"}
              </button>
              <button
                className={`btn btn-docx${loading.docx ? " loading" : ""}`}
                onClick={handleDownloadDOCX}
              >
                <span className="btn-icon">📘</span>
                {loading.docx ? "Generating..." : "Download DOCX"}
              </button>
              <button
                className={`btn btn-png${loading.png ? " loading" : ""}`}
                onClick={handleDownloadPNG}
              >
                <span className="btn-icon">🖼️</span>
                {loading.png ? "Generating..." : "Download PNG"}
              </button>
              <button
                className="btn btn-print"
                onClick={() => window.print()}
              >
                <span className="btn-icon">🖨️</span>
                Print Report
              </button>
            </div>
          </div>
        </section>

        {/* ===== PREVIEW PANEL ===== */}
        <section className="preview-panel">
          <div className="panel-header preview-header">
            <h2>Live Preview</h2>
            <p>Your lab report front page</p>
          </div>
          <div className="preview-wrapper">
            <div className="a4-page" id="reportPreview" ref={previewRef}>
              {/* University Name */}
              <div className="report-header">
                <h1 className="university-name">
                  Bangladesh Army University of Science and Technology (BAUST),
                  Saidpur
                </h1>
              </div>

              {/* Logo */}
              <div className="logo-section">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/baust-logo.png"
                  alt="BAUST Logo"
                  width={110}
                  height={110}
                  className="university-logo"
                />
              </div>

              {/* Lab Report Title */}
              <div className="report-title-section">
                <h2 className="report-type">Lab Report</h2>
              </div>

              {/* Course Info Table */}
              <div className="report-course-info">
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td className="label-cell">
                        <b><i>Department</i></b>
                      </td>
                      <td className="separator-cell"><b>:</b></td>
                      <td className="value-cell">{form.department}</td>
                    </tr>
                    <tr>
                      <td className="label-cell">
                        <b><i>Course Title</i></b>
                      </td>
                      <td className="separator-cell"><b>:</b></td>
                      <td className="value-cell">{form.courseTitle}</td>
                    </tr>
                    <tr>
                      <td className="label-cell">
                        <b><i>Course No</i></b>
                      </td>
                      <td className="separator-cell"><b>:</b></td>
                      <td className="value-cell">{form.courseNo}</td>
                    </tr>
                    <tr>
                      <td className="label-cell">
                        <b><i>Experiment No</i></b>
                      </td>
                      <td className="separator-cell"><b>:</b></td>
                      <td className="value-cell">{form.experimentNo}</td>
                    </tr>
                    <tr>
                      <td className="label-cell">
                        <b><i>Experiment Name</i></b>
                      </td>
                      <td className="separator-cell"><b>:</b></td>
                      <td className="value-cell">{form.experimentName}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Comments */}
              <div className="report-comments">
                <p className="comments-label">
                  <b><i>Comments:</i></b>
                </p>
                <div className="comments-box" />
              </div>

              {/* Submitted By / Submitted To */}
              <div className="report-submission">
                <div className="submission-label-row">
                  <span className="submission-label">
                    <b><i>Submitted By</i></b>
                  </span>
                  <span className="submission-label">
                    <b><i>Submitted To</i></b>
                  </span>
                </div>
                <div className="submission-boxes">
                  {/* Submitted By Box */}
                  <div className="submission-box">
                    <p>
                      <b><i>Name:</i></b> {form.studentName}
                    </p>
                    <p>
                      <b><i>Id:</i></b> {form.studentId}
                    </p>
                    <p className="level-term-line">
                      <span>
                        <b><i>Level:</i></b> {form.level}
                      </span>
                      <span>
                        <b><i>Term:</i></b> {form.term}
                      </span>
                    </p>
                    <p>
                      <b><i>Date of Experiment:</i></b>{" "}
                      {formatDate(form.experimentDate)}
                    </p>
                    <p>
                      <b><i>Date of submission:</i></b>{" "}
                      {formatDate(form.submissionDate)}
                    </p>
                  </div>

                  {/* Submitted To Box */}
                  <div className="submission-box submitted-to-box">
                    <div className="teachers-container">
                      {form.teachers.map((teacher, i) => (
                        <div key={i}>
                          <div className="teacher-preview-entry">
                            <p>
                              <b><i>Name of the Teacher:</i></b>
                            </p>
                            <p className="teacher-value">{teacher.name}</p>
                            <p>
                              <b><i>Designation:</i></b>
                            </p>
                            <p className="teacher-value">
                              {teacher.designation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="signature-line">
                      <b><i>Signature:</i></b>{" "}
                      .............................................
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>BAUST Lab Report Generator &copy; 2026 &mdash; Made with ❤️</p>
      </footer>
    </>
  );
}
