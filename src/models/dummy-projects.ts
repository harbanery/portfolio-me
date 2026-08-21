import type { Project } from "@/models/project";

/**
 * Dummy portfolio projects.
 * Used as a fallback when the database has no active projects yet.
 * Replace by seeding the `Portfolio` table (see public/database) and the
 * site will automatically switch to real data.
 */
export const dummyProjects: Project[] = [
  {
    id: 1,
    title: "Atlas Agent Mesh",
    subtitle: "Multi-agent LLM operations for fiber network assurance",
    projectType: "internal",
    clientName: null,
    companyName: "Fiber Backbone Operator",
    role: "fullstack",
    image: "/projects/atlas-agent-mesh.svg",
    images: ["/projects/atlas-agent-mesh.svg"],
    description:
      "A multi-agent LLM platform where specialist agents triage alarms, correlate fibre-span telemetry, and draft incident reports for the network operations centre. Built with a supervisor/worker orchestration pattern, tool-calling, and a human approval gate before any action reaches production systems.",
    apiDocumentation: null,
    features: [
      "Supervisor-worker agent orchestration with tool calling",
      "Alarm correlation across DWDM spans and downstream services",
      "Draft incident reports with human approval gates",
      "Streaming agent traces for auditability",
    ],
    highlights: [
      "Cut mean triage time for repeated alarm patterns",
      "Kept every agent action behind an approval gate",
    ],
    challenges:
      "Agents hallucinated root causes when telemetry was partially missing, so the first version could not be trusted during live incidents.",
    solutions:
      "Introduced a tool-grounding contract: every claim must cite a telemetry artifact, and ungrounded statements are stripped before the report is drafted.",
    story:
      "Started as a weekend prompt experiment, grew into the operations team's default first-pass triage assistant.",
    outcomes: [
      "First-pass triage drafted in under two minutes",
      "100% of agent actions logged and reviewable",
    ],
    skills: ["next", "ts", "postgre"],
    repoLinks: [],
    webLink: null,
  },
  {
    id: 2,
    title: "Medallion Lakehouse",
    subtitle: "Bronze/Silver/Gold data platform on a 25,000 km backbone",
    projectType: "internal",
    clientName: null,
    companyName: "Fiber Backbone Operator",
    role: "data",
    image: "/projects/medallion-lakehouse.svg",
    images: ["/projects/medallion-lakehouse.svg"],
    description:
      "A medallion-architecture data platform ingesting NOC alarms, span telemetry, and commercial data into bronze, refining it into modelled silver layers, and publishing gold marts that power executive dashboards and agent context.",
    apiDocumentation: null,
    features: [
      "Bronze ingestion with schema drift handling",
      "Silver conformance and slowly changing dimensions",
      "Gold marts for availability, utilisation, and revenue",
      " lineage-aware contracts consumed by the agent layer",
    ],
    highlights: [
      "Single source of truth for network KPIs",
      "Data contracts shared between BI and LLM agents",
    ],
    challenges:
      "Source systems disagreed on identifiers for the same fibre span, making any aggregate untrustworthy.",
    solutions:
      "Built a crosswalk table in silver with survivorship rules, and exposed it as the only join path to gold.",
    story:
      "The moment finance and the NOC finally quoted the same availability number was the day this platform proved itself.",
    outcomes: [
      "One governed number per KPI across departments",
      "Batch pipelines replaced manual spreadsheet consolidation",
    ],
    skills: ["postgre", "go", "ts"],
    repoLinks: [],
    webLink: null,
  },
  {
    id: 3,
    title: "Sentinel Audit",
    subtitle: "Smart contract security research toolkit",
    projectType: "personal",
    clientName: null,
    companyName: null,
    role: "backend",
    image: "/projects/sentinel-audit.svg",
    images: ["/projects/sentinel-audit.svg"],
    description:
      "A security research toolkit for EVM smart contracts: static analyser for common vulnerability classes, a findings ledger with severity tracking, and report generation for audit engagements.",
    apiDocumentation: null,
    features: [
      "Static detectors for reentrancy and access-control gaps",
      "Severity-tagged findings ledger",
      "Markdown audit report generation",
      "Differential analysis between contract revisions",
    ],
    highlights: [
      "Findings ledger doubles as a reusable checklist",
      "Detector rules written as data, not code",
    ],
    challenges:
      "Naive pattern matching produced too many false positives to be useful during real reviews.",
    solutions:
      "Layered dataflow checks on top of pattern matches so a finding only fires when a tainted path actually reaches a sensitive sink.",
    story:
      "Written to stop re-deriving the same checklist on every engagement; it now anchors the whole review process.",
    outcomes: [
      "Review prep time cut by roughly half",
      "Zero missed repeats of previously reported findings",
    ],
    skills: ["go", "javascript", "github"],
    repoLinks: [],
    webLink: null,
  },
  {
    id: 4,
    title: "NOC Pulse",
    subtitle: "Realtime network operations dashboard",
    projectType: "internal",
    clientName: null,
    companyName: "Fiber Backbone Operator",
    role: "frontend",
    image: "/projects/noc-pulse.svg",
    images: ["/projects/noc-pulse.svg"],
    description:
      "A realtime operations wall for the network operations centre: streaming alarm feed, span-level utilisation charts, and SLA countdowns designed to be read from across the room.",
    apiDocumentation: null,
    features: [
      "Streaming alarm feed with severity lanes",
      "Span utilisation charts with anomaly shading",
      "SLA breach countdown timers",
      "Dark, high-contrast layout for control-room displays",
    ],
    highlights: [
      "Readable from six metres away by design",
      "Sub-second updates over websockets",
    ],
    challenges:
      "Rendering thousands of alarm updates per minute froze the browser tab.",
    solutions:
      "Moved to windowed rendering with a ring buffer so the DOM only ever holds the visible slice of the feed.",
    story:
      "The first version was a table nobody watched; this one is on the wall.",
    outcomes: [
      "Control room switched from periodic refresh to live view",
      "Tab crashes during alarm storms eliminated",
    ],
    skills: ["react", "ts", "tailwind"],
    repoLinks: [],
    webLink: null,
  },
];
