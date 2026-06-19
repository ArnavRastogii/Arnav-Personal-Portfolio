import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Github, Linkedin, Mail, ExternalLink, Download, ArrowUp,
  ChevronRight, Code2, Briefcase, GraduationCap, Trophy,
  Users, Send, Menu, X, MapPin, Phone, Award, Star,
} from "lucide-react";

/* ─── Typing Hook ────────────────────────────────────────────────────── */
function useTypingEffect(strings: string[], speed = 75, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [si, setSi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = strings[si];
    const delay = del ? 38 : ci === cur.length ? pause : speed;
    const t = setTimeout(() => {
      if (!del && ci < cur.length) { setDisplayed(cur.slice(0, ci + 1)); setCi(c => c + 1); }
      else if (!del && ci === cur.length) { setDel(true); }
      else if (del && ci > 0) { setDisplayed(cur.slice(0, ci - 1)); setCi(c => c - 1); }
      else { setDel(false); setSi(i => (i + 1) % strings.length); }
    }, delay);
    return () => clearTimeout(t);
  }, [ci, del, si, strings, speed, pause]);
  return displayed;
}

/* ─── Counter Hook ───────────────────────────────────────────────────── */
function useCounter(target: number, duration = 2200, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let s = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, trigger]);
  return count;
}

/* ─── Mouse Position ─────────────────────────────────────────────────── */
function useMousePos() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

/* ─── FadeUp wrapper ─────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Section chrome ─────────────────────────────────────────────────── */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center mb-5">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-[0.18em] uppercase font-medium"
        style={{ background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.22)", color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace" }}>
        {children}
      </span>
    </div>
  );
}
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-[52px] font-extrabold leading-tight mb-3"
        style={{ fontFamily: "'Outfit',sans-serif", background: "linear-gradient(135deg,#f0f0ff 0%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {title}
      </h2>
      {sub && <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>{sub}</p>}
    </div>
  );
}

/* ─── Glow blob ──────────────────────────────────────────────────────── */
function Glow({ style }: { style: React.CSSProperties }) {
  return <div className="absolute rounded-full pointer-events-none" style={{ opacity: 0.13, ...style }} />;
}

/* ─── Particle canvas ────────────────────────────────────────────────── */
function Particles() {
  const cvs = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let raf = 0;
    const mouse = { x: -999, y: -999 };
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    type P = { x: number; y: number; vx: number; vy: number; r: number; o: number };
    const pts: P[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4, o: Math.random() * 0.45 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 90) { p.x -= dx * 0.012; p.y -= dy * 0.012; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,106,247,${p.o})`; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,106,247,${0.14 * (1 - d / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={cvs} className="absolute inset-0 pointer-events-none" />;
}

/* ─── Magnetic Button ────────────────────────────────────────────────── */
function MagBtn({ children, primary, ghost, onClick, href, target }: {
  children: React.ReactNode; primary?: boolean; ghost?: boolean;
  onClick?: () => void; href?: string; target?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    setP({ x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28 });
  };
  const base = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium select-none";
  const sty: React.CSSProperties = {
    transform: `translate(${p.x}px,${p.y}px)`,
    transition: "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
    fontFamily: "'DM Sans',sans-serif",
    ...(primary
      ? { background: "linear-gradient(135deg,#7c6af7,#a78bfa)", color: "#fff", boxShadow: "0 4px 22px rgba(124,106,247,.38)" }
      : ghost
      ? { background: "transparent", color: "#8888aa", border: "1px solid rgba(255,255,255,.1)" }
      : { background: "rgba(255,255,255,.06)", color: "#f0f0ff", border: "1px solid rgba(255,255,255,.09)" }),
  };
  if (href) return (
    <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} target={target}
      rel="noreferrer" className={base} style={sty} onMouseMove={onMove} onMouseLeave={() => setP({ x: 0, y: 0 })}>
      {children}
    </a>
  );
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick}
      className={base} style={sty} onMouseMove={onMove} onMouseLeave={() => setP({ x: 0, y: 0 })}>
      {children}
    </button>
  );
}

/* ─── Nav Dock ───────────────────────────────────────────────────────── */
const NAV = [
  { id: "hero", label: "Home" }, { id: "about", label: "About" },
  { id: "skills", label: "Skills" }, { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" }, { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];
function NavDock({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return (
    <>
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-3 py-2 rounded-2xl"
        style={{ background: "rgba(10,10,20,.78)", backdropFilter: "blur(22px)", border: "1px solid rgba(255,255,255,.07)", boxShadow: "0 8px 32px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.04)" }}>
        <span className="text-sm font-black text-white/60 px-2 mr-1 tracking-wider" style={{ fontFamily: "'Outfit',sans-serif" }}>AR</span>
        <div className="w-px h-4 bg-white/10" />
        {NAV.map(n => (
          <button key={n.id} onClick={() => go(n.id)}
            className="relative px-3 py-1.5 text-[13px] rounded-xl transition-colors"
            style={{ fontFamily: "'DM Sans',sans-serif", color: active === n.id ? "#fff" : "rgba(255,255,255,.45)" }}>
            {active === n.id && (
              <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl"
                style={{ background: "rgba(124,106,247,.16)", border: "1px solid rgba(124,106,247,.3)" }}
                transition={{ type: "spring", bounce: 0.22, duration: 0.4 }} />
            )}
            <span className="relative">{n.label}</span>
          </button>
        ))}
      </motion.nav>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="fixed top-4 right-4 z-50 md:hidden">
        <button onClick={() => setOpen(!open)} className="p-2.5 rounded-xl"
          style={{ background: "rgba(10,10,20,.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.08)" }}>
          {open ? <X size={20} color="#f0f0ff" /> : <Menu size={20} color="#f0f0ff" />}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              className="absolute top-12 right-0 flex flex-col gap-1 p-2 rounded-2xl w-44"
              style={{ background: "rgba(10,10,20,.96)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.08)" }}>
              {NAV.map(n => (
                <button key={n.id} onClick={() => go(n.id)}
                  className="text-left px-3 py-2 rounded-xl text-sm transition-all"
                  style={{ color: active === n.id ? "#fff" : "rgba(255,255,255,.55)", background: active === n.id ? "rgba(124,106,247,.18)" : "transparent", fontFamily: "'DM Sans',sans-serif" }}>
                  {n.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════ */
function Hero() {
  const typed = useTypingEffect(["Full Stack Developer", "MERN Stack Developer", "Operations Enthusiast", "Problem Solver"]);
  const mouse = useMousePos();
  const rx = (mouse.y / (window.innerHeight || 1) - 0.5) * 5;
  const ry = (mouse.x / (window.innerWidth || 1) - 0.5) * 5;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Particles />
      <Glow style={{ left: "8%", top: "15%", width: 520, height: 520, background: "radial-gradient(circle,#7c6af7,transparent 70%)" }} />
      <Glow style={{ left: "65%", top: "55%", width: 400, height: 400, background: "radial-gradient(circle,#06b6d4,transparent 70%)" }} />
      <Glow style={{ left: "80%", top: "8%", width: 280, height: 280, background: "radial-gradient(circle,#a78bfa,transparent 70%)" }} />
      {/* grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(124,106,247,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(124,106,247,.035) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* — Text side — */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] mb-6 tracking-widest uppercase"
              style={{ background: "rgba(124,106,247,.1)", border: "1px solid rgba(124,106,247,.28)", color: "#a78bfa", fontFamily: "'JetBrains Mono',monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Open to Opportunities · Bareilly, UP
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-none mb-3"
              style={{ fontFamily: "'Outfit',sans-serif" }}>
              <span style={{ background: "linear-gradient(135deg,#f0f0ff 15%,#c4bcfc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Arnav</span>
              <br />
              <span style={{ background: "linear-gradient(135deg,#7c6af7 0%,#a78bfa 55%,#06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Rastogi</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="flex items-center gap-2 justify-center lg:justify-start mt-4 mb-7 h-9">
              <span className="text-xl font-medium" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>I am a</span>
              <span className="text-xl font-semibold" style={{ color: "#a78bfa", fontFamily: "'Outfit',sans-serif" }}>
                {typed}<span className="animate-pulse">|</span>
              </span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }}
              className="text-base md:text-[17px] max-w-lg mx-auto lg:mx-0 mb-9 leading-relaxed"
              style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
              B.Tech CSE student at <strong style={{ color: "#c4bcfc" }}>Invertis University (2022–2026)</strong> with hands-on internship experience at <strong style={{ color: "#c4bcfc" }}>Softpro Technologies</strong> & <strong style={{ color: "#c4bcfc" }}>Infosys Springboard</strong>. Building scalable MERN apps and solving real-world problems.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <MagBtn primary onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                View Projects <ChevronRight size={15} />
              </MagBtn>
              <MagBtn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Contact Me <Mail size={15} />
              </MagBtn>
              <MagBtn ghost href="/src/imports/Arnav-1.pdf" target="_blank">
                Resume <Download size={15} />
              </MagBtn>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              className="flex items-center gap-5 justify-center lg:justify-start mt-9">
              {[
                { icon: <Github size={17} />, href: "https://github.com/ArnavRastogii", label: "GitHub" },
                { icon: <Linkedin size={17} />, href: "https://www.linkedin.com/in/arnavrastogi192", label: "LinkedIn" },
                { icon: <Mail size={17} />, href: "mailto:arnavrastogi.official@gmail.com", label: "Email" },
                { icon: <Phone size={17} />, href: "tel:+918630599136", label: "+91 86305 99136" },
              ].map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer" title={s.label}
                  className="flex items-center gap-1.5 text-sm transition-all hover:text-white group"
                  style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                  <span className="group-hover:text-[#a78bfa] transition-colors">{s.icon}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </a>
              ))}
            </motion.div>
          </div>

          {/* — Avatar card — */}
          <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-shrink-0"
            style={{ transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`, transition: "transform 0.15s ease-out" }}>
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg,rgba(124,106,247,.22),rgba(6,182,212,.1))", border: "1px solid rgba(124,106,247,.22)", boxShadow: "0 0 60px rgba(124,106,247,.18),0 0 120px rgba(124,106,247,.06)" }}>
              <img src="src\imports\Profile Pic.png"
                alt="Arnav Rastogi" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(6,6,15,.55) 0%,transparent 55%)" }} />
            </div>
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
              className="absolute -top-4 -right-6 px-3 py-2 rounded-xl text-[11px] font-medium flex items-center gap-2"
              style={{ background: "rgba(10,10,20,.9)", border: "1px solid rgba(124,106,247,.3)", color: "#f0f0ff", fontFamily: "'JetBrains Mono',monospace", backdropFilter: "blur(12px)" }}>
              ⚡ MERN Stack
            </motion.div>
            <motion.div animate={{ y: [4, -4, 4] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-6 px-3 py-2 rounded-xl text-[11px] font-medium flex items-center gap-2"
              style={{ background: "rgba(10,10,20,.9)", border: "1px solid rgba(6,182,212,.3)", color: "#f0f0ff", fontFamily: "'JetBrains Mono',monospace", backdropFilter: "blur(12px)" }}>
              🎓 B.Tech CSE '26
            </motion.div>
            <motion.div animate={{ x: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute top-1/2 -left-8 -translate-y-1/2 px-3 py-2 rounded-xl text-[11px] font-medium"
              style={{ background: "rgba(10,10,20,.9)", border: "1px solid rgba(167,139,250,.3)", color: "#f0f0ff", fontFamily: "'JetBrains Mono',monospace", backdropFilter: "blur(12px)" }}>
              📍 Bareilly, UP
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-[#7c6af7] to-transparent" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════════════════ */
function About() {
  const timeline = [
    { year: "2020", label: "10th — Jingle Bells Public School", desc: "Completed Higher Secondary with strong academics. First steps into technology and computers.", color: "#7c6af7" },
    { year: "2022", label: "12th — Jingle Bells Public School", desc: "Completed Senior Secondary. Started B.Tech CSE at Invertis University, Bareilly.", color: "#06b6d4" },
    { year: "2023", label: "Placement Coordinator", desc: "Appointed Student Placement Coordinator at Invertis University; coordinated drives for 100+ students across recruiters and HR teams.", color: "#a78bfa" },
    { year: "2025", label: "Softpro Technologies — MERN Intern", desc: "Worked as MERN Stack Developer Intern in Noida. Built REST APIs, implemented MongoDB CRUD, and collaborated on production apps.", color: "#f472b6" },
    { year: "2025", label: "Infosys Springboard — FS Intern", desc: "Full Stack Developer Virtual Intern. Strengthened full-stack workflows, database operations, and analytical problem solving.", color: "#34d399" },
    { year: "2026", label: "B.Tech CSE — Graduating", desc: "Completing Bachelor of Technology in Computer Science & Engineering at Invertis University.", color: "#fb923c" },
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <Glow style={{ left: "75%", top: "20%", width: 520, height: 520, background: "radial-gradient(circle,#06b6d4,transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp><Chip>01 — About Me</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="Engineered for Impact" sub="A full-stack developer who thinks in systems — from schema design to pixel-perfect UI." /></FadeUp>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeUp delay={0.2}>
            <div className="space-y-5">
              <p className="text-[17px] leading-relaxed" style={{ color: "#c4bcfc", fontFamily: "'DM Sans',sans-serif" }}>
                I&apos;m <strong style={{ color: "#f0f0ff" }}>Arnav Rastogi</strong> — a B.Tech CSE student at <strong style={{ color: "#f0f0ff" }}>Invertis University, Bareilly</strong> (2022–2026), building production-grade MERN stack applications.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                I&apos;ve interned at <strong style={{ color: "#a78bfa" }}>Softpro Technologies Pvt. Ltd</strong> (Noida) as a MERN Stack Developer and at <strong style={{ color: "#a78bfa" }}>Infosys Springboard</strong> as a Full Stack Developer Intern — working on real-world REST APIs, MongoDB operations, and frontend-backend integration.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                Beyond code, I&apos;ve served as <strong style={{ color: "#c4bcfc" }}>Student Placement Coordinator</strong> at Invertis University — driving placement operations for 100+ students, managing recruiter communication, and streamlining tracking and reporting.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3">
                {[
                  { k: "Location", v: "Bareilly, Uttar Pradesh" },
                  { k: "Degree", v: "B.Tech CSE (2022–2026)" },
                  { k: "University", v: "Invertis University" },
                  { k: "Email", v: "arnavrastogi.official" },
                  { k: "GitHub", v: "ArnavRastogii" },
                  { k: "Phone", v: "+91 86305 99136" },
                ].map(item => (
                  <div key={item.k} className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                    <div className="text-[10px] mb-1 tracking-[0.15em] uppercase" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>{item.k}</div>
                    <div className="text-sm font-medium" style={{ color: "#f0f0ff", fontFamily: "'DM Sans',sans-serif" }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="relative pl-7">
              <div className="absolute left-0 top-2 bottom-2 w-px"
                style={{ background: "linear-gradient(to bottom,transparent,#7c6af7 12%,#7c6af7 88%,transparent)" }} />
              {timeline.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }} viewport={{ once: true }}
                  className="relative pl-5 pb-8 last:pb-0">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full -translate-x-[calc(50%+0.5px)]"
                    style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: t.color, fontFamily: "'JetBrains Mono',monospace" }}>{t.year}</span>
                    <span className="text-sm font-semibold" style={{ color: "#f0f0ff", fontFamily: "'Outfit',sans-serif" }}>{t.label}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════════════════════════════ */
const ALL_SKILLS = [
  { name: "React.js", color: "#61DAFB", cat: "Frontend" },
  { name: "JavaScript", color: "#F7DF1E", cat: "Frontend" },
  { name: "HTML5 / CSS3", color: "#E34F26", cat: "Frontend" },
  { name: "Tailwind CSS", color: "#38BDF8", cat: "Frontend" },
  { name: "Bootstrap", color: "#7952B3", cat: "Frontend" },
  { name: "Node.js", color: "#68A063", cat: "Backend" },
  { name: "Express.js", color: "#a0a0a0", cat: "Backend" },
  { name: "REST APIs", color: "#a78bfa", cat: "Backend" },
  { name: "MongoDB", color: "#47A248", cat: "Database" },
  { name: "MySQL", color: "#336791", cat: "Database" },
  { name: "Java", color: "#ED8B00", cat: "Language" },
  { name: "C", color: "#00599C", cat: "Language" },
  { name: "Git & GitHub", color: "#F05032", cat: "Tools" },
  { name: "VS Code", color: "#007ACC", cat: "Tools" },
  { name: "Figma", color: "#F24E1E", cat: "Tools" },
  { name: "MS Office Suite", color: "#217346", cat: "Tools" },
  { name: "Power BI", color: "#F2C811", cat: "Tools" },
  { name: "ThingWorx (IIoT)", color: "#00b4d8", cat: "IIoT" },
  { name: "Team Leadership", color: "#fb923c", cat: "Soft Skills" },
  { name: "Communication", color: "#f472b6", cat: "Soft Skills" },
  { name: "Time Management", color: "#34d399", cat: "Soft Skills" },
  { name: "Collaboration", color: "#818cf8", cat: "Soft Skills" },
];

function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const cats = [...new Set(ALL_SKILLS.map(s => s.cat))];

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <Glow style={{ left: "5%", top: "40%", width: 420, height: 420, background: "radial-gradient(circle,#7c6af7,transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp><Chip>02 — Skills</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="Technical Arsenal" sub="Languages, frameworks, tools, and soft skills from resume — accurate and complete." /></FadeUp>
        <div className="space-y-10">
          {cats.map((cat, ci) => (
            <FadeUp key={cat} delay={ci * 0.07}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>{cat}</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.05)" }} />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {ALL_SKILLS.filter(s => s.cat === cat).map(sk => (
                    <motion.button key={sk.name}
                      onClick={() => setActive(active === sk.name ? null : sk.name)}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
                      style={{
                        background: active === sk.name ? `${sk.color}18` : "rgba(255,255,255,.04)",
                        border: `1px solid ${active === sk.name ? sk.color + "50" : "rgba(255,255,255,.07)"}`,
                        color: active === sk.name ? sk.color : "#c4bcfc",
                        fontFamily: "'DM Sans',sans-serif",
                        boxShadow: active === sk.name ? `0 0 18px ${sk.color}22` : "none",
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sk.color }} />
                      {sk.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   EXPERIENCE (Internships + Placement Coord)
═══════════════════════════════════════════════════════════════════════ */
const EXP = [
  {
    period: "Jun 2025 – Aug 2025",
    location: "Noida, India",
    title: "MERN Stack Developer Intern",
    org: "Softpro Technologies Pvt. Ltd",
    color: "#7c6af7",
    icon: <Code2 size={15} />,
    bullets: [
      "Developed and maintained MERN-based web applications.",
      "Designed and integrated REST APIs for data management.",
      "Implemented CRUD operations using MongoDB.",
      "Collaborated with dev teams to debug and optimize performance.",
      "Participated in project planning and requirement analysis.",
    ],
  },
  {
    period: "Oct 2025 – Dec 2025",
    location: "Remote",
    title: "Full Stack Developer Intern (Virtual)",
    org: "Infosys Springboard",
    color: "#06b6d4",
    icon: <Briefcase size={15} />,
    bullets: [
      "Developed applications using frontend and backend technologies.",
      "Performed database operations and CRUD functionalities.",
      "Strengthened analytical thinking and workflow management skills.",
      "Worked on structured tasks requiring consistency and attention to detail.",
    ],
  },
  {
    period: "2023 – 2026",
    location: "Invertis University",
    title: "Student Placement Coordinator",
    org: "Invertis University, Bareilly",
    color: "#a78bfa",
    icon: <Users size={15} />,
    bullets: [
      "Coordinated placement drives involving 100+ students.",
      "Managed communication with recruiters and HR teams.",
      "Improved placement process tracking and reporting.",
      "Served as the primary student–company liaison.",
    ],
  },
];

function Experience() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <Glow style={{ left: "85%", top: "50%", width: 420, height: 420, background: "radial-gradient(circle,#f472b6,transparent 70%)" }} />
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp><Chip>03 — Experience</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="Professional Journey" sub="Internships and leadership roles — real experience, real impact." /></FadeUp>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom,transparent,#7c6af7 8%,#7c6af7 92%,transparent)" }} />
          <div className="space-y-8">
            {EXP.map((e, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <motion.div whileHover={{ x: 3 }} className="relative pl-20">
                  {/* node */}
                  <div className="absolute left-0 top-4 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center ml-[calc(32px-18px)]"
                      style={{ background: `${e.color}1a`, border: `1px solid ${e.color}45`, color: e.color }}>
                      {e.icon}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl transition-all duration-300"
                    style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-base font-bold" style={{ color: "#f0f0ff", fontFamily: "'Outfit',sans-serif" }}>{e.title}</h3>
                        <p className="text-sm" style={{ color: e.color, fontFamily: "'DM Sans',sans-serif" }}>{e.org}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] px-2 py-1 rounded-lg mb-1 inline-block"
                          style={{ background: `${e.color}15`, color: e.color, fontFamily: "'JetBrains Mono',monospace" }}>{e.period}</div>
                        <div className="flex items-center gap-1 text-[11px] justify-end" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>
                          <MapPin size={10} />{e.location}
                        </div>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed"
                          style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                          <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: e.color }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    title: "SkillBridge",
    sub: "MERN-based NGO Volunteer Management Platform",
    period: "Oct 2025 – Dec 2025",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    bullets: [
      "Built NGO-volunteer connection platform using MERN stack",
      "Implemented role-based authentication and project listings",
      "Designed scalable architecture for future feature integration",
      "Focused on real-world problem solving and database-driven workflows",
    ],
    gradient: "from-violet-600/20 to-indigo-600/20",
    accent: "#7c6af7",
    icon: "🤝",
    github: "https://github.com/ArnavRastogii",
     liveDemo: "https://bridge-509qi6l0j-arnav-rastogis-projects.vercel.app/"
  },
  {
    title: "MERN Matrimonial Platform",
    sub: "Responsive matrimonial web application with modern UI",
    period: "Jul 2025 – Aug 2025",
    tags: ["React.js", "Bootstrap", "Node.js", "Express.js", "MongoDB"],
    bullets: [
      "Developed a responsive matrimonial app with modern UI",
      "Implemented authentication, profile management, and dynamic user interaction",
      "Integrated frontend with backend APIs for seamless data handling",
      "Improved navigation and mobile responsiveness",
    ],
    gradient: "from-pink-600/20 to-rose-600/20",
    accent: "#f472b6",
    icon: "💍",
    github: "https://github.com/ArnavRastogii/ShaadiMatch",
     liveDemo: "https://shaadi-match.vercel.app/"
  },
  {
    title: "Portfolio Website",
    sub: "Premium futuristic personal portfolio — this very site",
    period: "2025",
    tags: ["React.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    bullets: [
      "Modern UI/UX with kinetic dark aesthetic",
      "Particle field, magnetic buttons, and scroll animations",
      "Performance-optimized, SEO-friendly",
      "Fully responsive across all viewports",
    ],
    gradient: "from-cyan-600/20 to-teal-600/20",
    accent: "#06b6d4",
    icon: "🚀",
    github: "https://github.com/ArnavRastogii",
  },
];

function Projects() {
  const [hov, setHov] = useState<number | null>(null);
  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <Glow style={{ left: "45%", top: "10%", width: 600, height: 600, background: "radial-gradient(circle,#a78bfa,transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp><Chip>04 — Projects</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="Featured Work" sub="Real-world applications built independently — shipped with attention to detail." /></FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.1}>
              <motion.div
                onHoverStart={() => setHov(i)} onHoverEnd={() => setHov(null)}
                whileHover={{ y: -7 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl overflow-hidden flex flex-col h-full"
                style={{
                  background: "rgba(255,255,255,.03)",
                  border: hov === i ? `1px solid ${p.accent}45` : "1px solid rgba(255,255,255,.07)",
                  boxShadow: hov === i ? `0 0 40px ${p.accent}12` : "none",
                  transition: "border 0.25s,box-shadow 0.25s",
                }}>
                {/* header */}
                <div className={`h-36 bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}>
                  <motion.span className="text-5xl" animate={hov === i ? { scale: 1.2, rotate: 8 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.3 }}>
                    {p.icon}
                  </motion.span>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,transparent 40%,rgba(6,6,15,.7))" }} />
                  <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-lg"
                    style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}30`, fontFamily: "'JetBrains Mono',monospace" }}>
                    {p.period}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold mb-0.5" style={{ color: "#f0f0ff", fontFamily: "'Outfit',sans-serif" }}>{p.title}</h3>
                  <p className="text-[12px] mb-3" style={{ color: p.accent, fontFamily: "'DM Sans',sans-serif" }}>{p.sub}</p>

                  <ul className="space-y-1.5 mb-4 flex-1">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[12px] leading-relaxed"
                        style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.accent }} />{b}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-lg"
                        style={{ background: "rgba(255,255,255,.05)", color: "#8888aa", border: "1px solid rgba(255,255,255,.07)", fontFamily: "'JetBrains Mono',monospace" }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <a href={p.liveDemo} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg transition-all hover:opacity-75"
                      style={{ background: `${p.accent}1a`, color: p.accent, border: `1px solid ${p.accent}35`, fontFamily: "'DM Sans',sans-serif" }}>
                      <ExternalLink size={11} /> Live Demo
                    </a>
                    <a href={p.github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg transition-all hover:opacity-75"
                      style={{ background: "rgba(255,255,255,.05)", color: "#8888aa", border: "1px solid rgba(255,255,255,.08)", fontFamily: "'DM Sans',sans-serif" }}>
                      <Github size={11} /> GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CERTIFICATIONS
═══════════════════════════════════════════════════════════════════════ */
const CERTS = [
  { name: "Microsoft Office", issuer: "LinkedIn Learning", year: "2024", color: "#0078D4", icon: "📊" },
  { name: "Web Development", issuer: "IBM SkillsBuild", year: "2025", color: "#1261FE", icon: "💻" },
  { name: "Power BI", issuer: "DUCAT Institute", year: "2025", color: "#F2C811", icon: "📈" },
  { name: "Career Essentials in GitHub", issuer: "Microsoft", year: "2024", color: "#F05032", icon: "🐙" },
];

function Certifications() {
  return (
    <section className="relative py-24 overflow-hidden">
      <Glow style={{ left: "20%", top: "50%", width: 380, height: 380, background: "radial-gradient(circle,#818cf8,transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp><Chip>05 — Certifications</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="Certified & Verified" sub="Industry-recognized certifications from top platforms." /></FadeUp>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CERTS.map((c, i) => (
            <FadeUp key={c.name} delay={i * 0.08}>
              <motion.div whileHover={{ y: -5, scale: 1.02 }} className="p-5 rounded-2xl flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.icon}</span>
                  <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-0.5" style={{ color: "#f0f0ff", fontFamily: "'Outfit',sans-serif" }}>{c.name}</h4>
                  <p className="text-[12px]" style={{ color: c.color, fontFamily: "'DM Sans',sans-serif" }}>{c.issuer}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={11} style={{ color: "#8888aa" }} />
                  <span className="text-[11px]" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>{c.year}</span>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ACHIEVEMENTS / STATS
═══════════════════════════════════════════════════════════════════════ */
const STATS = [
  { label: "Students Coordinated", value: 100, suffix: "+", icon: <Users size={20} />, color: "#7c6af7" },
  { label: "Projects Completed", value: 2, suffix: "+", icon: <Code2 size={20} />, color: "#06b6d4" },
  { label: "Certifications Earned", value: 4, suffix: "", icon: <Trophy size={20} />, color: "#a78bfa" },
  { label: "Technologies Used", value: 20, suffix: "+", icon: <Star size={20} />, color: "#f472b6" },
];

function StatCard({ s, trigger }: { s: typeof STATS[0]; trigger: boolean }) {
  const c = useCounter(s.value, 2000, trigger);
  return (
    <motion.div whileHover={{ scale: 1.04, y: -5 }}
      className="relative p-8 rounded-2xl flex flex-col items-center text-center overflow-hidden group"
      style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%,${s.color}0c,transparent 70%)` }} />
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
      <div className="text-5xl font-extrabold mb-2"
        style={{ fontFamily: "'Outfit',sans-serif", background: `linear-gradient(135deg,#f0f0ff,${s.color})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {c}{s.suffix}
      </div>
      <div className="text-sm" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>{s.label}</div>
    </motion.div>
  );
}

function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="achievements" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%,rgba(124,106,247,.05),transparent)" }} />
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp><Chip>06 — Achievements</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="By the Numbers" sub="Metrics that reflect consistent effort, real responsibility, and measurable impact." /></FadeUp>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.1}>
              <StatCard s={s} trigger={inView} />
            </FadeUp>
          ))}
        </div>

        {/* Placement highlight */}
        <FadeUp delay={0.4}>
          <div className="mt-10 p-8 rounded-2xl"
            style={{ background: "rgba(124,106,247,.06)", border: "1px solid rgba(124,106,247,.18)" }}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,106,247,.15)", color: "#a78bfa" }}>
                <GraduationCap size={22} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold mb-1" style={{ color: "#f0f0ff", fontFamily: "'Outfit',sans-serif" }}>
                  Student Placement Coordinator — Invertis University
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                  Coordinated placement drives for <strong style={{ color: "#a78bfa" }}>100+ students</strong>, managed recruiter and HR communications, and improved placement tracking and reporting infrastructure across the department.
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name: "Softpro Technologies Team", role: "MERN Internship Supervisor · Noida", text: "Arnav demonstrated strong initiative during his MERN internship. He grasped our API architecture quickly, delivered clean MongoDB integrations, and collaborated seamlessly with the senior development team.", avatar: "ST", color: "#7c6af7" },
  { name: "Invertis University Faculty", role: "Department, B.Tech CSE", text: "As our Student Placement Coordinator, Arnav showed exceptional organizational maturity. He managed 100+ students' placement data and liaised with HR teams professionally, well beyond his academic year.", avatar: "IU", color: "#06b6d4" },
  { name: "Infosys Springboard Mentor", role: "Full Stack Internship · Remote", text: "Arnav's attention to structured project delivery during the virtual internship was commendable. His analytical thinking and consistency in database-driven tasks impressed the evaluation panel.", avatar: "IS", color: "#a78bfa" },
];

function Testimonials() {
  const [act, setAct] = useState(0);
  useEffect(() => { const t = setInterval(() => setAct(a => (a + 1) % TESTIMONIALS.length), 4200); return () => clearInterval(t); }, []);
  return (
    <section className="relative py-24 overflow-hidden">
      <Glow style={{ left: "15%", top: "30%", width: 380, height: 380, background: "radial-gradient(circle,#06b6d4,transparent 70%)" }} />
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp><Chip>07 — Testimonials</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="What They Say" /></FadeUp>
        <AnimatePresence mode="wait">
          <motion.div key={act} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.38 }}
            className="p-10 md:p-12 rounded-3xl text-center mx-auto max-w-2xl"
            style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${TESTIMONIALS[act].color}28`, backdropFilter: "blur(18px)", boxShadow: `0 0 60px ${TESTIMONIALS[act].color}0c` }}>
            <div className="text-5xl mb-5" style={{ color: TESTIMONIALS[act].color, opacity: 0.35 }}>&ldquo;</div>
            <p className="text-[17px] leading-relaxed mb-8" style={{ color: "#c4bcfc", fontFamily: "'DM Sans',sans-serif" }}>{TESTIMONIALS[act].text}</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: `${TESTIMONIALS[act].color}1a`, color: TESTIMONIALS[act].color, border: `1px solid ${TESTIMONIALS[act].color}38`, fontFamily: "'Outfit',sans-serif" }}>
                {TESTIMONIALS[act].avatar}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold" style={{ color: "#f0f0ff", fontFamily: "'DM Sans',sans-serif" }}>{TESTIMONIALS[act].name}</div>
                <div className="text-[11px]" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>{TESTIMONIALS[act].role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-7">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setAct(i)} className="rounded-full transition-all duration-300"
              style={{ width: act === i ? 22 : 7, height: 7, background: act === i ? "#7c6af7" : "rgba(255,255,255,.14)" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("sending");
    await new Promise(r => setTimeout(r, 1400));
    setStatus("success");
    setTimeout(() => setStatus("idle"), 4500);
    setForm({ name: "", email: "", message: "" });
  };

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
    color: "#f0f0ff", fontFamily: "'DM Sans',sans-serif", outline: "none",
    transition: "border 0.2s",
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <Glow style={{ left: "55%", top: "40%", width: 500, height: 500, background: "radial-gradient(circle,#7c6af7,transparent 70%)" }} />
      <div className="max-w-5xl mx-auto px-6">
        <FadeUp><Chip>08 — Contact</Chip></FadeUp>
        <FadeUp delay={0.1}><SectionHead title="Let's Build Together" sub="Got a project, an opportunity, or just want to say hi?" /></FadeUp>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <FadeUp delay={0.2}>
            <div className="space-y-5">
              <p className="text-base leading-relaxed" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
                I&apos;m open to full-stack engineering roles, freelance projects, and exciting collaborations. Usually reply within 24 hours.
              </p>
              {[
                { icon: <Mail size={15} />, label: "Email", value: "arnavrastogi.official@gmail.com", href: "mailto:arnavrastogi.official@gmail.com", color: "#7c6af7" },
                { icon: <Phone size={15} />, label: "Phone", value: "+91 86305 99136", href: "tel:+918630599136", color: "#06b6d4" },
                { icon: <Linkedin size={15} />, label: "LinkedIn", value: "linkedin.com/in/arnavrastogi192", href: "https://www.linkedin.com/in/arnavrastogi192", color: "#a78bfa" },
                { icon: <Github size={15} />, label: "GitHub", value: "github.com/ArnavRastogii", href: "https://github.com/ArnavRastogii", color: "#f472b6" },
                { icon: <MapPin size={15} />, label: "Location", value: "Bareilly, Uttar Pradesh, India", href: "#", color: "#34d399" },
              ].map(c => (
                <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${c.color}15`, color: c.color }}>{c.icon}</div>
                  <div>
                    <div className="text-[10px] mb-0.5 tracking-widest uppercase" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>{c.label}</div>
                    <div className="text-sm break-all" style={{ color: "#f0f0ff", fontFamily: "'DM Sans',sans-serif" }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <form onSubmit={submit} className="space-y-4 p-8 rounded-2xl"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", backdropFilter: "blur(10px)" }}>
              {[{ k: "name", label: "Name", type: "text", ph: "Your full name" }, { k: "email", label: "Email", type: "email", ph: "arnavrastogi.official@gmail.com" }].map(f => (
                <div key={f.k}>
                  <label className="block text-[10px] mb-2 tracking-[0.15em] uppercase" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.k as keyof typeof form]}
                    onChange={e => setForm(v => ({ ...v, [f.k]: e.target.value }))} required
                    className="w-full px-4 py-3 rounded-xl text-sm" style={inputBase}
                    onFocus={e => (e.target.style.borderColor = "rgba(124,106,247,.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.08)")} />
                </div>
              ))}
              <div>
                <label className="block text-[10px] mb-2 tracking-[0.15em] uppercase" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>Message</label>
                <textarea rows={4} placeholder="Tell me about your project or opportunity..." value={form.message}
                  onChange={e => setForm(v => ({ ...v, message: e.target.value }))} required
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none" style={inputBase}
                  onFocus={e => (e.target.style.borderColor = "rgba(124,106,247,.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,.08)")} />
              </div>
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-4 rounded-xl text-sm"
                    style={{ background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.28)", color: "#34d399", fontFamily: "'DM Sans',sans-serif" }}>
                    ✓ Sent! I&apos;ll get back to you within 24 hours.
                  </motion.div>
                ) : (
                  <motion.button key="btn" type="submit" disabled={status === "sending"}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#7c6af7,#a78bfa)", color: "#fff", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 22px rgba(124,106,247,.32)" }}>
                    {status === "sending"
                      ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>⟳</motion.span> Sending...</>
                      : <><Send size={14} /> Send Message</>}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative border-t py-14" style={{ borderColor: "rgba(255,255,255,.05)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-black mb-1"
              style={{ fontFamily: "'Outfit',sans-serif", background: "linear-gradient(135deg,#7c6af7,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Arnav Rastogi
            </div>
            <div className="text-sm" style={{ color: "#8888aa", fontFamily: "'DM Sans',sans-serif" }}>
              Full Stack Developer · B.Tech CSE · Bareilly, UP
            </div>
            <div className="text-[11px] mt-1" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>
              arnavrastogi.official@gmail.com · +91 86305 99136
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: <Github size={17} />, href: "https://github.com/ArnavRastogii", label: "GitHub" },
              { icon: <Linkedin size={17} />, href: "https://www.linkedin.com/in/arnavrastogi192", label: "LinkedIn" },
              { icon: <Mail size={17} />, href: "mailto:arnavrastogi.official@gmail.com", label: "Email" },
            ].map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)", color: "#8888aa" }}>
                {s.icon}
              </a>
            ))}
            <a href="/src/imports/Arnav-1.pdf" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ml-1 transition-all hover:opacity-80"
              style={{ background: "rgba(124,106,247,.14)", border: "1px solid rgba(124,106,247,.28)", color: "#a78bfa", fontFamily: "'DM Sans',sans-serif" }}>
              <Download size={13} /> Resume
            </a>
          </div>
        </div>

        <div className="mt-8 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 border-t" style={{ borderColor: "rgba(255,255,255,.04)" }}>
          <p className="text-[11px]" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>
            © 2025 Arnav Rastogi — Invertis University · B.Tech CSE 2022–2026
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-[11px] transition-all hover:text-white group"
            style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>
            <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LOADING
═══════════════════════════════════════════════════════════════════════ */
function Loading({ onDone }: { onDone: () => void }) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setProg(p => {
        const next = p + Math.random() * 9 + 2;
        if (next >= 100) { clearInterval(t); setTimeout(onDone, 350); return 100; }
        return next;
      });
    }, 55);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <motion.div exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ background: "#06060f" }}>
      <Glow style={{ left: "15%", top: "25%", width: 400, height: 400, background: "radial-gradient(circle,#7c6af7,transparent 70%)" }} />
      <Glow style={{ left: "65%", top: "55%", width: 300, height: 300, background: "radial-gradient(circle,#06b6d4,transparent 70%)" }} />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="text-7xl font-black mb-3"
          style={{ fontFamily: "'Outfit',sans-serif", background: "linear-gradient(135deg,#7c6af7,#a78bfa,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          AR
        </div>
        <div className="text-xs mb-2 tracking-[0.22em] uppercase" style={{ color: "#8888aa", fontFamily: "'JetBrains Mono',monospace" }}>Arnav Rastogi</div>
        <div className="text-[10px] mb-8 tracking-[0.16em] uppercase" style={{ color: "#555566", fontFamily: "'JetBrains Mono',monospace" }}>B.Tech CSE · MERN Stack Developer</div>
        <div className="w-48 h-0.5 rounded-full overflow-hidden mx-auto" style={{ background: "rgba(255,255,255,.06)" }}>
          <motion.div className="h-full rounded-full" style={{ width: `${prog}%`, background: "linear-gradient(90deg,#7c6af7,#a78bfa)" }} />
        </div>
        <div className="text-xs mt-3" style={{ color: "#7c6af7", fontFamily: "'JetBrains Mono',monospace" }}>{Math.min(100, Math.round(prog))}%</div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════════════════════════════ */
function Cursor() {
  const m = useMousePos();
  const [click, setClick] = useState(false);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const show = () => setVis(true);
    const hide = () => setVis(false);
    const dn = () => setClick(true);
    const up = () => setClick(false);
    window.addEventListener("mousemove", show, { once: true });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
    };
  }, []);
  if (!vis) return null;
  return (
    <>
      <motion.div className="fixed pointer-events-none z-[200] hidden md:block rounded-full"
        animate={{ x: m.x - 5, y: m.y - 5, scale: click ? 0.55 : 1 }}
        transition={{ type: "spring", stiffness: 750, damping: 28 }}
        style={{ width: 10, height: 10, background: "#7c6af7", top: 0, left: 0 }} />
      <motion.div className="fixed pointer-events-none z-[199] hidden md:block rounded-full"
        animate={{ x: m.x - 17, y: m.y - 17, scale: click ? 0.75 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        style={{ width: 34, height: 34, border: "1px solid rgba(124,106,247,.45)", top: 0, left: 0, opacity: 0.5 }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("hero");
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => {
    const ids = NAV.map(n => n.id);
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="dark min-h-screen" style={{ fontFamily: "'DM Sans',sans-serif", background: "#06060f", cursor: "none" }}>
      <style>{`
        *{cursor:none!important}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(124,106,247,.28);border-radius:2px}
        ::selection{background:rgba(124,106,247,.28);color:#f0f0ff}
        input::placeholder,textarea::placeholder{color:#555566}
      `}</style>

      <AnimatePresence>{loading && <Loading onDone={done} />}</AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Cursor />
          <NavDock active={active} />
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Achievements />
          <Testimonials />
          <Contact />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
