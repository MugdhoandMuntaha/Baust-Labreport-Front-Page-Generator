"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { IndexFormData, ExperimentEntry, TeacherEntry } from "./download";

const TEACHER_PRESETS = [
  { name: "Md Atiq Shariar", designation: "Lecturer, EEE (Baust)" },
  { name: "Roman Raihan", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "Shifa Tasmiah Tisha", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "AKZ Rasel Rahman", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "Md. Osama", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "S. M Golam Rifat", designation: "Lecturer, Dept. of CSE, BAUST" },
];

const STUDENT_PRESETS = [
  { name: "Shah Md Al Junaid", id: "0802420205101112", level: "2", term: "II" },
  { name: "Shidratul Muntaha", id: "0802420105101113", level: "2", term: "II" },
];

const INITIAL_FORM: IndexFormData = {
  studentName: "",
  studentId: "",
  level: "",
  term: "",
  section: "",
  dateOfSubmission: "",
  teachers: [{ name: "", designation: "" }],
  experiments: [{ no: "01", name: "", experimentDate: "", submissionDate: "", mark: "" }],
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

export default function IndexGeneratorPage() {
  const [form, setForm] = useState<IndexFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState({ pdf: false, png: false, docx: false });
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (field: keyof Omit<IndexFormData, "experiments" | "teachers">, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateTeacher = useCallback(
    (index: number, field: keyof TeacherEntry, value: string) => {
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

  const updateExperiment = useCallback(
    (index: number, field: keyof ExperimentEntry, value: string) => {
      setForm((prev) => {
        const experiments = [...prev.experiments];
        experiments[index] = { ...experiments[index], [field]: value };
        return { ...prev, experiments };
      });
    },
    []
  );

  const addExperiment = useCallback(() => {
    setForm((prev) => {
      const nextNo = (prev.experiments.length + 1).toString().padStart(2, "0");
      return {
        ...prev,
        experiments: [...prev.experiments, { no: nextNo, name: "", experimentDate: "", submissionDate: "", mark: "" }],
      };
    });
  }, []);

  const removeExperiment = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      experiments: prev.experiments.filter((_, i) => i !== index).map((exp, i) => ({ ...exp, no: (i + 1).toString().padStart(2, "0") })),
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
            <span className="title-icon">📑</span>
            Index Page Generator
          </h1>
          <p className="app-subtitle">
            Generate professional lab report index pages instantly
          </p>
        </div>
      </header>

      <main className="app-container">
        {/* ===== FORM PANEL ===== */}
        <section className="form-panel">
          <div className="panel-header">
            <h2>Fill in Details</h2>
            <p>Enter your index information below</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
            
            {/* Experiments */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🔬</span>
                Experiments List
              </h3>
              {form.experiments.map((exp, i) => (
                <div key={i} className="teacher-entry">
                  <div className="teacher-entry-header">
                    <span className="teacher-number">Experiment {exp.no}</span>
                    {i > 0 && (
                      <button
                        type="button"
                        className="btn-remove-teacher"
                        onClick={() => removeExperiment(i)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Experiment Name</label>
                    <input
                      value={exp.name}
                      onChange={(e) => updateExperiment(i, "name", e.target.value)}
                      placeholder="e.g. Study of open circuit test..."
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Experiment Date</label>
                      <input
                        type="date"
                        value={exp.experimentDate}
                        onChange={(e) => updateExperiment(i, "experimentDate", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Submission Date</label>
                      <input
                        type="date"
                        value={exp.submissionDate}
                        onChange={(e) => updateExperiment(i, "submissionDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-add-teacher"
                onClick={addExperiment}
              >
                <span>+</span> Add Another Experiment
              </button>
            </div>

            {/* Submitted By */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-icon">🎓</span>
                Submitted By
              </h3>
              <div className="form-group">
                <label htmlFor="studentPreset">Quick Select Student</label>
                <select
                  id="studentPreset"
                  value=""
                  onChange={(e) => {
                    const preset = STUDENT_PRESETS.find(s => s.name === e.target.value);
                    if (preset) {
                      setForm(prev => ({
                        ...prev,
                        studentName: preset.name,
                        studentId: preset.id,
                        level: preset.level,
                        term: preset.term
                      }));
                    }
                  }}
                >
                  <option value="">— Select a student —</option>
                  {STUDENT_PRESETS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} — {s.id}
                    </option>
                  ))}
                </select>
              </div>
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
                  <label htmlFor="studentId">Roll</label>
                  <input
                    id="studentId"
                    value={form.studentId}
                    onChange={(e) => update("studentId", e.target.value)}
                    placeholder="e.g. 0802420205101140"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="level">Level</label>
                  <input
                    id="level"
                    value={form.level}
                    onChange={(e) => update("level", e.target.value)}
                    placeholder="e.g. 2"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="term">Term</label>
                  <input
                    id="term"
                    value={form.term}
                    onChange={(e) => update("term", e.target.value)}
                    placeholder="e.g. I I"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="section">Section</label>
                  <input
                    id="section"
                    value={form.section}
                    onChange={(e) => update("section", e.target.value)}
                    placeholder="e.g. C"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfSubmission">Date of Submission</label>
                  <input
                    type="date"
                    id="dateOfSubmission"
                    value={form.dateOfSubmission}
                    onChange={(e) => update("dateOfSubmission", e.target.value)}
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
                      onChange={(e) => updateTeacher(i, "name", e.target.value)}
                      placeholder="Instructor's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      value={teacher.designation}
                      onChange={(e) => updateTeacher(i, "designation", e.target.value)}
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
            <p>Your lab report index page</p>
          </div>
          <div className="preview-wrapper">
            <div className="a4-page index-page" id="reportPreview" ref={previewRef}>
              
              <div className="index-watermark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/baust-logo.png" alt="Watermark" />
              </div>

              {/* Logo */}
              <div className="logo-section" style={{ marginBottom: '5px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/baust-logo.png"
                  alt="BAUST Logo"
                  width={80}
                  height={80}
                  className="university-logo"
                />
              </div>
              
              {/* University Name */}
              <div className="report-header" style={{ marginBottom: '10px' }}>
                <h1 className="university-name" style={{ fontSize: '20px', fontWeight: 'normal', fontFamily: 'Times New Roman' }}>
                  Bangladesh Army University of Science<br/>and Technology (baust), Saidpur
                </h1>
              </div>

              {/* Lab Report Index Title */}
              <div className="report-title-section" style={{ marginBottom: '10px' }}>
                <h2 className="report-type" style={{ fontSize: '16px', fontWeight: 'normal' }}>Lab Report Index</h2>
              </div>

              {/* Index Table */}
              <div className="index-table-container">
                <table className="index-table">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>Experiment<br/>no.</th>
                      <th style={{ width: '43%' }}>Experiment name</th>
                      <th style={{ width: '15%' }}>Experiment<br/>date</th>
                      <th style={{ width: '15%' }}>Submission<br/>date</th>
                      <th style={{ width: '15%' }}>Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.experiments.map((exp, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'center' }}>{exp.no}</td>
                        <td style={{ textAlign: 'center' }}>{exp.name}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(exp.experimentDate)}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(exp.submissionDate)}</td>
                        <td>{exp.mark}</td>
                      </tr>
                    ))}
                    {/* Fill empty rows if needed to make it look good, but for now we render what's in the state */}
                  </tbody>
                </table>
              </div>

              {/* Submitted By / Submitted To */}
              <div className="report-submission index-submission">
                <div className="submission-label-row">
                  <span className="submission-label" style={{ textAlign: 'left', paddingLeft: '50px' }}>
                    <span style={{ fontSize: '18px' }}>Submitted By:</span>
                  </span>
                  <span className="submission-label" style={{ textAlign: 'left', paddingLeft: '50px' }}>
                    <span style={{ fontSize: '18px' }}>Submitted To:</span>
                  </span>
                </div>
                <div className="submission-boxes">
                  {/* Submitted By Box */}
                  <div className="submission-box">
                    <p>
                      <b>Name:</b> {form.studentName}
                    </p>
                    <p>
                      <b>Roll:</b> {form.studentId}
                    </p>
                    <p>
                      <b>Level:</b> {form.level}, <b>Term:</b> {form.term}, <b>Section:</b> {form.section}
                    </p>
                    <p>
                      <b>Date of Submission:</b> {formatDate(form.dateOfSubmission)}
                    </p>
                  </div>

                  {/* Submitted To Box */}
                  <div className="submission-box submitted-to-box">
                    <div className="teachers-container">
                      {form.teachers.map((teacher, i) => (
                        <div key={i} className="teacher-preview-entry">
                          <p>
                            <b>Name of Teacher:</b><br/>
                            <span style={{ display: 'inline-block', marginLeft: '15px' }}>• {teacher.name}</span>
                          </p>
                          <p>
                            <b>Designation:</b><br/>
                            <span style={{ display: 'inline-block', marginLeft: '15px' }}>• {teacher.designation}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="signature-line" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                      Signature:...............................................
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
