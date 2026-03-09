# 🎾 AceBot — AI Tennis Ace Predictor

Aplikacja do predykcji liczby asów w meczach ATP i WTA, zasilana przez Claude AI.

---

## 🚀 Wdrożenie na Vercel (krok po kroku)

### Wymagania
- Konto na [GitHub](https://github.com) (darmowe)
- Konto na [Vercel](https://vercel.com) (darmowe)
- Klucz API Anthropic z [console.anthropic.com](https://console.anthropic.com)

---

### Krok 1 — Przygotuj pliki

Rozpakuj ZIP. Powinieneś mieć taką strukturę:
```
acebot/
├── api/
│   └── analyze.js        ← backend (Vercel Function)
├── src/
│   ├── App.jsx           ← główna aplikacja
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

---

### Krok 2 — Wgraj na GitHub

1. Wejdź na [github.com/new](https://github.com/new)
2. Utwórz nowe repozytorium (np. `acebot`), **prywatne**
3. Wgraj wszystkie pliki (przeciągnij i upuść na GitHub, lub użyj Git)

---

### Krok 3 — Podłącz Vercel

1. Wejdź na [vercel.com](https://vercel.com) → **Add New Project**
2. Wybierz swoje repozytorium `acebot`
3. Framework: **Vite** (Vercel wykryje automatycznie)
4. Kliknij **Deploy** — na razie bez klucza API

---

### Krok 4 — Dodaj klucz API (NAJWAŻNIEJSZE)

1. W panelu Vercel wejdź w swój projekt
2. **Settings** → **Environment Variables**
3. Dodaj zmienną:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (Twój klucz z console.anthropic.com)
   - **Environments:** ✅ Production, ✅ Preview
4. Kliknij **Save**
5. Wróć do **Deployments** i kliknij **Redeploy**

---

### Krok 5 — Gotowe! 🎉

Twoja strona jest dostępna pod adresem `https://acebot-xxx.vercel.app`

---

## 💻 Uruchomienie lokalne (do developmentu)

```bash
# 1. Zainstaluj zależności
npm install

# 2. Utwórz plik .env.local
cp .env.example .env.local
# Otwórz .env.local i wpisz swój klucz API

# 3. Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna na http://localhost:5173

> ⚠️ Lokalnie Vercel Functions nie działają przez `npm run dev`.
> Do testowania backendu lokalnie zainstaluj Vercel CLI:
> ```bash
> npm i -g vercel
> vercel dev
> ```

---

## 🔒 Bezpieczeństwo

- Klucz API **nigdy** nie trafia do przeglądarki użytkownika
- Wszystkie zapytania do Anthropic przechodzą przez `api/analyze.js` (Vercel Function)
- Zmienna `ANTHROPIC_API_KEY` jest dostępna tylko po stronie serwera

---

## 📁 Struktura projektu

| Plik | Opis |
|------|------|
| `api/analyze.js` | Backend — Vercel Serverless Function, proxy do Anthropic API |
| `src/App.jsx` | Frontend — cała aplikacja React |
| `src/main.jsx` | Punkt wejścia React |
| `index.html` | Szablon HTML |
| `vite.config.js` | Konfiguracja Vite (bundler) |
| `vercel.json` | Konfiguracja routingu Vercel |
| `package.json` | Zależności projektu |

---

## 🛠️ Dostosowanie

### Zmiana meczów dnia
Edytuj `SAMPLE_MATCHES` w `src/App.jsx`:
```js
const SAMPLE_MATCHES = {
  ATP: [
    { player1: "...", player2: "...", tournament: "...", surface: "Hard", conditions: "OUTDOOR", round: "QF" },
  ],
  WTA: [ ... ]
};
```

### Zmiana modelu AI
W `api/analyze.js` zmień:
```js
model: "claude-sonnet-4-20250514",  // ← zmień tutaj
```
