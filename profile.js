const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const defaultProfile = {
  name: 'Kwanchanal Geographic',
  username: 'kwanchanal',
  bio: 'Scuba Diving School and Recreation'
};

const defaultLinks = [
  {
    id: crypto.randomUUID(),
    title: 'Booking',
    url: 'https://example.com/booking',
    thumbnail: '',
    featured: true,
    enabled: true
  },
  {
    id: crypto.randomUUID(),
    title: 'Instagram',
    url: 'https://instagram.com',
    thumbnail: '',
    featured: false,
    enabled: true
  }
];

const defaultAppearance = {
  profileImageUrl: '',
  backgroundImageUrl: '',
  backgroundColor: '#f7f7f8',
  buttonColor: '#1c1f24',
  profileFontColor: '#1c1f24',
  buttonFontColor: '#ffffff'
};

const profile = storage.get('wemint_profile_page_profile', defaultProfile);
const links = storage.get('wemint_profile_page_links', defaultLinks);
const socialLinks = storage.get('wemint_profile_page_social', {});
const appearance = storage.get('wemint_profile_page_appearance', defaultAppearance);

const elements = {
  profileName: document.getElementById('profile-name'),
  profileUsername: document.getElementById('profile-username'),
  profileBio: document.getElementById('profile-bio'),
  profileAvatarUpload: document.getElementById('profile-avatar-upload'),
  resetAvatar: document.getElementById('reset-avatar'),
  backgroundImageUrl: document.getElementById('backgroundImageUrl'),
  backgroundImageFile: document.getElementById('backgroundImageFile'),
  resetBackground: document.getElementById('reset-background'),
  backgroundColor: document.getElementById('backgroundColor'),
  buttonColor: document.getElementById('buttonColor'),
  profileFontColor: document.getElementById('profileFontColor'),
  buttonFontColor: document.getElementById('buttonFontColor'),
  backgroundColorPicker: document.getElementById('backgroundColorPicker'),
  buttonColorPicker: document.getElementById('buttonColorPicker'),
  profileFontColorPicker: document.getElementById('profileFontColorPicker'),
  buttonFontColorPicker: document.getElementById('buttonFontColorPicker'),
  linksList: document.getElementById('linksList'),
  previewLinks: document.getElementById('previewLinks'),
  previewName: document.getElementById('previewName'),
  previewBio: document.getElementById('previewBio'),
  previewUsername: document.getElementById('previewUsername'),
  previewAvatar: document.getElementById('previewAvatar'),
  previewSocial: document.getElementById('previewSocial'),
  previewScreen: document.querySelector('.preview-screen'),
  addLinkBtn: document.getElementById('addLinkBtn'),
  linkModal: document.getElementById('linkModal'),
  linkForm: document.getElementById('linkForm'),
  modalTitle: document.getElementById('modalTitle'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  socialModal: document.getElementById('socialModal'),
  socialForm: document.getElementById('socialForm'),
  socialUrl: document.getElementById('socialUrl'),
  socialModalTitle: document.getElementById('socialModalTitle'),
  closeSocialBtn: document.getElementById('closeSocialBtn'),
  resetAll: document.getElementById('reset-all'),
  copyLink: document.getElementById('copy-link'),
  sheetOpen: document.getElementById('sheet-open'),
  sheetClose: document.getElementById('sheet-close')
};

const socialIcons = {
  instagram: '📸',
  tiktok: '🎵',
  youtube: '📺',
  x: '🐤',
  facebook: '📘',
  discord: '🎧'
};

let editingId = null;
let openLayoutId = null;
let draggingLinkId = null;
let activeSocialSlot = null;

function saveAll() {
  storage.set('wemint_profile_page_profile', profile);
  storage.set('wemint_profile_page_links', links);
  storage.set('wemint_profile_page_social', socialLinks);
  storage.set('wemint_profile_page_appearance', appearance);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function updateProfileFromInputs() {
  profile.name = elements.profileName.value.trim() || defaultProfile.name;
  profile.username = elements.profileUsername.value.trim();
  profile.bio = elements.profileBio.value.trim() || defaultProfile.bio;
  saveAll();
  renderProfile();
}

function renderProfile() {
  elements.previewName.textContent = profile.name;
  elements.previewBio.textContent = profile.bio;
  const slug = slugify(profile.username || profile.name) || 'profile';
  elements.previewUsername.textContent = `wemint.link/${slug}`;
}

function syncInputs() {
  elements.profileName.value = profile.name || '';
  elements.profileUsername.value = profile.username || '';
  elements.profileBio.value = profile.bio || '';
  elements.backgroundImageUrl.value = appearance.backgroundImageUrl || '';
  elements.backgroundColor.value = appearance.backgroundColor || '';
  elements.buttonColor.value = appearance.buttonColor || '';
  elements.profileFontColor.value = appearance.profileFontColor || '';
  elements.buttonFontColor.value = appearance.buttonFontColor || '';
  if (elements.backgroundColorPicker) {
    elements.backgroundColorPicker.value = appearance.backgroundColor || '#f7f7f8';
  }
  if (elements.buttonColorPicker) {
    elements.buttonColorPicker.value = appearance.buttonColor || '#1c1f24';
  }
  if (elements.profileFontColorPicker) {
    elements.profileFontColorPicker.value = appearance.profileFontColor || '#1c1f24';
  }
  if (elements.buttonFontColorPicker) {
    elements.buttonFontColorPicker.value = appearance.buttonFontColor || '#ffffff';
  }
}

function applyAppearance() {
  if (!elements.previewScreen) return;
  elements.previewScreen.style.setProperty('--preview-bg', appearance.backgroundColor || '#f7f7f8');
  elements.previewScreen.style.setProperty('--preview-button', appearance.buttonColor || '#1c1f24');
  elements.previewScreen.style.setProperty('--preview-button-text', appearance.buttonFontColor || '#ffffff');
  elements.previewScreen.style.setProperty('--preview-text', appearance.profileFontColor || '#1c1f24');
  elements.previewScreen.style.setProperty('--preview-muted', appearance.profileFontColor || '#6f7682');
  elements.previewScreen.style.backgroundColor = appearance.backgroundColor || '#f7f7f8';
  elements.previewScreen.style.backgroundImage = appearance.backgroundImageUrl
    ? `url(${appearance.backgroundImageUrl})`
    : 'none';

  const hasAvatar = Boolean(appearance.profileImageUrl);
  elements.previewAvatar.style.backgroundImage = hasAvatar ? `url(${appearance.profileImageUrl})` : 'none';
  elements.previewAvatar.classList.toggle('has-image', hasAvatar);
}

function readImageFile(file, onLoad) {
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result);
  reader.readAsDataURL(file);
}

function renderSocialSlots() {
  document.querySelectorAll('.social-slot').forEach((slot) => {
    const key = slot.dataset.platform;
    const url = socialLinks[key];
    slot.classList.toggle('is-filled', Boolean(url));
    if (url) {
      slot.setAttribute('title', url);
    } else {
      slot.removeAttribute('title');
    }
  });
}

function renderPreviewSocial() {
  elements.previewSocial.innerHTML = '';
  Object.entries(socialLinks).forEach(([key, url]) => {
    if (!url) return;
    const icon = document.createElement('span');
    icon.textContent = socialIcons[key] || '🔗';
    icon.title = url;
    elements.previewSocial.appendChild(icon);
  });
}

function createLayoutPanel(link) {
  const panel = document.createElement('div');
  panel.className = 'layout-card';

  const layoutOptions = [
    {
      id: 'classic',
      title: 'Classic',
      desc: 'Compact and clean layout.'
    },
    {
      id: 'featured',
      title: 'Featured',
      desc: 'Show a large card with image.'
    }
  ];

  let optionsHTML = '';
  layoutOptions.forEach((option) => {
    const isSelected =
      (option.id === 'featured' && link.featured) || (option.id === 'classic' && !link.featured);

    let extraContent = '';
    if (option.id === 'featured') {
      extraContent = `
        <div class="thumbnail-row">
          <button class="add-thumbnail-btn" type="button">
            <span class="material-symbols-outlined">add_photo_alternate</span>
            Add thumbnail
          </button>
          <button class="reset-thumbnail-btn" type="button">
            <span class="material-symbols-outlined">refresh</span>
            Reset
          </button>
          <input class="thumbnail-input" type="file" accept="image/*" />
        </div>
        <div class="thumbnail-hint">No thumbnail yet.</div>
        <div class="thumbnail-preview"></div>
      `;
    }

    optionsHTML += `
      <label class="layout-option${isSelected ? ' is-selected' : ''}" data-layout="${option.id}">
        <input type="radio" name="layout-${link.id}" value="${option.id}" ${isSelected ? 'checked' : ''} />
        <div class="layout-text">
          <div class="link-title">${option.title}</div>
          <div class="muted">${option.desc}</div>
          ${extraContent}
        </div>
        <div class="layout-preview">${option.id === 'featured' ? 'Featured' : 'Classic'}</div>
      </label>
    `;
  });

  panel.innerHTML = `
    <div class="layout-bar">
      <h3>Layout</h3>
      <button class="icon-btn-sm layout-close-btn" aria-label="Close">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <div class="layout-body">
      <p class="muted">Choose a layout for your link</p>
      <div class="layout-options">${optionsHTML}</div>
    </div>
  `;

  panel.querySelector('.layout-close-btn').addEventListener('click', () => {
    openLayoutId = null;
    renderLinks();
  });

  panel.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      link.featured = input.value === 'featured';
      saveAll();
      renderPreview();
      renderLinks();
    });
  });

  const thumbInput = panel.querySelector('.thumbnail-input');
  const thumbButton = panel.querySelector('.add-thumbnail-btn');
  const resetThumbButton = panel.querySelector('.reset-thumbnail-btn');
  const thumbPreview = panel.querySelector('.thumbnail-preview');
  const thumbHint = panel.querySelector('.thumbnail-hint');

  const updateThumbnailUI = () => {
    if (!thumbPreview || !thumbHint) return;
    if (link.thumbnail) {
      thumbPreview.innerHTML = `<img src="${escapeHTML(link.thumbnail)}" alt="" />`;
      thumbHint.textContent = 'Thumbnail ready.';
    } else {
      thumbPreview.innerHTML = '';
      thumbHint.textContent = 'No thumbnail yet.';
    }
  };

  if (thumbButton && thumbInput) {
    thumbInput.addEventListener('change', () => {
      const file = thumbInput.files?.[0];
      if (!file) return;
      readImageFile(file, (dataUrl) => {
        link.thumbnail = dataUrl;
        saveAll();
        renderPreview();
        renderLinks();
      });
    });

    thumbButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      thumbInput.click();
    });
  }

  if (resetThumbButton) {
    resetThumbButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      link.thumbnail = '';
      saveAll();
      renderPreview();
      renderLinks();
    });
  }

  updateThumbnailUI();

  return panel;
}

function renderLinks() {
  elements.linksList.innerHTML = '';

  links.forEach((link) => {
    const card = document.createElement('div');
    card.className = 'link-card';

    const safeTitle = escapeHTML(link.title);
    const safeUrl = escapeHTML(link.url);
    const displayUrl = link.url.length > 45 ? `${safeUrl.substring(0, 45)}...` : safeUrl;
    const isLayoutOpen = openLayoutId === link.id;

    card.innerHTML = `
      <div class="link-row">
        <div class="link-drag">
          <span class="material-symbols-outlined">drag_indicator</span>
        </div>
        <div class="link-info">
          <div class="link-title-row">
            <span class="link-title">${safeTitle}</span>
            <button class="icon-btn-sm edit-link-btn" aria-label="Edit title">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
          <div class="link-url-row">
            <span class="link-url">${displayUrl}</span>
            <button class="icon-btn-sm edit-link-btn" aria-label="Edit URL">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
        </div>
        <div class="link-right">
          <label class="switch">
            <input type="checkbox" ${link.enabled ? 'checked' : ''} />
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="link-meta-row">
        <div class="link-tool-icons">
          <button class="icon-btn-sm layout-toggle-btn${isLayoutOpen ? ' is-active' : ''}" aria-label="Layout">
            <span class="material-symbols-outlined">grid_view</span>
          </button>
          <button class="icon-btn-sm" aria-label="Pin">
            <span class="material-symbols-outlined">push_pin</span>
          </button>
          <button class="icon-btn-sm" aria-label="Thumbnail">
            <span class="material-symbols-outlined">image</span>
          </button>
          <button class="icon-btn-sm" aria-label="Favorite">
            <span class="material-symbols-outlined">star</span>
          </button>
          <button class="icon-btn-sm" aria-label="Copy">
            <span class="material-symbols-outlined">content_copy</span>
          </button>
          <button class="icon-btn-sm" aria-label="Lock">
            <span class="material-symbols-outlined">lock</span>
          </button>
        </div>
        <button class="link-delete" aria-label="Delete">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;

    card.querySelector('.switch input').addEventListener('change', (event) => {
      link.enabled = event.target.checked;
      saveAll();
      renderPreview();
    });

    card.querySelectorAll('.edit-link-btn').forEach((btn) => {
      btn.addEventListener('click', () => openModal(link.id));
    });

    card.querySelector('.layout-toggle-btn').addEventListener('click', () => {
      openLayoutId = openLayoutId === link.id ? null : link.id;
      renderLinks();
    });

    card.querySelector('.link-delete').addEventListener('click', () => {
      const index = links.findIndex((item) => item.id === link.id);
      if (index > -1) {
        links.splice(index, 1);
        if (openLayoutId === link.id) openLayoutId = null;
        saveAll();
        renderLinks();
        renderPreview();
      }
    });

    const dragHandle = card.querySelector('.link-drag');
    if (dragHandle) {
      dragHandle.setAttribute('draggable', 'true');
      dragHandle.addEventListener('dragstart', (event) => {
        draggingLinkId = link.id;
        card.classList.add('is-dragging');
        event.dataTransfer.setData('text/plain', link.id);
        event.dataTransfer.effectAllowed = 'move';
      });
      dragHandle.addEventListener('dragend', () => {
        draggingLinkId = null;
        card.classList.remove('is-dragging');
      });
    }

    card.addEventListener('dragover', (event) => {
      if (!draggingLinkId || draggingLinkId === link.id) return;
      event.preventDefault();
      card.classList.add('drag-over');
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (event) => {
      if (!draggingLinkId || draggingLinkId === link.id) return;
      event.preventDefault();
      card.classList.remove('drag-over');
      const fromIndex = links.findIndex((item) => item.id === draggingLinkId);
      const toIndex = links.findIndex((item) => item.id === link.id);
      if (fromIndex < 0 || toIndex < 0) return;
      const [moved] = links.splice(fromIndex, 1);
      const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      links.splice(insertIndex, 0, moved);
      saveAll();
      renderLinks();
      renderPreview();
    });

    elements.linksList.appendChild(card);

    if (isLayoutOpen) {
      const layoutPanel = createLayoutPanel(link);
      elements.linksList.appendChild(layoutPanel);
    }
  });
}

function renderPreview() {
  elements.previewLinks.innerHTML = '';
  links
    .filter((link) => link.enabled)
    .forEach((link) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const safeTitle = escapeHTML(link.title);

      if (link.featured) {
        btn.className = 'preview-link featured';
        const thumbContent = link.thumbnail ? `<img src="${escapeHTML(link.thumbnail)}" alt="" />` : '';
        btn.innerHTML = `
          <div class="preview-link-thumb">${thumbContent}</div>
          <div class="preview-link-meta">
            <span>${safeTitle}</span>
            <span class="material-symbols-outlined">more_horiz</span>
          </div>
        `;
      } else {
        btn.className = 'preview-link';
        btn.innerHTML = `
          <span>${safeTitle}</span>
          <span class="material-symbols-outlined">more_horiz</span>
        `;
      }

      elements.previewLinks.appendChild(btn);
    });

  renderPreviewSocial();
}

function openModal(id = null) {
  editingId = id;
  const isEdit = Boolean(id);
  elements.modalTitle.textContent = isEdit ? 'Edit link' : 'Add link';
  const link = links.find((item) => item.id === id);
  elements.linkForm.reset();
  if (link) {
    elements.linkForm.title.value = link.title;
    elements.linkForm.url.value = link.url;
  }
  elements.linkModal.classList.add('is-open');
}

function closeModal() {
  elements.linkModal.classList.remove('is-open');
}

function openSocialModal(slot) {
  activeSocialSlot = slot;
  const label = slot.dataset.label || 'social';
  elements.socialModalTitle.textContent = `Add ${label} link`;
  const currentUrl = socialLinks[slot.dataset.platform] || '';
  elements.socialUrl.value = currentUrl;
  elements.socialModal.classList.add('is-open');
}

function closeSocialModal() {
  elements.socialModal.classList.remove('is-open');
  activeSocialSlot = null;
}

function resetAll() {
  Object.assign(profile, defaultProfile);
  links.splice(0, links.length, ...defaultLinks.map((item) => ({ ...item, id: crypto.randomUUID() })));
  Object.keys(socialLinks).forEach((key) => delete socialLinks[key]);
  Object.assign(appearance, defaultAppearance);
  saveAll();
  syncInputs();
  renderProfile();
  renderLinks();
  renderPreview();
  renderSocialSlots();
  applyAppearance();
}

function toggleSheet(open) {
  if (!window.matchMedia('(max-width: 900px)').matches) return;
  document.body.classList.toggle('sheet-open', open);
}

function initEvents() {
  [elements.profileName, elements.profileUsername, elements.profileBio].forEach((input) => {
    input.addEventListener('input', updateProfileFromInputs);
    input.addEventListener('change', updateProfileFromInputs);
  });

  elements.profileAvatarUpload.addEventListener('change', () => {
    const file = elements.profileAvatarUpload.files?.[0];
    if (!file) return;
    readImageFile(file, (dataUrl) => {
      appearance.profileImageUrl = dataUrl;
      saveAll();
      applyAppearance();
    });
  });

  elements.resetAvatar.addEventListener('click', () => {
    appearance.profileImageUrl = '';
    elements.profileAvatarUpload.value = '';
    saveAll();
    applyAppearance();
  });

  elements.backgroundImageUrl.addEventListener('input', () => {
    appearance.backgroundImageUrl = elements.backgroundImageUrl.value.trim();
    saveAll();
    applyAppearance();
  });

  elements.backgroundImageFile.addEventListener('change', () => {
    const file = elements.backgroundImageFile.files?.[0];
    if (!file) return;
    readImageFile(file, (dataUrl) => {
      appearance.backgroundImageUrl = dataUrl;
      elements.backgroundImageUrl.value = '';
      saveAll();
      applyAppearance();
    });
  });

  elements.resetBackground.addEventListener('click', () => {
    appearance.backgroundImageUrl = '';
    elements.backgroundImageFile.value = '';
    elements.backgroundImageUrl.value = '';
    saveAll();
    applyAppearance();
  });

  const wireColorPicker = (picker, input, key) => {
    if (!picker || !input) return;
    picker.addEventListener('input', () => {
      input.value = picker.value;
      appearance[key] = picker.value;
      saveAll();
      applyAppearance();
    });
    input.addEventListener('input', () => {
      const value = input.value.trim();
      if (/^#([0-9a-fA-F]{6})$/.test(value)) {
        picker.value = value;
        appearance[key] = value;
        saveAll();
        applyAppearance();
      }
    });
  };

  wireColorPicker(elements.backgroundColorPicker, elements.backgroundColor, 'backgroundColor');
  wireColorPicker(elements.buttonColorPicker, elements.buttonColor, 'buttonColor');
  wireColorPicker(elements.profileFontColorPicker, elements.profileFontColor, 'profileFontColor');
  wireColorPicker(elements.buttonFontColorPicker, elements.buttonFontColor, 'buttonFontColor');

  elements.addLinkBtn.addEventListener('click', () => openModal());
  elements.closeModalBtn.addEventListener('click', closeModal);
  elements.linkModal.addEventListener('click', (event) => {
    if (event.target === elements.linkModal) closeModal();
  });

  elements.linkForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(elements.linkForm);
    const linkData = {
      id: editingId || crypto.randomUUID(),
      title: formData.get('title'),
      url: formData.get('url'),
      thumbnail: editingId ? links.find((item) => item.id === editingId)?.thumbnail || '' : '',
      featured: editingId ? links.find((item) => item.id === editingId)?.featured || false : false,
      enabled: true
    };

    if (editingId) {
      const index = links.findIndex((item) => item.id === editingId);
      if (index > -1) links[index] = { ...links[index], ...linkData };
    } else {
      links.unshift(linkData);
    }

    editingId = null;
    saveAll();
    renderLinks();
    renderPreview();
    closeModal();
  });

  document.querySelectorAll('.social-slot').forEach((slot) => {
    slot.addEventListener('click', () => openSocialModal(slot));
  });

  elements.closeSocialBtn.addEventListener('click', closeSocialModal);
  elements.socialModal.addEventListener('click', (event) => {
    if (event.target === elements.socialModal) closeSocialModal();
  });

  elements.socialForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!activeSocialSlot) return;
    socialLinks[activeSocialSlot.dataset.platform] = elements.socialUrl.value.trim();
    saveAll();
    renderSocialSlots();
    renderPreviewSocial();
    closeSocialModal();
  });

  elements.resetAll.addEventListener('click', resetAll);

  elements.copyLink.addEventListener('click', async () => {
    const slug = slugify(profile.username || profile.name) || 'profile';
    const url = `wemint.link/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      elements.copyLink.classList.add('copied');
      setTimeout(() => elements.copyLink.classList.remove('copied'), 1200);
    } catch (err) {
      console.error('Copy failed', err);
    }
  });

  if (elements.sheetOpen) {
    elements.sheetOpen.addEventListener('click', () => toggleSheet(true));
  }
  if (elements.sheetClose) {
    elements.sheetClose.addEventListener('click', () => toggleSheet(false));
  }
  window.addEventListener('resize', () => toggleSheet(false));
}

function init() {
  syncInputs();
  renderProfile();
  renderLinks();
  renderPreview();
  renderSocialSlots();
  applyAppearance();
  initEvents();
}

init();
