import {LitElement, html} from 'lit';
import {globalCss} from '../global-css.js';
import {css} from 'lit';
export class PaginationComponent extends LitElement {
  static styles = [
    globalCss,
    css`
      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        margin: var(--spacing-xl) 0;
        flex-wrap: wrap;
      }

      /* Responsive pagination */
      @media (max-width: var(--mobile)) {
        .pagination {
          gap: var(--spacing-xs);
        }

        .pagination-item {
          min-width: 32px;
          height: 32px;
          padding: 0 var(--spacing-sm);
          font-size: var(--font-size-xs);
        }
      }

      .pagination-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        height: 40px;
        padding: 0 var(--spacing-sm);
        border: 1px solid var(--color-border-light);
        background: var(--color-white);
        color: var(--color-text-primary);
        text-decoration: none;
        border-radius: var(--border-radius-md);
        cursor: pointer;
        transition: all var(--transition-normal);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
      }

      .pagination-item:hover:not(:disabled) {
        background: var(--color-gray-100);
        border-color: var(--color-gray-300);
      }

      .pagination-item.active {
        background: var(--color-primary);
        color: var(--color-white);
        border-color: var(--color-primary);
      }

      .pagination-item:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .pagination-arrow {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-bold);
      }

      .pagination-dots {
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-bold);
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
          <span class="pagination-arrow">‹</span>
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
          <span class="pagination-arrow">›</span>
        </button>
      </div>
    `;
  }

  getVisiblePages() {
    const pages = [];
    const maxVisible = 7; // Maximum visible page numbers

    if (this.totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (this.currentPage <= 4) {
        // Near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        // Near the end
        pages.push('...');
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
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
