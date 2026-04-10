import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import intercom from "./assets/intercom.png";
import mailchimp from "./assets/mailchimp.png";
import gsuite from "./assets/gsuite.png";
import dropbox from "./assets/dropbox.png";
import slack from "./assets/slack.png";
import github from "./assets/github.png";
import dashboard from "./assets/dashboard.png";
import insights from "./assets/insights.png";
import currencies from "./assets/currencies.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const partnerLogos = [intercom, dropbox, slack, github, gsuite, mailchimp];
const authAlerts = [
  {
    iconType: "f1",
    title: "Upcoming payment",
    text: "Your F1 TV subscription for $9.99 is due to renew in 2 days.",
  },
  {
    iconType: "dropbox",
    title: "Upcoming payment",
    text: "Your Dropbox subscription for $97 is due to renew in 7 days.",
  },
  {
    iconType: "hulu",
    title: "Upcoming payment",
    text: "Your Hulu subscription for $12.99 is due to renew in 1 day.",
  },
];

const moduleCards = [
  { title: "My Records", body: "Store IDs, licenses, insurance, and essential documents in one searchable space." },
  { title: "Renewal Radar", body: "Never miss expiry dates with layered reminders and weekly action summaries." },
  { title: "Subscriptions", body: "Track recurring plans, compare spend, and flag services you no longer use." },
  { title: "Vault + Sharing", body: "Protect sensitive files and share selected records with family or trusted editors." },
];

const boardItems = [
  { title: "Passport Renewal", due: "in 18 days", level: "expiring" },
  { title: "Car Insurance", due: "in 5 days", level: "high" },
  { title: "Gym Annual Plan", due: "tomorrow", level: "critical" },
  { title: "Cloud Backup", due: "in 40 days", level: "active" },
];

const faqs = [
  {
    q: "Why use a life-admin platform to track subscriptions and deadlines? Isn't that ironic?",
    a: "While it may seem ironic, it is all about return on clarity. By using Life Admin OS, you invest in a system that helps prevent late fees, missed renewals, and scattered records.\n\nThink of it as a small cost for stronger control, less stress, and better financial decisions over time.\n\nThis model also allows us to keep improving features and reliability.",
  },
  { q: "Can I use Life Admin OS to track payments other than subscriptions?", a: "Yes. You can track warranties, licenses, insurance, records, and one-time obligations too." },
  { q: "How many subscriptions and records can I track?", a: "Free and paid plans support different limits, and you can upgrade anytime." },
  { q: "What plan should I choose?", a: "Start with free, then move to Pro or Family once you need sharing and automation." },
  { q: "Can my family collaborate inside one account?", a: "Yes. Use role-based sharing with owner, editor, and viewer access." },
  { q: "Do you offer export and backup options?", a: "Yes. You can export and maintain backups for long-term control." },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readAuth = () => localStorage.getItem("laos_auth") === "1";
const writeAuth = (value) => (value ? localStorage.setItem("laos_auth", "1") : localStorage.removeItem("laos_auth"));

async function fakeSignIn(payload) {
  await wait(900);
  if (payload.email.includes("networkfail")) throw new Error("NETWORK");
  if (payload.email === "wrong@example.com" || payload.password === "wrongpass") throw new Error("INVALID_CREDENTIALS");
  return { ok: true };
}

async function fakeSignUp(payload) {
  await wait(1000);
  if (payload.email.includes("networkfail")) throw new Error("NETWORK");
  if (payload.email.includes("exists")) throw new Error("ACCOUNT_EXISTS");
  return { ok: true };
}

function Brand() {
  return (
    <div className="brand">
      <div className="brandPlaceholder">LOGO</div>
      <div>
        <strong>Life Admin OS</strong>
        <span>Control center</span>
      </div>
    </div>
  );
}

function Motion({ children, delay = 0 }) {
  return (
    <div className="motion" style={{ "--d": `${delay}ms` }}>
      {children}
    </div>
  );
}

function LandingPage() {
  const [billing, setBilling] = useState("yearly");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const nodes = document.querySelectorAll(".motion");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const plans = useMemo(() => {
    const yearly = billing === "yearly";
    return [
      { name: "Starter", price: "$0", unit: "/ forever", points: ["Up to 20 records", "Basic reminders", "Single user"] },
      { name: "Pro", price: yearly ? "$59" : "$7", unit: yearly ? "/ year" : "/ month", points: ["Unlimited records", "Smart reminders", "Vault + analytics"] },
      { name: "Family", price: yearly ? "$129" : "$15", unit: yearly ? "/ year" : "/ month", points: ["Shared workspace", "Role access", "Priority notifications"] },
    ];
  }, [billing]);

  return (
    <div className="appShell">
      <header className="topbar">
        <Brand />
        <nav>
          <a href="#modules">Modules</a>
          <a href="#board">Board</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <Link className="btn solid" to="/signin">
          Get Started
        </Link>
      </header>

      <section className="hero">
        <div className="heroGlow" />
        <div className="heroIconOrbit" aria-hidden="true">
          {partnerLogos.map((logo, idx) => (
            <img src={logo} alt="" key={idx} className={`orbitIcon icon${idx + 1}`} />
          ))}
        </div>
        <Motion>
          <div className="heroCopy">
            <p className="kicker">Life Admin Operating System</p>
            <h1>Run your personal admin like a calm command center.</h1>
            <p className="sub">
              One place for records, renewals, subscriptions, and reminders with clear next actions and shared family visibility.
            </p>
            <div className="heroCtas">
              <Link className="btn accent" to="/signup">
                Start free
              </Link>
            </div>
          </div>
        </Motion>
        <Motion delay={120}>
          <div className="heroDeck">
            <article className="floatingCard first">
              <h4>Expiring Soon</h4>
              <p>7 records require action this month.</p>
            </article>
            <article className="floatingCard second">
              <h4>Monthly Spend</h4>
              <p>$162 tracked across 12 subscriptions.</p>
            </article>
            <article className="floatingCard third">
              <h4>Guidance</h4>
              <p>Passport renews in 6 months. Start process now.</p>
            </article>
          </div>
        </Motion>
      </section>

      <section className="overview" id="modules">
        <Motion>
          <div className="overviewHead">
            <h2>A cleaner structure for life obligations</h2>
            <p>Keep important documents, recurring costs, and upcoming deadlines aligned in one system.</p>
          </div>
        </Motion>
        <div className="moduleGrid">
          {moduleCards.map((card, idx) => (
            <Motion delay={idx * 80} key={card.title}>
              <article className="moduleCard">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            </Motion>
          ))}
        </div>
      </section>

      <section className="commandCenter" id="board">
        <Motion>
          <div className="centerCopy">
            <h2>Live board for actions and priorities</h2>
            <p>See what is due, what is expiring, and what needs decisions this week.</p>
            <ul>
              <li>Critical items float to the top</li>
              <li>One-time and recurring reminders</li>
              <li>Task guidance generated from deadlines</li>
            </ul>
          </div>
        </Motion>
        <Motion delay={100}>
          <div className="centerVisual">
            <img src={dashboard} alt="Dashboard" />
            <div className="boardOverlay">
              {boardItems.map((item) => (
                <div key={item.title} className="boardRow">
                  <span>{item.title}</span>
                  <span className={`pill ${item.level}`}>{item.due}</span>
                </div>
              ))}
            </div>
          </div>
        </Motion>
      </section>

      <section className="insightsRow">
        <Motion>
          <article className="insightCard">
            <img src={insights} alt="Insights" />
            <h3>Cost intelligence</h3>
            <p>Understand trends and optimize spending before renewals happen.</p>
          </article>
        </Motion>
        <Motion delay={120}>
          <article className="insightCard">
            <img src={currencies} alt="Currencies" />
            <h3>Universal tracking</h3>
            <p>Manage categories, plans, and records from one normalized dashboard.</p>
          </article>
        </Motion>
      </section>

      <section className="pricing" id="pricing">
        <Motion>
          <div className="overviewHead">
            <h2>Plans built for real life admin</h2>
            <p>Start simple and grow into shared workflows when you need more control.</p>
          </div>
        </Motion>
        <Motion delay={90}>
          <div className="billingToggle">
            <button className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>
              Monthly
            </button>
            <button className={billing === "yearly" ? "active" : ""} onClick={() => setBilling("yearly")}>
              Yearly
            </button>
          </div>
        </Motion>
        <div className="planGrid">
          {plans.map((plan, idx) => (
            <Motion delay={idx * 90} key={plan.name}>
              <article className="planCard">
                <h3>{plan.name}</h3>
                <div className="price">
                  {plan.price}
                  <small>{plan.unit}</small>
                </div>
                <ul>
                  {plan.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Link className="btn accent" to="/signup">
                  Choose {plan.name}
                </Link>
              </article>
            </Motion>
          ))}
        </div>
      </section>

      <section className="faq" id="faq">
        <Motion>
          <h2>Frequently Asked Questions</h2>
        </Motion>
        <div className="faqStack">
          {faqs.map((item, idx) => (
            <Motion delay={idx * 60} key={item.q}>
              <div className={`faqItem ${openFaq === idx ? "open" : ""}`}>
                <button onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                  <span>{item.q}</span>
                  <span>{openFaq === idx ? "^" : "v"}</span>
                </button>
                {openFaq === idx && <p>{item.a}</p>}
              </div>
            </Motion>
          ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerTop">
          <div className="footerBrand">
            <Brand />
            <p>All your subscriptions and recurring payments in one place.</p>
            <div className="socialCircle">t</div>
          </div>
          <div className="footerCol">
            <h4>About</h4>
            <a href="#">Get Started</a>
            <a href="#">Manifesto</a>
            <a href="#">Features</a>
            <a href="#">FAQ</a>
          </div>
          <div className="footerCol">
            <h4>Product</h4>
            <a href="#">Affiliate Program</a>
            <a href="#">Roadmap</a>
            <a href="#">Suggest a Feature</a>
            <a href="#">Status</a>
            <a href="#">Currency Converter</a>
          </div>
          <div className="footerCol">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Acceptable Use</a>
          </div>
        </div>
        <div className="footerBottom">Life Admin OS - &copy; 2026</div>
      </footer>
    </div>
  );
}

function AuthBrand() {
  return (
    <div className="authBrand">
      <div className="authMark">LOGO</div>
      <div>
        <strong>Life Admin OS</strong>
        <span>Secure access</span>
      </div>
    </div>
  );
}

function AuthShell({ title, subtitle, sideTitle, sideBody, children }) {
  return (
    <main className="authPage">
      <section className="authPanel">
        <AuthBrand />
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
      <aside className="authSide">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <h2>{sideTitle}</h2>
        <p>{sideBody}</p>
        <div className="authAlerts">
          {authAlerts.map((item, idx) => (
            <article className={`alertCard a${idx + 1}`} key={item.text}>
              <div className={`alertIcon ${item.iconType}`}>
                {item.iconType === "dropbox" ? <img src={dropbox} alt="" /> : null}
                {item.iconType === "f1" ? <span>F1</span> : null}
                {item.iconType === "hulu" ? <span>hulu</span> : null}
              </div>
              <div className="alertBody">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
              <button className="alertClose" type="button" aria-label="dismiss">
                &times;
              </button>
            </article>
          ))}
        </div>
      </aside>
    </main>
  );
}

function Field({ id, label, error, children, ...props }) {
  const errorId = `${id}-error`;
  return (
    <div className="fieldWrap">
      <label htmlFor={id}>{label}</label>
      <div className="fieldBox">
        <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
        {children}
      </div>
      {error && (
        <small id={errorId} className="fieldError">
          {error}
        </small>
      )}
    </div>
  );
}

function GoogleButton({ text, onClick, disabled }) {
  return (
    <button className="googleBtn" type="button" onClick={onClick} disabled={disabled}>
      <span className="googleGlyph" aria-hidden="true">
        <span className="gBlue">G</span>
      </span>
      {text}
    </button>
  );
}

function SignIn({ onAuthed }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = EMAIL_RE.test(email.trim()) && password.length > 0;

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length || loading) return;
    setLoading(true);
    setFormError("");
    try {
      await fakeSignIn({ email: email.trim(), password });
      writeAuth(true);
      onAuthed(true);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message === "NETWORK" ? "Unable to connect. Check your internet and try again." : "Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  }

  async function signGoogle() {
    if (loading) return;
    setLoading(true);
    setFormError("");
    try {
      await wait(500);
      navigate("/auth/callback?provider=google&status=success");
    } catch {
      setFormError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue managing your life admin." sideTitle="Secure sign in" sideBody="Access records, reminders, and subscriptions from one place.">
      <GoogleButton text="Sign in with Google" onClick={signGoogle} disabled={loading} />
      <div className="divider">
        <span>or</span>
      </div>
      {formError && <p className="formError">{formError}</p>}
      <form onSubmit={submit} noValidate>
        <Field id="signin-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmail((v) => v.trim())} error={errors.email} />
        <Field id="signin-password" label="Password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}>
          <button className="toggleEye" type="button" onClick={() => setShow((v) => !v)}>
            {show ? "Hide" : "Show"}
          </button>
        </Field>
        <div className="auxRow">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="submitBtn" type="submit" disabled={!valid || loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="switchText">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthShell>
  );
}

function SignUp({ onAuthed }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = fullName.trim().length >= 2 && EMAIL_RE.test(email.trim()) && STRONG_PASSWORD_RE.test(password) && confirm === password;

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (fullName.trim().length < 2) next.fullName = "Full name must be at least 2 characters";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!STRONG_PASSWORD_RE.test(password)) next.password = "Password must be at least 8 characters and include a number";
    if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length || loading) return;
    setLoading(true);
    setFormError("");
    try {
      await fakeSignUp({ fullName: fullName.trim(), email: email.trim(), password });
      writeAuth(true);
      onAuthed(true);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message === "NETWORK" ? "Unable to connect. Check your internet and try again." : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function signGoogle() {
    if (loading) return;
    setLoading(true);
    setFormError("");
    try {
      await wait(500);
      navigate("/auth/callback?provider=google&status=success");
    } catch {
      setFormError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Start managing your life admin in one place." sideTitle="Create secure access" sideBody="Set up your account and continue to your life admin dashboard.">
      <GoogleButton text="Continue with Google" onClick={signGoogle} disabled={loading} />
      <div className="divider">
        <span>or</span>
      </div>
      {formError && <p className="formError">{formError}</p>}
      <form onSubmit={submit} noValidate>
        <Field id="signup-name" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
        <Field id="signup-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmail((v) => v.trim())} error={errors.email} />
        <Field id="signup-password" label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}>
          <button className="toggleEye" type="button" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </Field>
        <Field id="signup-confirm" label="Confirm Password" type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} onPaste={(e) => e.preventDefault()} error={errors.confirm}>
          <button className="toggleEye" type="button" onClick={() => setShowConfirm((v) => !v)}>
            {showConfirm ? "Hide" : "Show"}
          </button>
        </Field>
        <button className="submitBtn" type="submit" disabled={!valid || loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="switchText">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setMsg("If an account exists for this email, reset instructions have been sent.");
  }

  return (
    <AuthShell title="Forgot password" subtitle="Enter your email and we will send reset instructions." sideTitle="Recover access" sideBody="Use your account email to receive a secure reset link.">
      <form onSubmit={submit} noValidate>
        <Field id="forgot-email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <button className="submitBtn" type="submit">
          Send reset link
        </button>
      </form>
      {msg && <p className="successMsg">{msg}</p>}
      <p className="switchText">
        Back to <Link to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
}

function AuthCallback({ onAuthed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    let stop = false;
    (async () => {
      await wait(700);
      if (stop) return;
      const status = new URLSearchParams(location.search).get("status");
      if (status === "success") {
        writeAuth(true);
        onAuthed(true);
        navigate("/dashboard", { replace: true });
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    })();
    return () => {
      stop = true;
    };
  }, [location.search, navigate, onAuthed]);

  return (
    <AuthShell title="Completing sign-in" subtitle="Please wait while we finish authentication." sideTitle="Finishing setup" sideBody="You will be redirected automatically.">
      {error ? <p className="formError">{error}</p> : <p className="successMsg">Signing you in...</p>}
      <p className="switchText">
        Back to <Link to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
}

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const sidebarItems = [
    { name: "Subscriptions", icon: "[]", active: true },
    { name: "Revenue (beta)", icon: "^" },
    { name: "Transactions", icon: "<>" },
    { name: "Reports", icon: "O" },
    { name: "Team", icon: "U" },
    { name: "Integrations", icon: "+", badge: "NEW" },
    { name: "Settings", icon: "*" },
  ];

  return (
    <main className="dashPage">
      <aside className="dashSidebar">
        <div className="dashSideHead">
          <div className="dashLogoMark">LOGO</div>
          <div className="dashLogoText">
            <strong>Life Admin OS</strong>
            <span>My Workspace</span>
          </div>
            <button className="dashMenuBtn" type="button" aria-label="menu">
            |||
            </button>
        </div>

        <nav className="dashNav">
          {sidebarItems.map((item) => (
            <a key={item.name} href="#" className={`dashNavItem ${item.active ? "active" : ""}`}>
              <span className="dashNavIcon">{item.icon}</span>
              <span>{item.name}</span>
              {item.badge ? <em>{item.badge}</em> : null}
            </a>
          ))}
        </nav>

        <div className="dashQuota">
          <p>
            <strong>0</strong> / 10.0 subscriptions
          </p>
          <div className="dashQuotaTrack">
            <span />
          </div>
          <button
            className="dashLogoutBtn"
            onClick={() => {
              writeAuth(false);
              onLogout();
              navigate("/signin", { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <section className="dashMain">
        <header className="dashTopbar">
          <div className="dashCrumbs">
            <span className="dashCrumbIcon">WS</span>
            <span>My Workspace</span>
            <span className="dashSlash">/</span>
            <button className="dashProjectBtn" type="button">
              <span>[]</span> All Projects <span>v</span>
            </button>
          </div>
          <div className="dashHeadActions">
            <button type="button" aria-label="help">
              ?
            </button>
            <button type="button" aria-label="announcements">
              !
            </button>
            <button type="button" className="dashAvatar" aria-label="profile">
              LA
            </button>
            <button type="button" aria-label="menu">
              |||
            </button>
          </div>
        </header>

        <div className="dashBody">
          <div className="dashTitleRow">
            <h1>Subscriptions</h1>
            <div className="dashActionRow">
              <label className="dashSearch">
                <span>S</span>
                <input type="text" value="" readOnly placeholder="Search" aria-label="search subscriptions" />
                <kbd>Ctrl K</kbd>
              </label>
              <button className="dashAddBtn" type="button">
                + Add subscription
              </button>
              <button className="dashMoreBtn" type="button" aria-label="more">
                ⋮
              </button>
            </div>
          </div>

          <div className="dashFilterRow">
            <div className="dashFiltersLeft">
              <button className="dashPillBtn" type="button">
                <span>Cal</span> This month <span>v</span>
              </button>
              <button className="dashPillBtn" type="button">
                Add filter <span>v</span>
              </button>
              <span className="dashStatusPill">
                <i /> Active
              </span>
            </div>
            <button className="dashPillBtn" type="button">
              List <span>v</span>
            </button>
          </div>

          <div className="dashContentGrid">
            <article className="subsPanel">
              <div className="subsHead">
                <p>0 items</p>
                <div className="subsControls">
                  <button type="button">
                    Sort Size <span>v</span>
                  </button>
                  <button type="button">
                    Columns <span>v</span>
                  </button>
                </div>
              </div>

              <div className="subsBody">
                <div className="emptyArt" aria-hidden="true">
                  <span className="emptyCircle" />
                  <span className="emptyPanel" />
                  <span className="emptyPlus">+</span>
                </div>
                <h2>No subscriptions found</h2>
                <p>Add a new subscription to get started, or try changing your filters.</p>
              </div>

              <footer className="subsFooter">
                <span>
                  Page <strong>1 of 0</strong>
                </span>
                <button className="dashPillBtn small" type="button">
                  Show 25 <span>v</span>
                </button>
              </footer>
            </article>

            <aside className="dashRail">
              <article className="spendingCard">
                <header>
                  <h3>Spending</h3>
                  <div className="spendingSwitch">
                    <span>Use average</span>
                    <button type="button" aria-label="use average toggle">
                      <i />
                    </button>
                  </div>
                </header>
                <div className="spendingBody">
                  <p>Total spent</p>
                  <strong>$0.00</strong>
                </div>
              </article>

              <article className="promoCard">
                <div className="promoThumb" aria-hidden="true">
                  Life Admin
                </div>
                <div>
                  <h4>Your obligations, reimagined.</h4>
                  <p>Dive into records, renewals, and reminders with a clear life-admin command center.</p>
                </div>
              </article>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function AppRoutes() {
  const [authed, setAuthed] = useState(readAuth());
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={authed ? <Navigate to="/dashboard" replace /> : <SignIn onAuthed={setAuthed} />} />
      <Route path="/signup" element={authed ? <Navigate to="/dashboard" replace /> : <SignUp onAuthed={setAuthed} />} />
      <Route path="/forgot-password" element={authed ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/auth/callback" element={authed ? <Navigate to="/dashboard" replace /> : <AuthCallback onAuthed={setAuthed} />} />
      <Route path="/dashboard" element={authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

