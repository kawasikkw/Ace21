import { useState } from "react";

// ─── Stałe ────────────────────────────────────────────────────────────────────

const SAMPLE_MATCHES = {
  ATP: [
    { player1: "Novak Djokovic",  player2: "Carlos Alcaraz",    tournament: "Indian Wells Masters", surface: "Hard", conditions: "OUTDOOR", round: "QF"  },
    { player1: "Jannik Sinner",   player2: "Alexander Zverev",  tournament: "Indian Wells Masters", surface: "Hard", conditions: "OUTDOOR", round: "SF"  },
    { player1: "Daniil Medvedev", player2: "Stefanos Tsitsipas",tournament: "Indian Wells Masters", surface: "Hard", conditions: "OUTDOOR", round: "R16" },
    { player1: "Hubert Hurkacz",  player2: "Andrey Rublev",     tournament: "Indian Wells Masters", surface: "Hard", conditions: "OUTDOOR", round: "QF"  },
    { player1: "Ben Shelton",     player2: "Taylor Fritz",      tournament: "Indian Wells Masters", surface: "Hard", conditions: "OUTDOOR", round: "R16" },
  ],
  WTA: [
    { player1: "Aryna Sabalenka",   player2: "Iga Świątek",         tournament: "Indian Wells Open", surface: "Hard", conditions: "OUTDOOR", round: "SF"  },
    { player1: "Elena Rybakina",    player2: "Coco Gauff",          tournament: "Indian Wells Open", surface: "Hard", conditions: "OUTDOOR", round: "QF"  },
    { player1: "Madison Keys",      player2: "Jessica Pegula",      tournament: "Indian Wells Open", surface: "Hard", conditions: "OUTDOOR", round: "QF"  },
    { player1: "Barbora Krejčíková",player2: "Mirra Andreeva",      tournament: "Indian Wells Open", surface: "Hard", conditions: "OUTDOOR", round: "R16" },
  ],
};

const SURFACES       = ["Hard", "Clay", "Grass", "Indoor Hard"];
const CONDITIONS_LIST = ["OUTDOOR", "INDOOR"];
const ROUNDS         = ["R128", "R64", "R32", "R16", "QF", "SF", "F"];

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(p1, p2, tournament, surface, conditions, round) {
  return `Jesteś ekspertem analitykiem tenisowym specjalizującym się w statystykach serwisowych i predykcji asów.

KLUCZOWE ZASADY ANALIZY:
- NIE traktuj liczby asów jako prostego przedłużenia średniej sezonowej
- Traktuj ją jako WYNIK INTERAKCJI: jakość serwisu × zdolności returnowe przeciwnika × nawierzchnia × długość meczu × kontekst
- Gdy dwa czynniki wskazują w przeciwnych kierunkach, jawnie pokaż ten konflikt i wskaż, który ma większą wagę
- Zawsze podaj realistyczny przedział zamiast jednej precyzyjnej liczby
- Jeśli masz niską pewność, zmniejsz stanowczość prognozy — ale nie pomijaj analizy

MECZ DO ANALIZY:
Zawodnik A: ${p1}
Zawodnik B: ${p2}
Turniej: ${tournament || "Nieznany turniej"}
Nawierzchnia: ${surface}
Warunki: ${conditions}
Etap turnieju: ${round}

ZAKRES ANALIZY:

1. PROFIL SERWISOWY ${p1}:
- średnia asów na mecz (ogółem i konkretnie na nawierzchni ${surface})
- forma serwisowa w ostatnich 5–10 meczach (trend: rosnący/stabilny/spadkowy)
- zależność liczby asów od długości meczu (czy przy 3 setach znacząco rośnie?)
- jakość 1. serwisu: procent wejść i skuteczność punktowa na 1. serwisie
- typowa liczba gemów serwisowych na mecz

2. PROFIL SERWISOWY ${p2}:
- te same punkty co wyżej dla ${p2}

3. MATCH-UP — INTERAKCJE MIĘDZY ZAWODNIKAMI:
- jak dobrze ${p2} returnuje? Jakie stanowi zagrożenie dla serwisu ${p1}? (% wygranych pkt przy returnie)
- jak dobrze ${p1} returnuje? Czy zagraża serwisowi ${p2}?
- czy styl gry któregoś z zawodników wymusza warianty serwisu ograniczające asy?
- prognoza długości meczu: 2 sety vs 3 sety — uzasadnij
- prawdopodobieństwo tie-breaków i ich wkład w asy
- czy mecz będzie dominacją jednego gracza czy wyrównaną walką?

4. KONTEKST TURNIEJOWY I ŚRODOWISKOWY:
- szybkość nawierzchni ${surface} w warunkach ${conditions}
- warunki ${conditions}: wiatr/altitude/temperatura
- zmęczenie na etapie ${round}
- różnica klas i wpływ na strategię serwisową
- najbardziej prawdopodobny scenariusz przebiegu meczu

Odpowiedz WYŁĄCZNIE w formacie JSON — zero tekstu poza nawiasami klamrowymi, zero backticks:
{
  "dane": {
    "p1_avg_aces_total": "<np. 7.2 asy/mecz (sezon 2025)>",
    "p1_avg_aces_surface": "<np. 8.1 na Hard>",
    "p1_serve_in_pct": "<np. 64%>",
    "p1_serve_win_pct": "<np. 78% wygranych pkt na 1. serw.>",
    "p1_return_rank": "<np. top 15 ATP w returnie lub opis>",
    "p1_form_trend": "<np. stabilny — 6-9 asów w ostatnich 6 meczach>",
    "p2_avg_aces_total": "<liczba>",
    "p2_avg_aces_surface": "<liczba>",
    "p2_serve_in_pct": "<procent>",
    "p2_serve_win_pct": "<procent>",
    "p2_return_rank": "<opis>",
    "p2_form_trend": "<opis>",
    "surface_speed": "<wolna/średnia/szybka/bardzo szybka>",
    "expected_sets": "<2 lub 3+>",
    "tiebreak_probability": "<niska/średnia/wysoka>",
    "total_service_games_est": "<np. ~22-26 gemów serwisowych>"
  },
  "wniosek_analityczny": "<3-5 zdań — co NAJBARDZIEJ wpływa na liczbę asów w tym meczu>",
  "konflikty": [
    {
      "czynnik_za": "<opis czynnika podwyższającego>",
      "czynnik_przeciw": "<opis czynnika obniżającego>",
      "rozstrzygniecie": "<który dominuje i dlaczego>"
    }
  ],
  "predykcja": {
    "p1_aces": 0,
    "p2_aces": 0,
    "total_aces": 0,
    "range_low": 0,
    "range_high": 0,
    "confidence": 5,
    "total_line": 0,
    "recommendation": "OVER lub UNDER lub PASS"
  },
  "za_wyzszymi": ["<czynnik 1>", "<czynnik 2>", "<czynnik 3>"],
  "za_nizszymi": ["<czynnik 1>", "<czynnik 2>", "<czynnik 3>"],
  "bukmacher": "<2-3 zdania o linii bukmacherskiej>"
}`;
}

// ─── Sub-komponenty ───────────────────────────────────────────────────────────

function Tag({ children, accent = false }) {
  return (
    <span style={{
      display: "inline-block", fontSize: "9px", padding: "3px 8px", borderRadius: "3px",
      background: accent ? "rgba(0,255,157,0.12)" : "#0e1928",
      color: accent ? "#00ff9d" : "#374151",
      letterSpacing: "1px", fontWeight: "700",
    }}>{children}</span>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <span style={{ fontSize: "9px", color: "#2a3f5a", letterSpacing: "3px", fontWeight: "700", whiteSpace: "nowrap" }}>{children}</span>
      <div style={{ flex: 1, height: "1px", background: "#0e1928" }} />
    </div>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0c1520" }}>
      <span style={{ fontSize: "10px", color: "#374151" }}>{label}</span>
      <span style={{ fontSize: "11px", fontWeight: "700", color: highlight ? "#00ff9d" : "#6b7280" }}>{value || "—"}</span>
    </div>
  );
}

function ConflictCard({ item }) {
  return (
    <div style={{ borderRadius: "7px", overflow: "hidden", border: "1px solid #0e1928", marginBottom: "8px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "10px 12px", background: "rgba(0,255,157,0.05)", borderRight: "1px solid #0e1928" }}>
          <div style={{ fontSize: "8px", color: "#00ff9d", letterSpacing: "2px", marginBottom: "4px" }}>↑ ZA WYŻSZĄ</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: 1.5 }}>{item.czynnik_za}</div>
        </div>
        <div style={{ padding: "10px 12px", background: "rgba(255,107,107,0.05)" }}>
          <div style={{ fontSize: "8px", color: "#ff6b6b", letterSpacing: "2px", marginBottom: "4px" }}>↓ ZA NIŻSZĄ</div>
          <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: 1.5 }}>{item.czynnik_przeciw}</div>
        </div>
      </div>
      <div style={{ padding: "8px 12px", background: "#07101a", borderTop: "1px solid #0e1928" }}>
        <span style={{ fontSize: "9px", color: "#ffd700", letterSpacing: "1px" }}>ROZSTRZYGNIĘCIE › </span>
        <span style={{ fontSize: "11px", color: "#a89060" }}>{item.rozstrzygniecie}</span>
      </div>
    </div>
  );
}

function AnalysisReport({ result, p1name, p2name, surface }) {
  const { dane, wniosek_analityczny, konflikty, predykcja, za_wyzszymi, za_nizszymi, bukmacher } = result;
  const recColor = { OVER: "#00ff9d", UNDER: "#ff6b6b", PASS: "#ffd700" }[predykcja.recommendation] || "#ffd700";
  const confColor = predykcja.confidence >= 7 ? "#00ff9d" : predykcja.confidence >= 5 ? "#ffd700" : "#ff6b6b";

  return (
    <div>
      {/* WYNIK */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center", marginBottom: "14px" }}>
        {[
          { name: p1name, aces: predykcja.p1_aces },
          null,
          { name: p2name, aces: predykcja.p2_aces },
        ].map((item, i) =>
          item === null ? (
            <div key="total" style={{ textAlign: "center", padding: "14px 16px", background: "#07101a", borderRadius: "7px", border: "1px solid rgba(0,255,157,0.2)" }}>
              <div style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", marginBottom: "4px" }}>TOTAL</div>
              <div style={{ fontSize: "40px", fontWeight: "900", color: "#00ff9d", lineHeight: 1 }}>{predykcja.total_aces}</div>
              <div style={{ fontSize: "9px", color: "#374151", marginTop: "3px" }}>{predykcja.range_low}–{predykcja.range_high}</div>
            </div>
          ) : (
            <div key={item.name} style={{ textAlign: "center", padding: "14px 10px", background: "#07101a", borderRadius: "7px", border: "1px solid #0e1928" }}>
              <div style={{ fontSize: "9px", color: "#374151", letterSpacing: "1px", marginBottom: "4px" }}>{item.name}</div>
              <div style={{ fontSize: "30px", fontWeight: "900", color: "#e8e0d0", lineHeight: 1 }}>{item.aces}</div>
              <div style={{ fontSize: "8px", color: "#2a3f5a", marginTop: "3px" }}>asów</div>
            </div>
          )
        )}
      </div>

      {/* REKOMENDACJA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
        <div style={{ padding: "12px", background: `rgba(${predykcja.recommendation === "OVER" ? "0,255,157" : predykcja.recommendation === "UNDER" ? "255,107,107" : "255,215,0"},0.07)`, borderRadius: "7px", border: `1px solid ${recColor}33`, textAlign: "center" }}>
          <div style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", marginBottom: "3px" }}>REKOMENDACJA</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: recColor }}>{predykcja.recommendation}</div>
          <div style={{ fontSize: "9px", color: "#374151", marginTop: "2px" }}>linia {predykcja.total_line}</div>
        </div>
        <div style={{ padding: "12px", background: "#07101a", borderRadius: "7px", border: "1px solid #0e1928" }}>
          <div style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", marginBottom: "8px" }}>PEWNOŚĆ {predykcja.confidence}/10</div>
          <div style={{ height: "5px", background: "#0e1928", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${predykcja.confidence * 10}%`, background: `linear-gradient(90deg, ${confColor}55, ${confColor})`, borderRadius: "3px" }} />
          </div>
          <div style={{ fontSize: "8px", color: "#2a3f5a", marginTop: "6px" }}>zakres {predykcja.range_low}–{predykcja.range_high} asów</div>
        </div>
      </div>

      {/* DANE */}
      <div style={{ marginBottom: "16px" }}>
        <SectionLabel>DANE STATYSTYCZNE</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
          {[{ name: p1name, prefix: "p1" }, { name: p2name, prefix: "p2" }].map(({ name, prefix }) => (
            <div key={prefix} style={{ background: "#07101a", borderRadius: "7px", padding: "12px", border: "1px solid #0e1928" }}>
              <div style={{ fontSize: "10px", color: "#00ff9d", letterSpacing: "1px", marginBottom: "8px", fontWeight: "700" }}>{name}</div>
              <StatRow label="Asy/mecz" value={dane[`${prefix}_avg_aces_total`]} highlight />
              <StatRow label={`Asy na ${surface}`} value={dane[`${prefix}_avg_aces_surface`]} highlight />
              <StatRow label="1. serwis %" value={dane[`${prefix}_serve_in_pct`]} />
              <StatRow label="Skutecz. na 1. serw." value={dane[`${prefix}_serve_win_pct`]} />
              <StatRow label="Return (ranking)" value={dane[`${prefix}_return_rank`]} />
              <StatRow label="Trend formy" value={dane[`${prefix}_form_trend`]} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
          {[
            { l: "Nawierzchnia", v: dane.surface_speed },
            { l: "Spodz. sety", v: dane.expected_sets },
            { l: "Tie-break", v: dane.tiebreak_probability },
            { l: "Gemy serw.", v: dane.total_service_games_est },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: "#07101a", borderRadius: "6px", padding: "9px 8px", border: "1px solid #0e1928", textAlign: "center" }}>
              <div style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "1px", marginBottom: "4px" }}>{l.toUpperCase()}</div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#a89060" }}>{v || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WNIOSEK */}
      <div style={{ marginBottom: "16px" }}>
        <SectionLabel>WNIOSEK ANALITYCZNY</SectionLabel>
        <div style={{ padding: "14px 16px", background: "#07101a", borderRadius: "7px", borderLeft: "3px solid #00ff9d" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.75 }}>{wniosek_analityczny}</p>
        </div>
      </div>

      {/* KONFLIKTY */}
      {konflikty && konflikty.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionLabel>KONFLIKTY CZYNNIKÓW</SectionLabel>
          {konflikty.map((item, i) => <ConflictCard key={i} item={item} />)}
        </div>
      )}

      {/* ZA / PRZECIW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "↑ ZA WYŻSZĄ LICZBĄ ASÓW", items: za_wyzszymi, color: "#00ff9d", bg: "rgba(0,255,157,0.04)" },
          { label: "↓ ZA NIŻSZĄ LICZBĄ ASÓW", items: za_nizszymi, color: "#ff6b6b", bg: "rgba(255,107,107,0.04)" },
        ].map(({ label, items, color, bg }) => (
          <div key={label} style={{ background: bg, borderRadius: "7px", padding: "12px", border: `1px solid ${color}1a` }}>
            <div style={{ fontSize: "8px", color, letterSpacing: "2px", fontWeight: "700", marginBottom: "10px" }}>{label}</div>
            {(items || []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px" }}>
                <span style={{ color, fontSize: "8px", marginTop: "3px", flexShrink: 0 }}>◆</span>
                <span style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* BUKMACHER */}
      <div>
        <SectionLabel>OCENA LINII BUKMACHERSKIEJ</SectionLabel>
        <div style={{ padding: "14px 16px", background: "#07101a", borderRadius: "7px", borderLeft: "3px solid #ffd700" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.75 }}>{bukmacher}</p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ padding: "36px 0", textAlign: "center" }}>
      <div style={{ fontSize: "30px", display: "inline-block", animation: "spin 1.1s linear infinite", color: "#00ff9d" }}>◌</div>
      <div style={{ fontSize: "10px", color: "#2a3f5a", letterSpacing: "3px", marginTop: "12px" }}>ANALIZUJĘ MECZ...</div>
      <div style={{ fontSize: "9px", color: "#0e1928", marginTop: "5px" }}>Profile serwisowe · Match-up · Kontekst turniejowy</div>
    </div>
  );
}

// ─── GŁÓWNY KOMPONENT ─────────────────────────────────────────────────────────

export default function App() {
  const [tour,    setTour]    = useState("ATP");
  const [tab,     setTab]     = useState("matches");
  const [analyses, setAnalyses] = useState({});
  const [loading,  setLoading]  = useState({});
  const [expanded, setExpanded] = useState(null);

  const [custom,       setCustom]       = useState({ player1: "", player2: "", tournament: "", surface: "Hard", conditions: "OUTDOOR", round: "QF" });
  const [customResult, setCustomResult] = useState(null);
  const [customLoading,setCustomLoading]= useState(false);
  const [customError,  setCustomError]  = useState(null);

  // Wywołuje nasz bezpieczny backend (Vercel Function), NIE Anthropic bezpośrednio
  async function callApi(prompt) {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  const analyzeMatch = async (match, key) => {
    if (analyses[key] || loading[key]) return;
    setLoading(p => ({ ...p, [key]: true }));
    setExpanded(key);
    try {
      const result = await callApi(buildPrompt(match.player1, match.player2, match.tournament, match.surface, match.conditions, match.round));
      setAnalyses(p => ({ ...p, [key]: result }));
    } catch (e) {
      setAnalyses(p => ({ ...p, [key]: { error: true, msg: e.message } }));
    }
    setLoading(p => ({ ...p, [key]: false }));
  };

  const analyzeCustom = async () => {
    if (!custom.player1 || !custom.player2) return;
    setCustomLoading(true); setCustomResult(null); setCustomError(null);
    try {
      const result = await callApi(buildPrompt(custom.player1, custom.player2, custom.tournament, custom.surface, custom.conditions, custom.round));
      setCustomResult(result);
    } catch (e) {
      setCustomError(`Błąd: ${e.message}`);
    }
    setCustomLoading(false);
  };

  const matches = SAMPLE_MATCHES[tour];
  const today   = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", background: "#040810", fontFamily: "'Courier New', monospace", color: "#c8c4bc" }}>

      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(rgba(0,255,157,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #00ff9d33, transparent)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 18px 60px", position: "relative" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: "24px", height: "1px", background: "#00ff9d44" }} />
            <span style={{ fontSize: "8px", color: "#00ff9d", letterSpacing: "5px" }}>AI TENNIS ANALYTICS</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <span style={{ fontSize: "clamp(40px,7vw,72px)", fontWeight: "900", letterSpacing: "-3px", color: "#e8e0d0", lineHeight: 1 }}>ACE</span>
            <span style={{ fontSize: "clamp(40px,7vw,72px)", fontWeight: "900", letterSpacing: "-3px", color: "#00ff9d", lineHeight: 1 }}>BOT</span>
            <span style={{ fontSize: "26px", marginLeft: "10px", marginBottom: "6px" }}>🎾</span>
          </div>
          <div style={{ marginTop: "6px", fontSize: "10px", color: "#1e2d44", letterSpacing: "2px" }}>{today.toUpperCase()}</div>
          <div style={{ marginTop: "3px", fontSize: "9px", color: "#0e1928", letterSpacing: "1px" }}>
            Predykcja asów ATP & WTA · Analiza serwisowa · Match-up · Kontekst bukmacherski
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "24px", background: "#080f1a", borderRadius: "7px", padding: "3px", border: "1px solid #0e1928" }}>
          {[{ id: "matches", label: "Mecze dnia" }, { id: "custom", label: "Własny mecz" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "9px 16px", borderRadius: "5px", border: "none", cursor: "pointer",
              background: tab === t.id ? "#00ff9d" : "transparent",
              color: tab === t.id ? "#040810" : "#374151",
              fontFamily: "'Courier New', monospace", fontSize: "10px", fontWeight: "700",
              letterSpacing: "2px", textTransform: "uppercase", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══ TAB: MECZE DNIA ══ */}
        {tab === "matches" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
              {["ATP", "WTA"].map(t => (
                <button key={t} onClick={() => setTour(t)} style={{
                  padding: "6px 20px", borderRadius: "4px",
                  border: `1px solid ${tour === t ? "#00ff9d" : "#0e1928"}`,
                  background: tour === t ? "rgba(0,255,157,0.1)" : "transparent",
                  color: tour === t ? "#00ff9d" : "#2a3f5a",
                  fontFamily: "'Courier New', monospace", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", cursor: "pointer",
                }}>{t}</button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00ff9d", animation: "blink 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize: "8px", color: "#1e2d44", letterSpacing: "3px" }}>LIVE</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {matches.map((match, i) => {
                const key     = `${tour}-${i}`;
                const result  = analyses[key];
                const isLoading = loading[key];
                const isOpen  = expanded === key;
                const ok      = result && !result.error;

                return (
                  <div key={key} style={{ background: "#080f1a", borderRadius: "9px", border: `1px solid ${ok ? "rgba(0,255,157,0.15)" : "#0e1928"}`, overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <Tag accent>{match.surface}</Tag>
                        <Tag>{match.conditions}</Tag>
                        <Tag>{match.round}</Tag>
                        <Tag>{match.tournament}</Tag>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "700", color: "#e8e0d0" }}>{match.player1}</span>
                          <span style={{ fontSize: "11px", color: "#1e2d44", fontWeight: "900" }}>VS</span>
                          <span style={{ fontSize: "15px", fontWeight: "700", color: "#e8e0d0" }}>{match.player2}</span>
                        </div>
                        {ok && (
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "22px", fontWeight: "900", color: "#00ff9d", lineHeight: 1 }}>{result.predykcja.total_aces}</div>
                              <div style={{ fontSize: "7px", color: "#1e2d44", letterSpacing: "2px" }}>ACES</div>
                            </div>
                            <div style={{
                              padding: "5px 12px", borderRadius: "5px",
                              background: `rgba(${result.predykcja.recommendation === "OVER" ? "0,255,157" : result.predykcja.recommendation === "UNDER" ? "255,107,107" : "255,215,0"},0.08)`,
                              border: `1px solid ${{ OVER:"#00ff9d33", UNDER:"#ff6b6b33", PASS:"#ffd70033" }[result.predykcja.recommendation]}`,
                            }}>
                              <div style={{ fontSize: "13px", fontWeight: "900", color: { OVER:"#00ff9d", UNDER:"#ff6b6b", PASS:"#ffd700" }[result.predykcja.recommendation] }}>{result.predykcja.recommendation}</div>
                              <div style={{ fontSize: "8px", color: "#1e2d44", textAlign: "center" }}>{result.predykcja.total_line}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: "12px", display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap" }}>
                        {!result && !isLoading && (
                          <button onClick={() => analyzeMatch(match, key)} style={{
                            padding: "7px 18px", borderRadius: "4px", border: "1px solid #00ff9d",
                            background: "rgba(0,255,157,0.07)", color: "#00ff9d",
                            fontFamily: "'Courier New', monospace", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", cursor: "pointer",
                          }}>▶ ANALIZUJ</button>
                        )}
                        {isLoading && <span style={{ fontSize: "10px", color: "#00ff9d", animation: "pulse 1s ease-in-out infinite" }}>⚙ Analizuję...</span>}
                        {ok && (
                          <button onClick={() => setExpanded(isOpen ? null : key)} style={{
                            padding: "5px 12px", borderRadius: "4px", border: "1px solid #0e1928",
                            background: "transparent", color: "#2a3f5a",
                            fontFamily: "'Courier New', monospace", fontSize: "9px", cursor: "pointer", letterSpacing: "1px",
                          }}>{isOpen ? "▲ ZWIŃ" : "▼ PEŁNA ANALIZA"}</button>
                        )}
                        {result?.error && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "10px", color: "#ff6b6b" }}>✗ {result.msg || "Błąd analizy"}</span>
                            <button onClick={() => { setAnalyses(p => { const n = {...p}; delete n[key]; return n; }); analyzeMatch(match, key); }} style={{
                              padding: "4px 10px", borderRadius: "3px", border: "1px solid #ff6b6b44",
                              background: "rgba(255,107,107,0.08)", color: "#ff6b6b",
                              fontFamily: "'Courier New', monospace", fontSize: "9px", cursor: "pointer",
                            }}>↺ RETRY</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {(ok || isLoading) && isOpen && (
                      <div style={{ borderTop: "1px solid #0e1928", padding: isLoading ? "0" : "20px 20px 18px", background: "#060c14" }}>
                        {isLoading ? <Spinner /> : <AnalysisReport result={result} p1name={match.player1} p2name={match.player2} surface={match.surface} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══ TAB: WŁASNY MECZ ══ */}
        {tab === "custom" && (
          <div style={{ background: "#080f1a", border: "1px solid #0e1928", borderRadius: "9px", padding: "24px" }}>
            <SectionLabel>DANE MECZU</SectionLabel>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {[
                { k: "player1",    label: "Zawodnik A",                      ph: "np. Novak Djokovic"     },
                { k: "player2",    label: "Zawodnik B",                      ph: "np. Carlos Alcaraz"     },
                { k: "tournament", label: "Turniej",                         ph: "np. Roland Garros 2025" },
                { k: "round",      label: "Runda (wpisz lub wybierz poniżej)", ph: "np. QF"              },
              ].map(({ k, label, ph }) => (
                <div key={k}>
                  <label style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", display: "block", marginBottom: "5px" }}>{label.toUpperCase()}</label>
                  <input value={custom[k]} onChange={e => setCustom(p => ({ ...p, [k]: e.target.value }))} placeholder={ph}
                    style={{ width: "100%", padding: "8px 11px", borderRadius: "5px", border: "1px solid #0e1928", background: "#040810", color: "#c8c4bc", fontFamily: "'Courier New', monospace", fontSize: "11px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", display: "block", marginBottom: "6px" }}>NAWIERZCHNIA</label>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {SURFACES.map(s => (
                  <button key={s} onClick={() => setCustom(p => ({ ...p, surface: s }))} style={{
                    padding: "6px 13px", borderRadius: "4px",
                    border: `1px solid ${custom.surface === s ? "#00ff9d" : "#0e1928"}`,
                    background: custom.surface === s ? "rgba(0,255,157,0.1)" : "transparent",
                    color: custom.surface === s ? "#00ff9d" : "#2a3f5a",
                    fontFamily: "'Courier New', monospace", fontSize: "10px", cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", marginBottom: "20px", alignItems: "start" }}>
              <div>
                <label style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", display: "block", marginBottom: "6px" }}>WARUNKI</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  {CONDITIONS_LIST.map(c => (
                    <button key={c} onClick={() => setCustom(p => ({ ...p, conditions: c }))} style={{
                      padding: "6px 12px", borderRadius: "4px",
                      border: `1px solid ${custom.conditions === c ? "#00ff9d" : "#0e1928"}`,
                      background: custom.conditions === c ? "rgba(0,255,157,0.1)" : "transparent",
                      color: custom.conditions === c ? "#00ff9d" : "#2a3f5a",
                      fontFamily: "'Courier New', monospace", fontSize: "10px", cursor: "pointer",
                    }}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "8px", color: "#2a3f5a", letterSpacing: "2px", display: "block", marginBottom: "6px" }}>RUNDA</label>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {ROUNDS.map(r => (
                    <button key={r} onClick={() => setCustom(p => ({ ...p, round: r }))} style={{
                      padding: "5px 9px", borderRadius: "3px",
                      border: `1px solid ${custom.round === r ? "#00ff9d" : "#0e1928"}`,
                      background: custom.round === r ? "rgba(0,255,157,0.1)" : "transparent",
                      color: custom.round === r ? "#00ff9d" : "#2a3f5a",
                      fontFamily: "'Courier New', monospace", fontSize: "9px", cursor: "pointer",
                    }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={analyzeCustom} disabled={!custom.player1 || !custom.player2 || customLoading} style={{
              width: "100%", padding: "12px", borderRadius: "6px",
              border: "1px solid #00ff9d", background: "rgba(0,255,157,0.07)",
              color: "#00ff9d", fontFamily: "'Courier New', monospace",
              fontSize: "11px", fontWeight: "700", letterSpacing: "3px", cursor: "pointer",
              opacity: !custom.player1 || !custom.player2 ? 0.3 : 1,
            }}>{customLoading ? "⚙ ANALIZUJĘ..." : "▶ URUCHOM PEŁNĄ ANALIZĘ"}</button>

            {customLoading && <div style={{ marginTop: "18px", background: "#060c14", borderRadius: "7px", border: "1px solid #0e1928" }}><Spinner /></div>}
            {customError  && <div style={{ marginTop: "12px", padding: "11px 14px", background: "rgba(255,107,107,0.06)", border: "1px solid #ff6b6b33", borderRadius: "6px", color: "#ff6b6b", fontSize: "11px" }}>{customError}</div>}

            {customResult && !customResult.error && (
              <div style={{ marginTop: "20px", padding: "20px", background: "#060c14", borderRadius: "8px", border: "1px solid rgba(0,255,157,0.12)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ff9d", animation: "blink 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize: "9px", color: "#00ff9d", letterSpacing: "3px" }}>ANALIZA GOTOWA</span>
                </div>
                <AnalysisReport result={customResult} p1name={custom.player1} p2name={custom.player2} surface={custom.surface} />
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "48px", fontSize: "8px", color: "#0e1928", letterSpacing: "3px" }}>
          ACEBOT v2.0 · AI TENNIS ANALYTICS · POWERED BY CLAUDE AI
        </div>
      </div>

      <style>{`
        @keyframes spin  { from { transform:rotate(0deg); }  to { transform:rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.15;} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus { border-color:#00ff9d44!important; }
        input::placeholder { color:#0e1928; }
        button:not(:disabled):hover { opacity:0.75; }
      `}</style>
    </div>
  );
}
