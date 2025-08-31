import {LitElement, html, css} from 'lit';
import {msg, updateWhenLocaleChanges} from '@lit/localize';
import {globalCss} from '../global-css.js';

export class ModalComponent extends LitElement {
  static styles = [
    globalCss,
    css`
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--z-modal);
      }

      .modal-container {
        background: var(--color-white);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-xl);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: modalSlideIn 0.3s ease-out;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg) var(--spacing-lg);
      }

      .modal-title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-primary);
        margin: 0;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: var(--font-size-xl);
        color: var(--color-primary);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--border-radius-sm);
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      }

      .modal-close:hover {
        background: var(--color-gray-100);
        color: var(--color-primary);
      }

      .modal-body {
        padding: var(--spacing-lg);
        padding-top: 0;
      }

      .modal-message {
        font-size: var(--font-size-base);
        color: var(--color-text-primary);
        line-height: 1.6;
        margin-bottom: var(--spacing-lg);
        margin-top: 0;
      }

      .modal-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
      }

      .modal-btn {
        padding: var(--spacing-md) var(--spacing-xl);
        border: none;
        border-radius: var(--border-radius-md);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: all var(--transition-normal);
        min-width: 120px;
        height: 44px;
      }

      .modal-btn-cancel {
        background: var(--color-white);
        color: var(--color-secondary);
        border: 1px solid var(--color-secondary);
      }

      .modal-btn-cancel:hover {
        background: var(--color-secondary);
        color: var(--color-white);
      }

      .modal-btn-confirm {
        background: var(--color-danger);
        color: var(--color-white);
      }

      .modal-btn-confirm:hover {
        background: var(--color-danger-hover);
      }

      .modal-btn-primary {
        background: var(--color-primary);
        color: var(--color-white);
      }

      .modal-btn-primary:hover {
        background: var(--color-primary-hover);
      }

      /* Responsive */
      @media (max-width: var(--mobile)) {
        .modal-container {
          width: 95%;
          margin: var(--spacing-sm);
        }

        .modal-header {
          padding: var(--spacing-md) var(--spacing-lg);
        }

        .modal-body {
          padding: var(--spacing-lg);
        }

        .modal-actions {
          flex-direction: column;
        }

        .modal-btn {
          width: 100%;
        }
      }
    `,
  ];

  static get properties() {
    return {
      open: {type: Boolean},
      title: {type: String},
      message: {type: String},
      confirmText: {type: String},
      cancelText: {type: String},
      type: {type: String}, // 'delete', 'confirm', 'info'
    };
  }

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.message = '';
    this.confirmText = msg('Confirm');
    this.cancelText = msg('Cancel');
    this.type = 'confirm';

    // Enable automatic re-render when locale changes
    updateWhenLocaleChanges(this);
  }

  render() {
    if (!this.open) {
      return html``;
    }

    return html`
      <div class="modal-overlay" @click=${this.handleOverlayClick}>
        <div class="modal-container" @click=${this.handleModalClick}>
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            <button class="modal-close" @click=${this.close}>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <p class="modal-message">${this.message}</p>

            <div class="modal-actions">
              <button
                class="modal-btn modal-btn-primary"
                @click=${this.handleConfirm}
              >
                ${this.confirmText}
              </button>
              <button
                class="modal-btn modal-btn-cancel"
                @click=${this.handleCancel}
              >
                ${this.cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openModal(options = {}) {
    this.title = options.title || '';
    this.message = options.message || '';
    this.confirmText = options.confirmText || msg('Confirm');
    this.cancelText = options.cancelText || msg('Cancel');
    this.type = options.type || 'confirm';
    this.open = true;
  }

  close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-close'));
  }

  handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  handleModalClick(e) {
    // Prevent closing when clicking inside modal
    e.stopPropagation();
  }

  handleCancel() {
    this.close();
    this.dispatchEvent(new CustomEvent('modal-cancel'));
  }

  handleConfirm() {
    this.close();
    this.dispatchEvent(new CustomEvent('modal-confirm'));
  }

  // Keyboard event handling
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = (e) => {
    if (!this.open) return;

    if (e.key === 'Escape') {
      this.close();
    } else if (e.key === 'Enter') {
      this.handleConfirm();
    }
  };
}

customElements.define('modal-component', ModalComponent);
