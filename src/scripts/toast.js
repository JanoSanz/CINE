const CONTAINER_ID = 'cc-toast-container';
let containerEl = null;

function ensureContainer() {
  if (containerEl && document.body.contains(containerEl)) return containerEl;
  containerEl = document.getElementById(CONTAINER_ID);
  if (containerEl) return containerEl;

  containerEl = document.createElement('div');
  containerEl.id = CONTAINER_ID;
  containerEl.setAttribute('role', 'status');
  containerEl.setAttribute('aria-live', 'polite');
  containerEl.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
    max-width: calc(100vw - 3rem);
  `;
  document.body.appendChild(containerEl);
  return containerEl;
}

export function showToast(message, options = {}) {
  const { duration = 2500, variant = 'success' } = options;
  const container = ensureContainer();

  const toast = document.createElement('div');
  toast.className = `cc-toast cc-toast--${variant}`;
  toast.textContent = message;
  toast.style.cssText = `
    pointer-events: auto;
    padding: 0.75rem 1rem;
    min-width: 220px;
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-left: 3px solid var(--cc-toast-accent, var(--color-success));
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-size: 0.9rem;
    font-weight: 500;
    transform: translateX(120%);
    opacity: 0;
    transition: transform 250ms ease, opacity 250ms ease;
  `;

  if (variant === 'error') {
    toast.style.setProperty('--cc-toast-accent', 'var(--color-error)');
  } else if (variant === 'info') {
    toast.style.setProperty('--cc-toast-accent', 'var(--color-primary)');
  }

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
