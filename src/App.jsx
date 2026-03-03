import { useState } from "react";
import POA_LOGO from "./assets/logo.png";

// Backend base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const smileyOptions = [
  { value: "poor", label: "Not Satisfied", emoji: "😟", answerId: 1, score: 1 },
  { value: "average", label: "Satisfied", emoji: "😐", answerId: 2, score: 3 },
  { value: "excellent", label: "Very Satisfied", emoji: "😊", answerId: 3, score: 5 },
];

const improveOptions = [
  "Response Time",
  "Staff/Volunteer Behavior",
  "Communication & Guidance",
  "Process Transparency",
  "Service Quality",
  "Follow-up / Updates",
  "Facility Cleanliness & Comfort",
  "Donation/Receipt Process",
  "Others",
];

const serviceOptions = [
  "Food / Ration Distribution",
  "Medical / Health Services",
  "Education Support",
  "Orphan Care",
  "Disaster / Emergency Relief",
  "Clean Water / Water Projects",
  "Qurbani / Ramadan Program",
  "Donation / Zakat / Sadqah",
  "Volunteer Registration",
  "Others",
];

function App() {
  const [experience, setExperience] = useState(null);
  const [contact, setContact] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");

  const [improve, setImprove] = useState([]);
  const [services, setServices] = useState([]);
  const [details, setDetails] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleCheck = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const validate = () => {
    const e = {};

    if (!experience) e.experience = "Please select your satisfaction level.";

    if (!contact.trim()) {
      e.contact = "Mobile number is required.";
    } else if (!/^03\d{9}$/.test(contact)) {
      e.contact = "Enter a valid number (03XXXXXXXXX).";
    }

    if (!branchCode.trim()) {
      e.branchCode = "Branch code is required.";
    }

    if (!branchName.trim()) {
      e.branchName = "Branch name is required.";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const selectedExperience = smileyOptions.find((opt) => opt.value === experience);
    if (!selectedExperience) {
      setErrors((prev) => ({
        ...prev,
        experience: "Please select your satisfaction level.",
      }));
      return;
    }

    const payload = {
      branchCode: branchCode.trim(),
      branchName: branchName.trim(),
      mobilePhoneNumber: contact.trim(),
      questionId: 1,
      answerId: selectedExperience.answerId,
      value: selectedExperience.score,
    };

    try {
      setSubmitting(true);
      setSubmitError("");

      const res = await fetch(`${API_BASE_URL}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.headerTop}>
              <img src={POA_LOGO} alt="Alkhidmat Logo" style={styles.logo} />
              <div style={styles.headerBadge}>Feedback</div>
            </div>

            <h1 style={styles.surveyTitle}>Alkhidmat Feedback Form</h1>
            <p style={styles.subtitle}>
              Your feedback helps us improve our welfare and community services.
            </p>
          </div>

          <div style={{ padding: "44px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🤍</div>
            <h2 style={styles.thankTitle}>Thank You!</h2>
            <p style={styles.thankText}>
              Your response has been recorded. Thanks for your time and support.
            </p>

            <div style={{ marginTop: 22 }}>
              <button
                type="button"
                style={styles.secondaryBtn}
                onClick={() => window.location.reload()}
              >
                Submit another response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <img src={POA_LOGO} alt="Alkhidmat Logo" style={styles.logo} />
            <div style={styles.headerBadge}>Feedback</div>
          </div>

          <h1 style={styles.surveyTitle}>Alkhidmat Feedback Form</h1>
          <p style={styles.subtitle}>Please answer a few quick questions.</p>
        </div>

        <div style={styles.body}>
          {/* Q1 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>1</div>
              <label style={styles.qLabel}>
                How satisfied are you with Alkhidmat services today?
              </label>
            </div>

            {errors.experience && <span style={styles.error}>{errors.experience}</span>}

            <div style={styles.smileyRow}>
              {smileyOptions.map((opt) => {
                const active = experience === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setExperience(opt.value);
                      setErrors((p) => ({ ...p, experience: null }));
                    }}
                    style={{
                      ...styles.smileyBtn,
                      ...(active ? styles.smileyBtnActive : null),
                    }}
                    aria-pressed={active}
                  >
                    <span style={{ fontSize: 40, lineHeight: "40px" }}>{opt.emoji}</span>
                    <span
                      style={{
                        ...styles.smileyLabel,
                        ...(active ? styles.smileyLabelActive : null),
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q2 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>2</div>
              <label style={styles.qLabel}>Please enter your mobile number (03XXXXXXXXX)</label>
            </div>

            {errors.contact && <span style={styles.error}>{errors.contact}</span>}

            <input
              style={{ ...styles.input, ...(errors.contact ? styles.inputError : null) }}
              placeholder="03XXXXXXXXX"
              value={contact}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 11);
                setContact(onlyDigits);
                setErrors((p) => ({ ...p, contact: null }));
              }}
              maxLength={11}
              inputMode="numeric"
            />
          </div>

          {/* Q3 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>3</div>
              <label style={styles.qLabel}>Enter branch code</label>
            </div>

            {errors.branchCode && <span style={styles.error}>{errors.branchCode}</span>}

            <input
              style={{ ...styles.input, ...(errors.branchCode ? styles.inputError : null) }}
              placeholder="Enter branch code"
              value={branchCode}
              onChange={(e) => {
                setBranchCode(e.target.value);
                setErrors((p) => ({ ...p, branchCode: null }));
              }}
            />
          </div>

          {/* Q4 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>4</div>
              <label style={styles.qLabel}>Enter branch name</label>
            </div>

            {errors.branchName && <span style={styles.error}>{errors.branchName}</span>}

            <input
              style={{ ...styles.input, ...(errors.branchName ? styles.inputError : null) }}
              placeholder="Enter branch name"
              value={branchName}
              onChange={(e) => {
                setBranchName(e.target.value);
                setErrors((p) => ({ ...p, branchName: null }));
              }}
            />
          </div>

          {/* Q5 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>5</div>
              <label style={styles.qLabel}>Which area should we improve?</label>
            </div>

            <div style={styles.chipsWrap}>
              {improveOptions.map((opt) => {
                const active = improve.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleCheck(improve, setImprove, opt)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
                    aria-pressed={active}
                  >
                    <span style={styles.chipDot} />
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q6 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>6</div>
              <label style={styles.qLabel}>Which service/program is this feedback about?</label>
            </div>

            <div style={styles.chipsWrap}>
              {serviceOptions.map((opt) => {
                const active = services.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleCheck(services, setServices, opt)}
                    style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
                    aria-pressed={active}
                  >
                    <span style={styles.chipDot} />
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q7 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.qIndex}>7</div>
              <label style={styles.qLabel}>Any comments/suggestions? (optional)</label>
            </div>

            <textarea
              style={styles.textarea}
              placeholder="Write here..."
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 200))}
              rows={4}
            />
            <div style={styles.counter}>{details.length} / 200</div>
          </div>

          {submitError && (
            <div
              style={{
                ...styles.section,
                border: "1px solid rgba(220,38,38,0.22)",
              }}
            >
              <span style={styles.error}>{submitError}</span>
            </div>
          )}

          <div style={{ textAlign: "center", paddingBottom: 10 }}>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
              {!submitting && <span style={{ marginLeft: 10, opacity: 0.9 }}>→</span>}
            </button>
          </div>

          <div style={styles.footerNote}>This form takes less than 1 minute.</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "34px 16px",
    fontFamily: "'Segoe UI', sans-serif",
    background:
      "radial-gradient(1200px 600px at 10% 10%, rgba(26,86,160,0.18), transparent 60%), radial-gradient(900px 450px at 90% 20%, rgba(99,102,241,0.16), transparent 55%), linear-gradient(180deg, #f7fafc 0%, #eef2ff 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 620,
    borderRadius: 18,
    overflow: "hidden",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 18px 55px rgba(15, 23, 42, 0.15)",
    border: "1px solid rgba(226,232,240,0.9)",
  },
  header: {
    padding: "22px 26px 18px",
    background: "linear-gradient(135deg, rgba(26,86,160,0.14), rgba(99,102,241,0.10))",
    borderBottom: "1px solid rgba(226,232,240,0.9)",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  logo: { height: 100, objectFit: "contain" },
  headerBadge: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(26,86,160,0.12)",
    color: "#1a56a0",
    border: "1px solid rgba(26,86,160,0.18)",
  },
  surveyTitle: {
    fontSize: 22,
    fontWeight: 800,
    margin: 0,
    color: "#0f172a",
    letterSpacing: 0.2,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: 13.5,
    lineHeight: 1.4,
  },
  body: { padding: "18px 22px 22px" },
  section: {
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: 14,
    padding: "14px 14px 16px",
    marginBottom: 14,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  qIndex: {
    width: 26,
    height: 26,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(26,86,160,0.12)",
    color: "#1a56a0",
    fontWeight: 800,
    fontSize: 12,
    flex: "0 0 auto",
    marginTop: 1,
  },
  qLabel: {
    display: "block",
    fontSize: 13.5,
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.5,
    margin: 0,
  },
  error: {
    display: "block",
    color: "#dc2626",
    fontSize: 12,
    marginTop: -6,
    marginBottom: 8,
  },
  smileyRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
  },
  smileyBtn: {
    cursor: "pointer",
    borderRadius: 14,
    padding: "14px 10px",
    border: "1px solid rgba(226,232,240,0.95)",
    background: "rgba(255,255,255,0.9)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
    display: "grid",
    placeItems: "center",
    gap: 6,
    outline: "none",
  },
  smileyBtnActive: {
    border: "1px solid rgba(26,86,160,0.45)",
    boxShadow: "0 10px 22px rgba(26,86,160,0.16)",
    transform: "translateY(-1px)",
  },
  smileyLabel: { fontSize: 12.5, color: "#475569", fontWeight: 700 },
  smileyLabelActive: { color: "#1a56a0" },
  input: {
    width: "100%",
    padding: "11px 12px",
    border: "1.5px solid rgba(226,232,240,0.95)",
    borderRadius: 12,
    fontSize: 13.5,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.9)",
  },
  inputError: { borderColor: "rgba(220,38,38,0.55)" },
  chipsWrap: { display: "flex", flexWrap: "wrap", gap: 10 },
  chip: {
    cursor: "pointer",
    borderRadius: 999,
    padding: "10px 12px",
    border: "1px solid rgba(226,232,240,0.95)",
    background: "rgba(255,255,255,0.9)",
    color: "#334155",
    fontSize: 13,
    fontWeight: 650,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
  },
  chipActive: {
    borderColor: "rgba(26,86,160,0.45)",
    boxShadow: "0 10px 22px rgba(26,86,160,0.12)",
    transform: "translateY(-1px)",
    color: "#0f172a",
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(26,86,160,0.55)",
  },
  textarea: {
    width: "100%",
    padding: "11px 12px",
    border: "1.5px solid rgba(226,232,240,0.95)",
    borderRadius: 12,
    fontSize: 13.5,
    color: "#0f172a",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "rgba(255,255,255,0.9)",
    minHeight: 92,
  },
  counter: {
    textAlign: "right",
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 6,
  },
  submitBtn: {
    background: "linear-gradient(135deg, #1a56a0, #4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "12px 36px",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: 0.3,
    boxShadow: "0 14px 30px rgba(26,86,160,0.25)",
    transition: "transform 0.12s ease, box-shadow 0.12s ease",
  },
  footerNote: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 12.5,
    color: "#64748b",
  },
  thankTitle: {
    color: "#0f172a",
    fontWeight: 900,
    fontSize: 24,
    margin: "0 0 6px",
  },
  thankText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.55,
    margin: 0,
  },
  secondaryBtn: {
    background: "rgba(15, 23, 42, 0.06)",
    border: "1px solid rgba(226,232,240,0.95)",
    color: "#0f172a",
    borderRadius: 12,
    padding: "10px 16px",
    fontSize: 13.5,
    fontWeight: 750,
    cursor: "pointer",
  },
};

export default App;