"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import type { IndexFormData, ExperimentEntry } from "./download";

const TEACHER_PRESETS = [
  { name: "Md Atiq Shariar", designation: "Lecturer, EEE (Baust)" },
  { name: "Roman Raihan", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "Shifa Tasmiah Tisha", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "AKZ Rasel Rahman", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "Md. Osama", designation: "Lecturer, Dept. of CSE, BAUST" },
  { name: "S. M Golam Rifat", designation: "Lecturer, Dept. of CSE, BAUST" },
];

const INITIAL_FORM: IndexFormData = {
  studentName: "",
  studentId: "",
  level: "",
  term: "",
  section: "",
  dateOfSubmission: "",
  teacherName: "",
  teacherDesignation: "",
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
    (field: keyof Omit<IndexFormData, "experiments">, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

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
              <div className="form-group">
                <label>Quick Select Teacher</label>
                <select
                  value=""
                  onChange={(e) => {
                    const preset = TEACHER_PRESETS.find(t => t.name === e.target.value);
                    if (preset) {
                      update("teacherName", preset.name);
                      update("teacherDesignation", preset.designation);
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
                  value={form.teacherName}
                  onChange={(e) => update("teacherName", e.target.value)}
                  placeholder="Instructor's full name"
                />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input
                  value={form.teacherDesignation}
                  onChange={(e) => update("teacherDesignation", e.target.value)}
                  placeholder="e.g. Lecturer, EEE (Baust)"
                />
              </div>
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
                    <p>
                      <b>Name of Teacher:</b><br/>
                      <span style={{ display: 'inline-block', marginLeft: '15px' }}>• {form.teacherName}</span>
                    </p>
                    <p>
                      <b>Designation:</b><br/>
                      <span style={{ display: 'inline-block', marginLeft: '15px' }}>• {form.teacherDesignation}</span>
                    </p>
                    
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
