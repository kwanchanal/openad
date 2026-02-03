// Elements
const amountInput = document.getElementById('amountInput');
const quickAmountBtns = document.querySelectorAll('.quick-amount-btn');
const messageInput = document.getElementById('messageInput');
const previewAmount = document.getElementById('previewAmount');
const previewCrypto = document.getElementById('previewCrypto');
const previewMessage = document.getElementById('previewMessage');
const receiveMethodRadios = document.querySelectorAll('input[name="receiveMethod"]');
const receiveDetails = document.getElementById('receiveDetails');
const receiveQr = document.getElementById('receiveQr');
const qrUpload = document.getElementById('qrUpload');
const uploadTitle = document.querySelector('.upload-title');

// Format number with commas
const formatNumber = (value) => {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('en-US');
};

// Format crypto amount
const formatCrypto = (value) => {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' USDT';
};

// Update preview
const updatePreview = () => {
  const value = amountInput.value;
  previewAmount.textContent = formatNumber(value);
  previewCrypto.textContent = formatCrypto(value);
};

// Set active quick amount button
const setActiveQuickAmount = (amount) => {
  quickAmountBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.amount === String(amount));
  });
};

// Amount input handler
amountInput.addEventListener('input', () => {
  updatePreview();
  setActiveQuickAmount(null);
});

// Quick amount buttons handler
quickAmountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = btn.dataset.amount;
    if (amount === 'custom') {
      amountInput.focus();
      amountInput.select();
      setActiveQuickAmount(amount);
      return;
    }
    amountInput.value = amount;
    updatePreview();
    setActiveQuickAmount(amount);
  });
});

// Message input handler
messageInput?.addEventListener('input', (e) => {
  const value = e.target.value.trim();
  if (previewMessage) {
    previewMessage.textContent = value || 'Payment request';
  }
});

// Unit dropdown
const unitDropdown = document.getElementById('unitDropdown');
unitDropdown?.addEventListener('click', () => {
  console.log('Unit dropdown clicked');
});

// Fiat toggle
const fiatToggle = document.getElementById('fiatToggle');
fiatToggle?.addEventListener('change', (e) => {
  console.log('Fiat mode:', e.target.checked);
});

// Receive message toggle
const receiveMessageToggle = document.getElementById('receiveMessageToggle');
receiveMessageToggle?.addEventListener('change', (e) => {
  console.log('Receive message:', e.target.checked);
});

// Receive method toggle
const updateReceiveMethod = () => {
  const selected = document.querySelector('input[name="receiveMethod"]:checked')?.value;
  if (!receiveDetails || !receiveQr) return;
  const showDetails = selected === 'details';
  receiveDetails.classList.toggle('hidden', !showDetails);
  receiveQr.classList.toggle('hidden', showDetails);
};

receiveMethodRadios.forEach((radio) => {
  radio.addEventListener('change', updateReceiveMethod);
});

// QR upload label text
qrUpload?.addEventListener('change', (e) => {
  const fileName = e.target.files?.[0]?.name;
  if (uploadTitle) {
    uploadTitle.textContent = fileName ? `Uploaded: ${fileName}` : 'Upload QR to receive payment';
  }
});

// Navigation buttons
const backBtn = document.querySelector('.nav-btn.back');
const nextBtn = document.querySelector('.nav-btn.next');

backBtn?.addEventListener('click', () => {
  console.log('Back clicked');
});

nextBtn?.addEventListener('click', () => {
  console.log('Next clicked');
});

// Initialize
updatePreview();
updateReceiveMethod();
