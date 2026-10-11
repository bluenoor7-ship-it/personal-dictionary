const STORAGE_KEY = 'personal-dictionary-v1';

const initialEntries = [
  {
    id: crypto.randomUUID(),
    word: 'Resilience',
    meaning: 'The ability to recover quickly from difficulties or adapt to challenging circumstances.',
    source: 'Oxford',
    category: 'advanced',
    tags: ['noun', 'mindset'],
    example: 'Her resilience helped her continue after the setback.'
  },
  {
    id: crypto.randomUUID(),
    word: 'Brevity',
    meaning: 'The quality of being brief and concise.',
    source: 'Naver',
    category: 'writing',
    tags: ['noun', 'style'],
    example: 'Brevity is often valued in professional communication.'
  },
  {
    id: crypto.randomUUID(),
    word: 'Skepticism',
    meaning: 'An attitude of doubt about something and a tendency not to believe claims without evidence.',
    source: 'Thesaurus',
    category: 'critical thinking',
    tags: ['noun', 'analysis'],
    example: 'Healthy skepticism helps evaluate new ideas carefully.'
  }
];

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

const state = {
  entries: loadEntries(),
  sourceFilter: 'all',
  query: ''
};

const elements = {
  searchInput: document.querySelector('#searchInput'),
  searchButton: document.querySelector('#searchButton'),
  sourceFilters: document.querySelector('#sourceFilters'),
  addWordButton: document.querySelector('#addWordButton'),
  wordList: document.querySelector('#wordList'),
  emptyState: document.querySelector('#emptyState'),
  modal: document.querySelector('#wordModal'),
  closeModalButton: document.querySelector('#closeModalButton'),
  wordForm: document.querySelector('#wordForm'),
  wordInput: document.querySelector('#wordInput'),
  sourceInput: document.querySelector('#sourceInput'),
  categoryInput: document.querySelector('#categoryInput'),
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

function getFilteredEntries() {
  const normalizedQuery = state.query.trim().toLowerCase();

  return state.entries.filter((entry) => {
    const matchesSource = state.sourceFilter === 'all' || entry.source === state.sourceFilter;
    if (!matchesSource) return false;

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
  });
}

function renderEntries() {
  const filtered = getFilteredEntries();

  elements.wordList.innerHTML = filtered
    .map(
      (entry) => `
        <article class="word-card" data-id="${entry.id}">
          <div class="word-card-head">
            <h3>${escapeHtml(entry.word)}</h3>
            <span class="source-badge">${escapeHtml(entry.source)}</span>
          </div>

          <div class="meta-row">
            <span class="category-pill">${escapeHtml(entry.category || 'general')}</span>
          </div>

          <div class="tags">
            ${(entry.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>

          <p class="meaning">${escapeHtml(entry.meaning)}</p>
          ${entry.example ? `<p class="example">Example: ${escapeHtml(entry.example)}</p>` : ''}

          <div class="card-actions">
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
    elements.tagsInput.value = (entry.tags || []).join(', ');
    elements.meaningInput.value = entry.meaning;
    elements.exampleInput.value = entry.example || '';
  } else {
    elements.sourceInput.value = sourceOptions[0];
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
    tags: elements.tagsInput.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    meaning: elements.meaningInput.value.trim(),
    example: elements.exampleInput.value.trim()
  };

  if (!payload.word || !payload.meaning) {
    return;
  }

  if (editingId) {
    state.entries = state.entries.map((entry) =>
      entry.id === editingId ? { ...entry, ...payload } : entry
    );
  } else {
    state.entries.unshift({
      id: crypto.randomUUID(),
      ...payload
    });
  }

  saveEntries();
  renderEntries();
  closeModal();
}

function deleteEntry(id) {
  state.entries = state.entries.filter((entry) => entry.id !== id);
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

    if (action === 'edit') {
      openModal(entry);
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
    alert('Please enter a word to look up first.');
    return;
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);

    if (!response.ok) {
      throw new Error('Lookup failed');
    }

    const data = await response.json();
    const definition = data?.[0]?.meanings?.[0]?.definitions?.[0];

    if (!definition) {
      throw new Error('No definition found');
    }

    const source = elements.sourceInput.value;
    elements.meaningInput.value = definition.definition || 'No description available.';
    elements.exampleInput.value = definition.example || '';
    elements.categoryInput.value = data?.[0]?.meanings?.[0]?.partOfSpeech || 'general';

    if (!elements.tagsInput.value) {
      elements.tagsInput.value = [data?.[0]?.meanings?.[0]?.partOfSpeech || 'word', source.toLowerCase()]
        .filter(Boolean)
        .join(', ');
    }
  } catch (error) {
    console.warn('Dictionary API lookup failed:', error);
    const fallback = `No live result was returned for "${term}" from the public dictionary service. You can still save the word manually.`;
    elements.meaningInput.value = fallback;
    elements.categoryInput.value = elements.categoryInput.value || 'general';
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

function init() {
  bindSearch();
  bindFilters();
  bindWordActions();
  bindModal();
  renderEntries();
}

init();
