:root {
  --page-bg: #f3f4f6;
  --panel-bg: rgba(255, 255, 255, 0.72);
  --panel-border: rgba(35, 41, 53, 0.12);
  --text: #1d2a39;
  --muted: #6a7481;
  --input-bg: rgba(255, 255, 255, 0.25);
  --chip-bg: rgba(255, 255, 255, 0.18);
  --chip-border: rgba(54, 70, 95, 0.18);
  --primary: #3c7ff7;
  --primary-soft: rgba(60, 127, 247, 0.12);
  --success: #1b9b6b;
  --danger: #d65d5d;
  --warning: #efb93d;
  --shadow: 0 12px 30px rgba(27, 34, 43, 0.08);
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  background: var(--page-bg);
  color: var(--text);
  font-family: "Inter", sans-serif;
}

body {
  display: flex;
  justify-content: center;
  padding: 32px 20px 48px;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  width: min(1180px, 100%);
}

.topbar {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.search-wrap {
  display: flex;
  align-items: center;
  width: min(900px, 100%);
  min-height: 72px;
  padding: 0 18px 0 22px;
  background: rgba(255, 255, 255, 0.68);
  border: 1.5px solid var(--panel-border);
  border-radius: 999px;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

.search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: clamp(1.05rem, 1.4vw, 1.45rem);
  color: var(--text);
  outline: none;
}

.search-wrap input::placeholder {
  color: #8e9aa8;
}

.icon-button {
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  color: var(--text);
  display: grid;
  place-items: center;
}

.icon-button svg {
  width: 26px;
  height: 26px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 12px 0 10px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
}

.secondary-group {
  margin-top: 4px;
}

.source-chip,
.category-chip {
  border: 1px solid var(--chip-border);
  background: rgba(255, 255, 255, 0.48);
  border-radius: 14px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  transition: all 0.2s ease;
}

.source-chip.active,
.category-chip.active {
  background: rgba(66, 135, 245, 0.08);
  border-color: rgba(66, 135, 245, 0.35);
  box-shadow: inset 0 0 0 1px rgba(66, 135, 245, 0.12);
}

.toolbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  border-radius: 14px;
  padding: 0.8rem 1.25rem;
  border: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-button {
  background: linear-gradient(180deg, #5f8ef8 0%, #3b7af5 100%);
  color: white;
  box-shadow: 0 10px 18px rgba(59, 122, 245, 0.2);
}

.secondary-button {
  background: rgba(91, 101, 114, 0.08);
  color: var(--text);
}

.primary-button.small,
.secondary-button.small {
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
}

.primary-button:hover,
.secondary-button:hover,
.source-chip:hover,
.category-chip:hover,
.close-button:hover {
  transform: translateY(-1px);
}

.status-message {
  min-height: 24px;
  margin-bottom: 10px;
  font-size: 0.82rem;
  color: var(--muted);
}

.status-message.success {
  color: var(--success);
}

.status-message.warning {
  color: var(--warning);
}

.status-message.error {
  color: var(--danger);
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.word-card {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid var(--panel-border);
  border-radius: 20px;
  padding: 18px 18px 16px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow);
}

.word-card.favorite {
  border-color: rgba(239, 185, 61, 0.5);
  box-shadow: 0 12px 30px rgba(239, 185, 61, 0.12);
}

.word-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.word-card h3 {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.1;
}

.word-card .source-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(28, 155, 107, 0.08);
  color: var(--success);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  background: rgba(92, 118, 227, 0.08);
  color: #4b5ad9;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.favorite-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(239, 185, 61, 0.12);
  color: var(--warning);
  font-size: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  background: rgba(91, 101, 114, 0.08);
  border-radius: 999px;
  padding: 5px 8px;
  font-size: 0.72rem;
  color: var(--muted);
}

.meaning {
  color: #263748;
  font-size: 0.98rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.example {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
}

.action-button {
  border: 1px solid var(--panel-border);
  background: transparent;
  color: var(--text);
  padding: 7px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.action-button.danger {
  color: var(--danger);
  border-color: rgba(214, 93, 93, 0.25);
}

.empty-state {
  text-align: center;
  color: var(--muted);
  padding: 28px 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  margin-top: 10px;
}

.hidden {
  display: none !important;
}

.modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 50;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(17, 23, 31, 0.35);
}

.modal-panel {
  position: relative;
  width: min(560px, calc(100vw - 28px));
  background: white;
  border-radius: 24px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  box-shadow: var(--shadow);
  padding: 20px 22px 18px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.close-button {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 50%;
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
  font-size: 0.92rem;
  font-weight: 600;
}

.full-span {
  grid-column: 1 / -1;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(27, 36, 48, 0.12);
  background: rgba(247, 249, 252, 0.9);
  color: var(--text);
  outline: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: rgba(59, 122, 245, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 122, 245, 0.1);
}

textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

@media (max-width: 720px) {
  .toolbar {
    align-items: flex-start;
  }

  .search-wrap {
    min-height: 64px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
