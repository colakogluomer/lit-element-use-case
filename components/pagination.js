import {LitElement, html} from 'lit';
import {globalCss} from '../global-css.js';
import {css} from 'lit';
export class PaginationComponent extends LitElement {
  static styles = [
    globalCss,
    css`
      button:focus {
        outline: none;
        border: none;
      }
      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: var(--spacing-xl) 0;
        flex-wrap: wrap;
        padding: 12px 16px;
        border-radius: 8px;
      }

      @media (max-width: var(--mobile)) {
        .pagination {
          gap: 6px;
          padding: 8px 12px;
        }

        .pagination-item {
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          font-size: var(--font-size-xs);
        }
      }

      .pagination-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 36px;
        padding: 0 12px;
        border: none;
        background: transparent;
        color: #6c757d;
        text-decoration: none;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        font-weight: 500;
        font-family: inherit;
      }

      .pagination-item:hover:not(:disabled) {
        background: #e9ecef;
        color: #495057;
      }

      .pagination-item.active {
        background: var(--color-primary);
        color: white;
        font-weight: 600;
      }

      .pagination-item:disabled {
        color: #adb5bd;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .pagination-item:disabled:hover {
        background: transparent;
        color: #adb5bd;
      }

      .pagination-arrow {
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
      }

      .pagination-dots {
        color: #6c757d;
        font-weight: 600;
        cursor: default;
        padding: 0 4px;
      }

      .pagination-dots:hover {
        background: transparent;
        color: #6c757d;
      }
    `,
  ];

  static get properties() {
    return {
      currentPage: {type: Number},
      totalPages: {type: Number},
      totalItems: {type: Number},
      itemsPerPage: {type: Number},
      onPageChange: {type: Function},
    };
  }

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalItems = 0;
    this.itemsPerPage = 10;
    this.onPageChange = () => {};
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    const pages = this.getVisiblePages();

    return html`
      <div class="pagination">
        <!-- Previous Button -->
        <button
          class="pagination-item"
          ?disabled=${this.currentPage === 1}
          @click=${() => this.handlePageChange(this.currentPage - 1)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <!-- Page Numbers -->
        ${pages.map((page) => {
          if (page === '...') {
            return html`<span class="pagination-item pagination-dots"
              >...</span
            >`;
          }

          return html`
            <button
              class="pagination-item ${page === this.currentPage
                ? 'active'
                : ''}"
              @click=${() => this.handlePageChange(page)}
            >
              ${page}
            </button>
          `;
        })}

        <!-- Next Button -->
        <button
          class="pagination-item"
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this.handlePageChange(this.currentPage + 1)}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    `;
  }

  getVisiblePages() {
    const pages = [];
    const maxVisible = 7; // Maximum visible page numbers

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  handlePageChange(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.onPageChange(page);
    }
  }

  updated(changedProperties) {
    if (
      changedProperties.has('totalItems') ||
      changedProperties.has('itemsPerPage')
    ) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    }
  }
}

customElements.define('pagination-component', PaginationComponent);
