"use client";
import { useState, useEffect, useRef } from "react";

const sprintsDef = [
  { id: "S1 (1-14)", label: "Sprint 1", range: "Día 1 – 14", order: 1 },
  { id: "S2 (15-28)", label: "Sprint 2", range: "Día 15 – 28", order: 2 },
  { id: "S3 (29-12)", label: "Sprint 3", range: "Día 29 – 12", order: 3 },
];

const statusColors = { "Done": { bg: "#ECFDF5", text: "#059669", dot: "#10B981" }, "In progress": { bg: "#EFF6FF", text: "#2563EB", dot: "#3B82F6" }, "Not started": { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" } };
const priorityColors = { "High": { bg: "#FEF2F2", text: "#DC2626" }, "Medium": { bg: "#FFFBEB", text: "#D97706" }, "Low": { bg: "#F0FDF4", text: "#16A34A" } };
const teamColors = { "Paid Media": "#8B5CF6", "SEO": "#06B6D4", "Product Marketing": "#F43F5E", "General": "#6B7280", "IA": "#F59E0B" };
const priorityOrder = { High: 0, Medium: 1, Low: 2 };
const allStatuses = ["Not started", "In progress", "Done"];
const allPriorities = ["High", "Medium", "Low"];
const allTeams = ["Paid Media", "SEO", "Product Marketing", "General", "IA"];

function Badge({ label, color, bg, onClick, active }) {
  return (<span onClick={onClick} style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, color, background: bg, cursor: onClick ? "pointer" : "default", outline: active ? "2px solid " + color : "none", outlineOffset: 1, transition: "all 0.2s" }}>{label}</span>);
}

function ProgressBar({ segments, total }) {
  return (<div style={{ display: "flex", height: 8, borderRadius: 100, overflow: "hidden", background: "#F1F5F9", width: "100%" }}>
    {segments.map((s, i) => <div key={i} style={{ width: (s.count / Math.max(total, 1)) * 100 + "%", background: s.color, transition: "width 0.5s ease" }} />)}
  </div>);
}

function DonutChart({ data, size, onSegment, activeIdxs }) {
  const sz = size || 150, total = data.reduce((a, b) => a + b.value, 0), r = sz / 2 - 14, circ = 2 * Math.PI * r;
  let offset = 0; const has = activeIdxs && activeIdxs.length > 0;
  return (<svg width={sz} height={sz} viewBox={"0 0 " + sz + " " + sz} style={{ cursor: "pointer" }}>
    {data.map((d, i) => { const dash = (d.value / total) * circ; const isA = !has || activeIdxs.includes(i);
      const seg = <circle key={i} cx={sz/2} cy={sz/2} r={r} fill="none" stroke={d.color} strokeWidth={isA && has ? 26 : 20} opacity={isA ? 1 : 0.25} strokeDasharray={dash + " " + (circ - dash)} strokeDashoffset={-offset} style={{ transition: "all 0.3s ease", cursor: "pointer" }} onClick={() => onSegment && onSegment(i)} />;
      offset += dash; return seg; })}
    <text x="50%" y="50%" textAnchor="middle" dy="0.35em" style={{ fontSize: 28, fontWeight: 700, fill: "#0F172A" }}>{total}</text>
  </svg>);
}

function StatCard({ label, value, sub, accent, onClick, active }) {
  return (<div onClick={onClick} style={{ background: active ? accent + "0D" : "#fff", borderRadius: 16, padding: "22px 24px", flex: 1, minWidth: 120, borderLeft: "4px solid " + accent, boxShadow: active ? "0 0 0 2px " + accent + "40" : "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.2s", userSelect: "none" }}>
    <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.02em", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>{sub}</div>}
  </div>);
}

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (<span onMouseEnter={() => text && setShow(true)} onMouseLeave={() => setShow(false)} onClick={(e) => { e.stopPropagation(); text && setShow(!show); }} style={{ position: "relative", display: "inline-flex", cursor: text ? "pointer" : "default" }}>
    {children}
    {show && text && (<span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#0F172A", color: "#fff", fontSize: 12, fontWeight: 400, lineHeight: 1.5, padding: "10px 14px", borderRadius: 10, width: 260, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.16)", pointerEvents: "none" }}>
      {text}<span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #0F172A" }} />
    </span>)}
  </span>);
}

function FilterDropdown({ label, options, selected, onToggle, colorMap, dotMap }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const count = selected.length;
  return (<div ref={ref} style={{ position: "relative" }}>
    <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: count > 0 ? "1.5px solid #3B82F6" : "1.5px solid #E2E8F0", background: count > 0 ? "#EFF6FF" : "#fff", fontSize: 13, fontWeight: 500, color: count > 0 ? "#1E40AF" : "#64748B", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
      {label}{count > 0 && <span style={{ background: "#3B82F6", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 100, padding: "1px 7px", lineHeight: "16px" }}>{count}</span>}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M3 4.5L6 7.5L9 4.5" stroke={count > 0 ? "#1E40AF" : "#94A3B8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && (<div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0", zIndex: 150, minWidth: 180, padding: "6px 0" }}>
      {options.map(opt => { const isOn = selected.includes(opt); const c = colorMap ? colorMap[opt] : null; const dot = dotMap ? dotMap[opt] : null;
        return (<div key={opt} onClick={() => onToggle(opt)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", background: isOn ? "#F8FAFC" : "transparent" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"} onMouseLeave={(e) => e.currentTarget.style.background = isOn ? "#F1F5F9" : "transparent"}>
          <div style={{ width: 18, height: 18, borderRadius: 5, border: isOn ? "none" : "2px solid #CBD5E1", background: isOn ? "#3B82F6" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {isOn && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          {dot && <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />}
          {c && !dot && <div style={{ width: 8, height: 8, borderRadius: 3, background: c, flexShrink: 0 }} />}
          <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{opt}</span>
        </div>); })}
    </div>)}
  </div>);
}

function FilterBar({ filters, setFilters, clearFilters, hasFilter }) {
  const toggle = (key, val) => { setFilters(f => { const arr = f[key]; return { ...f, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }; }); };
  return (<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, flexWrap: "wrap", padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><path d="M2 4h12M4 8h8M6 12h4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" /></svg>
    <FilterDropdown label="Estado" options={allStatuses} selected={filters.status} onToggle={(v) => toggle("status", v)} dotMap={{ "Done": "#10B981", "In progress": "#3B82F6", "Not started": "#9CA3AF" }} />
    <FilterDropdown label="Prioridad" options={allPriorities} selected={filters.priority} onToggle={(v) => toggle("priority", v)} dotMap={{ "High": "#EF4444", "Medium": "#F59E0B", "Low": "#22C55E" }} />
    <FilterDropdown label="Equipo" options={allTeams} selected={filters.team} onToggle={(v) => toggle("team", v)} colorMap={teamColors} />
    {hasFilter && (<button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 10, border: "1.5px solid #FEE2E2", background: "#FEF2F2", fontSize: 13, fontWeight: 500, color: "#DC2626", cursor: "pointer", marginLeft: "auto" }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" /></svg>Borrar filtros
    </button>)}
  </div>);
}

function TaskRow({ t, filters, setFilters }) {
  const sc = statusColors[t.status] || statusColors["Not started"], pc = priorityColors[t.priority] || priorityColors["Medium"];
  return (<div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", flexWrap: "wrap", gap: 10, overflow: "visible" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 220px", minWidth: 0, overflow: "visible" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 500, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: "1 1 auto", minWidth: 0 }}>{t.name}</span>
      {t.desc && (<Tooltip text={t.desc}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "#F1F5F9", flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#94A3B8" strokeWidth="1.5" fill="none" /><circle cx="7" cy="4.5" r="0.8" fill="#94A3B8" /><rect x="6.3" y="6" width="1.4" height="3.5" rx="0.7" fill="#94A3B8" /></svg>
      </span></Tooltip>)}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {t.team.map(tm => (<span key={tm} onClick={() => setFilters(f => { const a = f.team; return { ...f, team: a.includes(tm) ? a.filter(v => v !== tm) : [...a, tm] }; })} style={{ fontSize: 11, fontWeight: 500, color: teamColors[tm] || "#64748B", background: (teamColors[tm] || "#64748B") + "14", padding: "3px 10px", borderRadius: 100, cursor: "pointer", outline: filters.team.includes(tm) ? "2px solid " + teamColors[tm] : "none", outlineOffset: 1 }}>{tm}</span>))}
      <Badge label={t.status} color={sc.text} bg={sc.bg} active={filters.status.includes(t.status)} onClick={() => setFilters(f => { const a = f.status; return { ...f, status: a.includes(t.status) ? a.filter(v => v !== t.status) : [...a, t.status] }; })} />
      <Badge label={t.priority} color={pc.text} bg={pc.bg} active={filters.priority.includes(t.priority)} onClick={() => setFilters(f => { const a = f.priority; return { ...f, priority: a.includes(t.priority) ? a.filter(v => v !== t.priority) : [...a, t.priority] }; })} />
    </div>
  </div>);
}

function SprintSection({ sprint, tasks, filters, setFilters }) {
  const done = tasks.filter(t => t.status === "Done").length, inProg = tasks.filter(t => t.status === "In progress").length, notS = tasks.filter(t => t.status === "Not started").length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  const sorted = [...tasks].sort((a, b) => { const so = { "In progress": 0, "Not started": 1, "Done": 2 }; return so[a.status] !== so[b.status] ? so[a.status] - so[b.status] : (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1); });
  const isCurrent = sprint.order === 1;
  return (<div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
    {isCurrent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #3B82F6, #8B5CF6)" }} />}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{sprint.label}</span>
          {isCurrent && <span style={{ fontSize: 10, fontWeight: 600, color: "#3B82F6", background: "#EFF6FF", padding: "2px 10px", borderRadius: 100, textTransform: "uppercase" }}>Actual</span>}</div>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>{sprint.range}</span>
      </div>
      <div style={{ textAlign: "right" }}><span style={{ fontSize: 28, fontWeight: 700, color: "#0F172A" }}>{pct}%</span><div style={{ fontSize: 12, color: "#94A3B8" }}>{done}/{tasks.length} completadas</div></div>
    </div>
    <ProgressBar total={tasks.length || 1} segments={[{ count: done, color: "#10B981" }, { count: inProg, color: "#3B82F6" }, { count: notS, color: "#E2E8F0" }]} />
    <div style={{ display: "flex", gap: 16, marginTop: 10, marginBottom: 18 }}>
      {[{ l: "Done", c: "#10B981", n: done }, { l: "In progress", c: "#3B82F6", n: inProg }, { l: "Not started", c: "#CBD5E1", n: notS }].map(s => (<div key={s.l} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: s.c }} /><span style={{ fontSize: 11, color: "#64748B" }}>{s.n}</span></div>))}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sorted.map((t, i) => <TaskRow key={i} t={t} filters={filters} setFilters={setFilters} />)}
      {tasks.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "#CBD5E1", fontSize: 13 }}>Sin tareas asignadas</div>}
    </div>
  </div>);
}

export default function Dashboard() {
  const [view, setView] = useState("overview");
  const [filters, setFilters] = useState({ status: [], priority: [], team: [] });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks").then(r => r.json()).then(data => { if (Array.isArray(data)) setTasks(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const hasFilter = filters.status.length > 0 || filters.priority.length > 0 || filters.team.length > 0;
  const clearFilters = () => setFilters({ status: [], priority: [], team: [] });
  const applyFilters = (list) => list.filter(t => {
    if (filters.status.length > 0 && !filters.status.includes(t.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(t.priority)) return false;
    if (filters.team.length > 0 && !t.team.some(tm => filters.team.includes(tm))) return false;
    return true;
  });

  const filtered = applyFilters(tasks);
  const done = tasks.filter(t => t.status === "Done").length;
  const inProgress = tasks.filter(t => t.status === "In progress").length;
  const notStarted = tasks.filter(t => t.status === "Not started").length;
  const high = tasks.filter(t => t.priority === "High").length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const teamData = {};
  tasks.forEach(t => t.team.forEach(tm => { if (!teamData[tm]) teamData[tm] = { total: 0, done: 0, inProgress: 0, notStarted: 0 }; teamData[tm].total++; if (t.status === "Done") teamData[tm].done++; if (t.status === "In progress") teamData[tm].inProgress++; if (t.status === "Not started") teamData[tm].notStarted++; }));

  const donutData = [{ value: done, color: "#10B981", label: "Done" }, { value: inProgress, color: "#3B82F6", label: "In progress" }, { value: notStarted, color: "#CBD5E1", label: "Not started" }];
  const donutActiveIdxs = filters.status.length > 0 ? donutData.map((d, i) => filters.status.includes(d.label) ? i : -1).filter(i => i >= 0) : [];
  const toggleArr = (key, val) => setFilters(f => { const a = f[key]; return { ...f, [key]: a.includes(val) ? a.filter(v => v !== val) : [...a, val] }; });

  if (loading) return (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontSize: 16 }}>Cargando dashboard...</div>);

  return (<div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#F8FAFC", minHeight: "100vh", padding: "32px 24px" }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: pct >= 80 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#EF4444" }} />
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Q2 2026</span>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>Dashboard de Proyectos</h1>
      <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>Abril — Junio · Datos en vivo desde Notion</p>
    </div>

    <div style={{ display: "inline-flex", background: "#E2E8F0", borderRadius: 12, padding: 3, marginBottom: 20 }}>
      {[{ id: "overview", label: "Overview" }, { id: "sprints", label: "Sprints" }].map(v => (<button key={v.id} onClick={() => setView(v.id)} style={{ padding: "8px 24px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: view === v.id ? "#fff" : "transparent", color: view === v.id ? "#0F172A" : "#64748B", boxShadow: view === v.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>{v.label}</button>))}
    </div>

    <FilterBar filters={filters} setFilters={setFilters} clearFilters={clearFilters} hasFilter={hasFilter} />

    {view === "overview" && (<>
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard label="TODAS" value={tasks.length} sub="Total Q2" accent="#0F172A" active={!hasFilter} onClick={clearFilters} />
        <StatCard label="COMPLETADAS" value={done} sub={pct + "%"} accent="#10B981" active={filters.status.includes("Done")} onClick={() => toggleArr("status", "Done")} />
        <StatCard label="EN PROGRESO" value={inProgress} accent="#3B82F6" active={filters.status.includes("In progress")} onClick={() => toggleArr("status", "In progress")} />
        <StatCard label="NO INICIADAS" value={notStarted} accent="#94A3B8" active={filters.status.includes("Not started")} onClick={() => toggleArr("status", "Not started")} />
        <StatCard label="ALTA PRIORIDAD" value={high} accent="#EF4444" active={filters.priority.includes("High")} onClick={() => toggleArr("priority", "High")} />
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Progreso general</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#0F172A" }}>{pct}%</span>
        </div>
        <ProgressBar total={tasks.length} segments={[{ count: done, color: "#10B981" }, { count: inProgress, color: "#3B82F6" }, { count: notStarted, color: "#E2E8F0" }]} />
      </div>

      <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", flex: "1 1 260px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", alignSelf: "flex-start", marginBottom: 16 }}>Por status</span>
          <DonutChart data={donutData} activeIdxs={donutActiveIdxs} onSegment={(i) => toggleArr("status", donutData[i].label)} />
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {donutData.map((d, i) => (<div key={d.label} onClick={() => toggleArr("status", d.label)} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", opacity: donutActiveIdxs.length > 0 && !donutActiveIdxs.includes(i) ? 0.35 : 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} /><span style={{ fontSize: 11, color: "#64748B" }}>{d.value}</span></div>))}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", flex: "2 1 400px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", display: "block", marginBottom: 16 }}>Por equipo</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(teamData).sort((a, b) => b[1].total - a[1].total).map(([team, d]) => {
              const isA = filters.team.includes(team), dim = filters.team.length > 0 && !isA;
              return (<div key={team} onClick={() => toggleArr("team", team)} style={{ cursor: "pointer", opacity: dim ? 0.3 : 1, padding: "6px 8px", borderRadius: 8, background: isA ? (teamColors[team] || "#94A3B8") + "0A" : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: teamColors[team] || "#94A3B8" }} /><span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{team}</span></div>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{d.total}</span>
                </div>
                <ProgressBar total={d.total} segments={[{ count: d.done, color: "#10B981" }, { count: d.inProgress, color: "#3B82F6" }, { count: d.notStarted, color: "#E2E8F0" }]} />
              </div>); })}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Tareas {hasFilter ? "(" + filtered.length + " de " + tasks.length + ")" : "(" + tasks.length + ")"}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length > 0 ? filtered.map((t, i) => <TaskRow key={i} t={t} filters={filters} setFilters={setFilters} />) : <div style={{ textAlign: "center", padding: 40, color: "#94A3B8", fontSize: 14, background: "#fff", borderRadius: 12 }}>No hay tareas con esos filtros</div>}
      </div>
    </>)}

    {view === "sprints" && (<>
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        {sprintsDef.map(s => { const allSt = tasks.filter(t => t.sprint === s.id), st = applyFilters(allSt), d = allSt.filter(t => t.status === "Done").length, p = allSt.length > 0 ? Math.round((d / allSt.length) * 100) : 0;
          return (<div key={s.id} style={{ flex: 1, minWidth: 160, background: "#fff", borderRadius: 14, padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: p + "%", background: p === 100 ? "#10B981" : "#3B82F6" }} />
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.range}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: p === 100 ? "#10B981" : "#0F172A" }}>{p}%</span>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>{hasFilter ? st.length + " de " + allSt.length : allSt.length + " tarea" + (allSt.length !== 1 ? "s" : "")}</span>
            </div>
          </div>); })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {sprintsDef.map(s => <SprintSection key={s.id} sprint={s} tasks={applyFilters(tasks.filter(t => t.sprint === s.id))} filters={filters} setFilters={setFilters} />)}
      </div>
    </>)}

    <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "#CBD5E1" }}>Datos en vivo desde Notion · Q2</div>
  </div>);
}
