import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Sun, Moon, ChevronDown, Menu, X } from "lucide-react";

/**
 * Minimal + Futuristic Portfolio for Hari Sravan (with Hero Graphic + Mobile Menu)
 * Tech: React + TailwindCSS + Framer Motion
 * - Dark mode by default with toggle (persists to localStorage)
 * - Smooth scrolling nav
 * - Parallax background accents
 * - Section fade-ins and micro-interactions
 * - Semantic structure + alt text + basic SEO-friendly content
 *
 * Usage:
 * 1) Ensure Tailwind v3 is configured and src/index.css has @tailwind directives only.
 * 2) Put your image at /public/hero.jpg (or change HERO_IMG).
 * 3) Keep this file named App.tsx and exported as default App().
 */

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

// Small, reusable fade-in variants for consistency
const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// Accent color can be tuned here for quick theme changes
const ACCENT = "from-cyan-400 to-violet-500";

// ── Hero image path (replace with your real asset). You can use /public/hero.jpg if using Vite/CRA.
const HERO_IMG = "/hero.jpg"; // e.g., "/assets/hari-profile.jpg"

function useDarkModeDefault() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("hs_dark");
    if (saved !== null) return saved === "1";
    // Prefer OS scheme (but default to dark if unavailable)
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("hs_dark", dark ? "1" : "0");
  }, [dark]);

  return { dark, setDark };
}

function Header({ onToggleTheme, dark }: { onToggleTheme: () => void; dark: boolean }) {
  const [open, setOpen] = useState(false);

  // (Optional) lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-white/40 bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/40 dark:bg-neutral-900/70 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="group inline-flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${ACCENT} animate-pulse`} />
          <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Hari Sravan</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
            >
              {n.label}
            </a>
          ))}
          <button
            aria-label="Toggle color theme"
            onClick={onToggleTheme}
            className="rounded-xl border border-neutral-300/60 dark:border-neutral-700/60 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden rounded-xl border border-neutral-300/60 dark:border-neutral-700/60 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur"
          >
            <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
              <ul className="flex flex-col gap-2">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <button
                    onClick={() => {
                      onToggleTheme();
                      // setOpen(false); // uncomment if you want to close after theme toggling
                    }}
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-left text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </button>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ParallaxDecor() {
  // Subtle parallax on gradient orbs for a futuristic feel
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -40]);
  const y2 = useTransform(scrollY, [0, 500], [0, 40]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ y: y1 }}
        className={`pointer-events-none fixed -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-gradient-to-br ${ACCENT}`}
      />
      <motion.div
        aria-hidden
        style={{ y: y2 }}
        className={`pointer-events-none fixed top-1/2 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-gradient-to-tr ${ACCENT}`}
      />
    </>
  );
}

function Hero() {
  return (
    //<section id="home" className="relative pt-28 md:pt-32 lg:pt-36 pb-24 md:pb-32">
      //<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <section id="home" className="relative pt-28 md:pt-32 lg:pt-36 pb-24 md:pb-32">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl xl:max-w-8xl 2xl:max-w-[95rem]"></div>
        {/* Desktop: image + text; Mobile: stacked. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.1fr_1.3fr] gap-10 items-center">
          {/* Photo / Illustration with subtle glow */}
          <motion.div variants={fadeIn} initial="hidden" animate="show" className="order-1 lg:order-none">
            <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
              {/* Gradient ring */}
              <div
                className={`absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br ${ACCENT} blur-2xl opacity-30`}
                aria-hidden
              />
              <img
                src={HERO_IMG}
                alt="Portrait or hero graphic for Hari Sravan"
                className="relative w-full h-full object-cover rounded-[1.5rem] border border-neutral-200/70 dark:border-neutral-800/70 shadow-xl"
              />
            </div>
          </motion.div>

          {/* Textual hero block */}
          <motion.div variants={fadeInUp} initial="hidden" animate="show" className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400 mb-6">
              <span className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-br ${ACCENT}`} />
              Software Engineer · AI & Cloud Enthusiast
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Hari Sravan
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
              Building reliable systems at MLGW with <span className="font-medium">Java</span> and{" "}
              <span className="font-medium">Oracle SQL/PLSQL</span> — now exploring{" "}
              <span className="font-medium">AI agents</span>, <span className="font-medium">cloud</span>, and modern
              engineering.
            </p>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
              <a
                href="#projects"
                className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br ${ACCENT} shadow-lg shadow-cyan-500/10 hover:opacity-95 transition`}
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="rounded-xl px-5 py-2.5 text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Contact Me
              </a>
            </div>
            <div className="mt-12 hidden lg:flex">
              <ChevronDown className="w-6 h-6 text-neutral-400 animate-bounce" />
            </div>
          </motion.div>
        </div>

        {/* Mobile chevron */}
        <div className="mt-10 flex lg:hidden justify-center">
          <ChevronDown className="w-6 h-6 text-neutral-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">About</h2>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
            I’m a Software Engineer at MLGW focused on building practical, reliable systems using Java and Oracle
            SQL/PLSQL. Lately, I’ve been investing in AI agents, cloud-native patterns, and modern software development
            practices. I enjoy designing clean data flows, automating manual processes, and crafting minimalist,
            high-performance UIs like this one.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const SKILLS = [
  { label: "Java" },
  { label: "Oracle SQL" },
  { label: "PLSQL" },
  { label: "Python" },
  { label: "Spring Boot" },
  { label: "Power BI" },
  { label: "Git" },
  { label: "AI Tools" },
  { label: "Cloud (AWS/Azure/GCP)" },
];

function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Skills</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Tools and technologies I currently use or am leveling up on.
          </p>
          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SKILLS.map((s, i) => (
              <motion.li
                key={s.label}
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 bg-white/50 dark:bg-neutral-900/50 backdrop-blur hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <span className="inline-block mr-2 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                {s.label}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    title: "AI Agent: Utility Bill Triage",
    desc: "Agentic workflow that reads customer bill PDFs, extracts anomalies, and drafts follow‑ups.",
    stack: ["Python", "LangChain", "OpenAI", "AWS Lambda"],
    links: { github: "#", live: "#" },
  },
  {
    title: "Automation: Address Normalization",
    desc: "Oracle PLSQL + Java toolkit to normalize and compare address fields, producing quality flags.",
    stack: ["Oracle", "PLSQL", "Java"],
    links: { github: "#", live: "#" },
  },
  {
    title: "Dashboards: Service KPIs",
    desc: "Power BI dashboards for Memphis-specific service requests with geospatial overlays.",
    stack: ["Power BI", "Python", "GeoJSON"],
    links: { github: "#", live: "#" },
  },
  {
    title: "Cloud Lab: Serverless ETL",
    desc: "Event-driven data ingestion with S3 → Lambda → DynamoDB, plus observability.",
    stack: ["AWS", "Lambda", "DynamoDB"],
    links: { github: "#", live: "#" },
  },
];

function ProjectCard({ p }: { p: typeof PROJECTS[number] }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur"
    >
      {/* Image placeholder with subtle gradient; swap background with real images */}
      <div className={`h-40 sm:h-48 bg-gradient-to-br ${ACCENT} opacity-80 relative`}>
        <div className="absolute inset-0 grid place-items-center text-white/90 text-sm tracking-wide uppercase">
          Project Image
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{p.title}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{p.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.stack.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-neutral-700 dark:text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <a
            href={p.links.github}
            className="inline-flex items-center gap-1 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
          >
            <Github className="w-4 h-4" /> Code
          </a>
          <a
            href={p.links.live}
            className="inline-flex items-center gap-1 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
          >
            <ExternalLink className="w-4 h-4" /> Live
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Projects</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">Selected work across agents, automation, and analytics.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} p={p} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    role: "Software Engineer",
    org: "MLGW",
    period: "2025 — Present",
    points: [
      "Build and maintain Java/Oracle systems for utility operations",
      "Automated address normalization checks and deliverability flags",
      "Improved reporting with Power BI and Python data tooling",
    ],
  },
  {
    role: "Graduate Projects",
    org: "Personal / Open-Source",
    period: "2023 — 2025",
    points: [
      "Explored AI agents and serverless patterns on AWS",
      "Developed internal tools for data parsing and job orchestration",
    ],
  },
];

function Experience() {
  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Experience</h2>
          <div className="mt-8 relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" aria-hidden />
            <ul className="space-y-10">
              {EXPERIENCE.map((e, i) => (
                <li key={i} className="relative pl-12">
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gradient-to-br ${ACCENT} shadow`} aria-hidden />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {e.role} · {e.org}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{e.period}</p>
                  <ul className="mt-2 list-disc pl-6 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                    {e.points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Contact</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">Have a project or idea? Let’s talk.</p>
          <form
            className="mt-8 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget as HTMLFormElement);
              const name = data.get("name");
              const email = data.get("email");
              const message = data.get("message");
              // Minimal demo: open mailto with prefilled body (replace with Formspree / API in production)
              window.location.href = `mailto:harisravan@example.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(
                String(name || "")
              )}&body=${encodeURIComponent(String(message || ""))}%0D%0A%0D%0AReply%20to:%20${encodeURIComponent(String(email || ""))}`;
            }}
          >
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Tell me about your project"
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <a
                  href="https://github.com/your-github"
                  className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/your-linkedin"
                  className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a
                  href="mailto:harisravan@example.com"
                  className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
              <button
                type="submit"
                className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br ${ACCENT} shadow-lg shadow-cyan-500/10 hover:opacity-95 transition`}
              >
                Send
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-sm text-neutral-500 dark:text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {year} Hari Sravan. All rights reserved.</p>
        <p className="opacity-80">Built with React · Tailwind · Framer Motion</p>
      </div>
    </footer>
  );
}

function SEO() {
  // Note: In a real app, place these in index.html <head> or use react-helmet.
  useEffect(() => {
    document.title = "Hari Sravan — Software Engineer | AI & Cloud Enthusiast";

    const ensure = (selector: string, create: () => HTMLElement) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      return el as HTMLElement;
    };

    ensure('meta[name="description"]', () => {
      const m = document.createElement("meta");
      m.name = "description";
      m.content =
        "Portfolio of Hari Sravan, Software Engineer at MLGW. Java, Oracle SQL/PLSQL, AI agents, cloud, and modern software projects.";
      return m;
    });

    ensure('meta[property="og:title"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:title");
      m.setAttribute("content", "Hari Sravan — Portfolio");
      return m;
    });

    ensure('meta[property="og:description"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:description");
      m.setAttribute("content", "Java & Oracle engineer exploring AI agents and cloud. Projects, skills, and contact.");
      return m;
    });

    ensure('meta[property="og:image"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:image");
      m.setAttribute("content", HERO_IMG);
      return m;
    });
  }, []);
  return null;
}

export default function App() {
  const { dark, setDark } = useDarkModeDefault();

  // Smooth scrolling via CSS utility
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
  }, []);

  // Decorative parallax
  const decor = useMemo(() => <ParallaxDecor />, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-cyan-200 dark:selection:bg-cyan-600">
      <SEO />
      {decor}
      <Header onToggleTheme={() => setDark((d) => !d)} dark={dark} />

      <main className="mx-auto max-w-[110rem]">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
