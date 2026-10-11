const STORAGE_KEY = 'personal-dictionary-v1';

const sourceOptions = [
  'Naver',
  'Oxford',
  'Urban Dictionary',
  'Thesaurus',
  'Forvo',
  'Lexipedia',
  'Google',
  'Reddit',
  'Wikipedia'
];

const initialEntries = [
  {
    id: crypto.randomUUID(),
    word: 'Resilience',
    meaning: 'The ability to recover quickly from difficulties or adapt to challenging circumstances.',
    source: 'Oxford',
    category: 'advanced',
    tags: ['noun', 'mindset'],
    example: 'Her resilience helped her continue after the setback.',
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    word: 'Brevity',
    meaning: 'The quality of being brief and concise.',
    source: 'Naver',
    category: 'writing',
    tags: ['noun', 'style'],
    example: 'Brevity is often valued in professional communication.',
    favorite: false,
    createdAt: Date.now() - 5000,
    updatedAt: Date.now() - 5000
  },
  {
    id: crypto.randomUUID(),
    word: 'Skepticism',
    meaning: 'An attitude of doubt about something and a tendency not to believe claims without evidence.',
    source: 'Thesaurus',
    category: 'critical thinking',
    tags: ['noun', 'analysis'],
    example: 'Healthy skepticism helps evaluate new ideas carefully.',
    favorite: false,
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 10000
  }
];

const state = {
  entries: loadEntries(),
  sourceFilter: 'all',
  query: '',
  categoryFilter: 'all'
};

const elements = {
  searchInput: document.querySelector('#searchInput'),
  searchButton: document.querySelector('#searchButton'),
  sourceFilters: document.querySelector('#sourceFilters'),
  categoryFilters: document.querySelector('#categoryFilters'),
  addWordButton: document.querySelector('#addWordButton'),
  importButton: document.querySelector('#importButton'),
  importInput: document.querySelector('#importInput'),
  exportButton: document.querySelector('#exportButton'),
  wordList: document.querySelector('#wordList'),
  emptyState: document.querySelector('#emptyState'),
  statusMessage: document.querySelector('#statusMessage'),
  modal: document.querySelector('#wordModal'),
  closeModalButton: document.querySelector('#closeModalButton'),
  wordForm: document.querySelector('#wordForm'),
  wordInput: document.querySelector('#wordInput'),
  sourceInput: document.querySelector('#sourceInput'),
  categoryInput: document.querySelector('#categoryInput'),
  favoriteInput: document.querySelector('#favoriteInput'),
  tagsInput: document.querySelector('#tagsInput'),
  meaningInput: document.querySelector('#meaningInput'),
  exampleInput: document.querySelector('#exampleInput'),
  lookupButton: document.querySelector('#lookupButton'),
  modalTitle: document.querySelector('#modalTitle')
};

let editingId = null;

function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && saved.length) {
      return saved;
    }
  } catch (error) {
    console.warn('Unable to load saved dictionary data:', error);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEntries));
  return initialEntries;
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function showStatus(message, type = 'success') {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message ${type}`;
}

function getCategories() {
  return [...new Set(state.entries.map((entry) => (entry.category || 'general').trim()).filter(Boolean))];
}

function renderCategoryFilters() {
  const categories = getCategories();
  const buttons = ['<button class="category-chip active" data-category="all">All</button>'];

  categories.forEach((category) => {
    const active = state.categoryFilter === category ? 'active' : '';
    buttons.push(`<button class="category-chip ${active}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`);
  });

  elements.categoryFilters.innerHTML = buttons.join('');
}

function getFilteredEntries() {
  const normalizedQuery = state.query.trim().toLowerCase();

  return [...state.entries]
    .filter((entry) => {
      const matchesSource = state.sourceFilter === 'all' || entry.source === state.sourceFilter;
      const matchesCategory = state.categoryFilter === 'all' || (entry.category || 'general') === state.categoryFilter;

      if (!matchesSource || !matchesCategory) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        entry.word,
        entry.meaning,
        entry.category,
        entry.source,
        ...(entry.tags || [])
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

function renderEntries() {
  renderCategoryFilters();
  const filtered = getFilteredEntries();

  elements.wordList.innerHTML = filtered
    .map(
      (entry) => `
        <article class="word-card ${entry.favorite ? 'favorite' : ''}" data-id="${entry.id}">
          <div class="word-card-head">
            <h3>${escapeHtml(entry.word)}</h3>
            <span class="source-badge">${escapeHtml(entry.source)}</span>
          </div>

          <div class="meta-row">
            <span class="category-pill">${escapeHtml(entry.category || 'general')}</span>
            ${entry.favorite ? '<span class="favorite-pill" title="Favorite">★</span>' : ''}
          </div>

          <div class="tags">
            ${(entry.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>

          <p class="meaning">${escapeHtml(entry.meaning)}</p>
          ${entry.example ? `<p class="example">Example: ${escapeHtml(entry.example)}</p>` : ''}

          <div class="card-actions">
            <button class="action-button" data-action="favorite" data-id="${entry.id}">${entry.favorite ? 'Unmark' : 'Favorite'}</button>
            <button class="action-button" data-action="edit" data-id="${entry.id}">Edit</button>
            <button class="action-button danger" data-action="delete" data-id="${entry.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join('');

  elements.emptyState.classList.toggle('hidden', filtered.length > 0);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openModal(entry = null) {
  editingId = entry ? entry.id : null;
  elements.modalTitle.textContent = entry ? 'Edit word' : 'Add a word';
  elements.wordForm.reset();

  if (entry) {
    elements.wordInput.value = entry.word;
    elements.sourceInput.value = entry.source;
    elements.categoryInput.value = entry.category || '';
    elements.favoriteInput.value = String(Boolean(entry.favorite));
    elements.tagsInput.value = (entry.tags || []).join(', ');
    elements.meaningInput.value = entry.meaning;
    elements.exampleInput.value = entry.example || '';
  } else {
    elements.sourceInput.value = sourceOptions[0];
    elements.favoriteInput.value = 'false';
  }

  elements.modal.classList.remove('hidden');
}

function closeModal() {
  editingId = null;
  elements.modal.classList.add('hidden');
  elements.wordForm.reset();
}

function handleSubmit(event) {
  event.preventDefault();

  const payload = {
    word: elements.wordInput.value.trim(),
    source: elements.sourceInput.value,
    category: elements.categoryInput.value.trim() || 'general',
    favorite: elements.favoriteInput.value === 'true',
    tags: elements.tagsInput.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    meaning: elements.meaningInput.value.trim(),
    example: elements.exampleInput.value.trim(),
    updatedAt: Date.now()
  };

  if (!payload.word || !payload.meaning) {
    showStatus('Word and meaning are required.', 'error');
    return;
  }

  if (editingId) {
    state.entries = state.entries.map((entry) =>
      entry.id === editingId ? { ...entry, ...payload } : entry
    );
    showStatus(`Updated “${payload.word}” in your dictionary.`, 'success');
  } else {
    state.entries.unshift({
      id: crypto.randomUUID(),
      ...payload,
      createdAt: Date.now()
    });
    showStatus(`Added “${payload.word}” to your dictionary.`, 'success');
  }

  saveEntries();
  renderEntries();
  closeModal();
}

function deleteEntry(id) {
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) return;

  state.entries = state.entries.filter((item) => item.id !== id);
  saveEntries();
  renderEntries();
  showStatus(`Deleted “${entry.word}”.`, 'warning');
}

function toggleFavorite(id) {
  state.entries = state.entries.map((entry) =>
    entry.id === id ? { ...entry, favorite: !entry.favorite, updatedAt: Date.now() } : entry
  );

  saveEntries();
  renderEntries();
}

function bindWordActions() {
  elements.wordList.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const { action, id } = target.dataset;
    const entry = state.entries.find((item) => item.id === id);

    if (!entry) return;

    if (action === 'favorite') {
      toggleFavorite(id);
      return;
    }

    if (action === 'edit') {
      openModal(entry);
      return;
    }

    if (action === 'delete') {
      const confirmed = window.confirm(`Delete "${entry.word}" from your personal dictionary?`);
      if (confirmed) {
        deleteEntry(id);
      }
    }
  });
}

function bindFilters() {
  elements.sourceFilters.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-source]');
    if (!chip) return;

    state.sourceFilter = chip.dataset.source;

    document.querySelectorAll('.source-chip').forEach((button) => {
      button.classList.toggle('active', button === chip);
    });

    renderEntries();
  });

  elements.categoryFilters.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-category]');
    if (!chip) return;

    state.categoryFilter = chip.dataset.category;

    document.querySelectorAll('.category-chip').forEach((button) => {
      button.classList.toggle('active', button === chip);
    });

    renderEntries();
  });
}

function bindSearch() {
  elements.searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    renderEntries();
  });

  elements.searchButton.addEventListener('click', () => renderEntries());
}

async function lookupWordFromAPI() {
  const term = elements.wordInput.value.trim();
  if (!term) {
    showStatus('Please enter a word to look up first.', 'error');
    return;
  }

  const source = elements.sourceInput.value;

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);

    if (!response.ok) {
      throw new Error('No public dictionary result');
    }

    const data = await response.json();
    const entry = data?.[0];
    const meaning = entry?.meanings?.[0]?.definitions?.[0];

    if (!meaning) {
      throw new Error('No definition found');
    }

    elements.meaningInput.value = meaning.definition || 'No description available.';
    elements.exampleInput.value = meaning.example || '';
    elements.categoryInput.value = entry?.meanings?.[0]?.partOfSpeech || 'general';

    if (!elements.tagsInput.value) {
      elements.tagsInput.value = [entry?.meanings?.[0]?.partOfSpeech || 'word', source.toLowerCase()]
        .filter(Boolean)
        .join(', ');
    }

    showStatus(`Live lookup added for “${term}”.`, 'success');
  } catch (error) {
    console.warn('Dictionary API lookup failed:', error);
    showStatus(`No live result for “${term}”. You can enter the meaning manually.`, 'warning');
    if (!elements.meaningInput.value) {
      elements.meaningInput.value = 'No description available yet. Please add your own definition.';
    }
    if (!elements.categoryInput.value) {
      elements.categoryInput.value = 'general';
    }
  }
}

function bindModal() {
  elements.addWordButton.addEventListener('click', () => openModal());
  elements.closeModalButton.addEventListener('click', closeModal);
  elements.wordForm.addEventListener('submit', handleSubmit);
  elements.lookupButton.addEventListener('click', lookupWordFromAPI);

  document.querySelector('[data-close="true"]').addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

function exportEntries() {
  const payload = JSON.stringify(state.entries, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'personal-dictionary.json';
  anchor.click();
  URL.revokeObjectURL(url);
  showStatus('Dictionary exported as JSON.', 'success');
}

function importEntries(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(String(event.target.result));

      if (!Array.isArray(imported)) {
        throw new Error('Invalid import format');
      }

      state.entries = imported.map((entry) => ({
        id: entry.id || crypto.randomUUID(),
        word: entry.word || 'Untitled',
        meaning: entry.meaning || 'No meaning available',
        source: sourceOptions.includes(entry.source) ? entry.source : 'Wikipedia',
        category: entry.category || 'general',
        favorite: Boolean(entry.favorite),
        tags: Array.isArray(entry.tags) ? entry.tags : [],
        example: entry.example || '',
        createdAt: entry.createdAt || Date.now(),
        updatedAt: entry.updatedAt || Date.now()
      }));

      saveEntries();
      renderEntries();
      showStatus('Dictionary imported successfully.', 'success');
    } catch (error) {
      console.error(error);
      showStatus('Import failed. Please use a valid JSON dictionary file.', 'error');
    }
  };

  reader.readAsText(file);
}

function bindImportExport() {
  elements.exportButton.addEventListener('click', exportEntries);
  elements.importButton.addEventListener('click', () => elements.importInput.click());
  elements.importInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    importEntries(file);
    elements.importInput.value = '';
  });
}

function init() {
  bindSearch();
  bindFilters();
  bindWordActions();
  bindModal();
  bindImportExport();
  renderEntries();
}

init();

window.addEventListener('storage', () => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(saved)) {
    state.entries = saved;
    renderEntries();
  }
});

console.log('Personal Dictionary initialized.');
