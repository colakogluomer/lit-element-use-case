import {LitElement, css, html} from 'lit';
import {Router} from '@vaadin/router';
import {msg, updateWhenLocaleChanges, str} from '@lit/localize';
import store from '../store/employee';
import '../components/pagination.js';
import '../components/modal.js';
import {globalCss} from '../global-css.js';

export class EmployeesPage extends LitElement {
  static styles = [
    globalCss,
    css`
      .view-toggle {
        display: flex;
        border: none;
        border-radius: var(--border-radius-md);
        overflow: hidden;
        background: var(--color-gray-100);
        padding: var(--spacing-xs);
        gap: var(--spacing-xs);
      }

      .view-toggle button {
        padding: var(--spacing-sm);
        border: none;
        background: transparent;
        cursor: pointer;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
        height: 48px;
        border-radius: var(--border-radius-sm);
      }

      .view-toggle button svg {
        flex-shrink: 0;
        color: var(--color-text-secondary);
        transition: color var(--transition-normal);
      }

      .view-toggle button.active {
        background: var(--color-white);
      }

      .view-toggle button.active svg {
        color: var(--color-primary);
      }

      .view-toggle button:hover:not(.active) {
        background: var(--color-white);
      }

      .view-toggle button:hover:not(.active) svg {
        color: var(--color-primary);
      }

      .table-container {
        background: var(--color-white);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        overflow-x: auto;
        overflow-y: hidden;
      }

      table {
        width: 100%;
        min-width: 800px; /* Minimum width to ensure horizontal scroll */
        border-collapse: collapse;
      }

      tr {
        border-bottom: 1px solid var(--color-border-light);
      }

      th,
      td {
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: left;
      }

      th {
        background-color: var(--color-bg-tertiary);
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
      }

      tr:hover {
        background-color: var(--color-bg-tertiary);
      }

      .checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .actions {
        display: flex;
        gap: var(--spacing-sm);
      }

      .btn {
        padding: var(--spacing-sm);
        border: none;
        background: transparent;
        cursor: pointer;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 44px;
        height: 44px;
        border-radius: var(--border-radius-sm);
      }

      .btn svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        color: var(--color-primary);
      }

      .btn-edit:hover {
        background-color: var(--color-gray-100);
      }

      .btn-delete:hover {
        background-color: var(--color-gray-100);
      }

      .btn-bulk-delete {
        background: transparent;
        color: var(--color-primary);
        padding: var(--spacing-sm);
        border: none;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
        height: 48px;
        transition: all var(--transition-normal);
      }

      .btn-bulk-delete svg {
        flex-shrink: 0;
        color: var(--color-primary);
      }

      .btn-bulk-delete:hover {
        background-color: var(--color-gray-100);
      }

      .btn-bulk-delete:disabled {
        background-color: transparent;
        cursor: not-allowed;
      }

      .btn-bulk-delete:disabled svg {
        color: var(--color-gray-400);
      }

      /* Card View Styles */
      .card-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
      }

      /* Responsive breakpoints for card grid */
      @media (max-width: 768px) {
        .card-grid {
          grid-template-columns: 1fr;
        }

        .card-detail {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xs);
        }

        .card-detail-label {
          min-width: auto;
        }

        .card-detail-value {
          text-align: left;
        }
      }

      @media (max-width: 480px) {
        .employee-card {
          padding: var(--spacing-md);
        }

        .card-detail {
          font-size: var(--font-size-xs);
        }
      }

      .employee-card {
        background: var(--color-white);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        padding: var(--spacing-lg);
        transition: transform var(--transition-normal),
          box-shadow var(--transition-normal);
        position: relative;
      }

      .employee-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .card-checkbox {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        width: 18px;
        height: 18px;
        cursor: pointer;
        z-index: 1;
      }

      .card-name {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .card-email {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-md);
      }

      .card-details {
        display: flex;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
      }

      .card-details-column {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        flex: 1;
      }

      .card-detail {
        display: flex;
        flex-direction: column;
        font-size: var(--font-size-sm);
        padding: var(--spacing-xs) 0;
      }

      .card-detail-label {
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        min-width: 120px;
      }

      .card-detail-value {
        color: var(--color-text-primary);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
      }

      .card-actions {
        display: inline-flex;
        gap: var(--spacing-sm);
      }

      .card-btn {
        flex: 1;
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        cursor: pointer;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        min-height: 40px;
        border-radius: var(--border-radius-md);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
      }

      .card-btn svg {
        width: 24px;
        height: 24px;
        color: var(--color-white);
      }

      .card-btn-edit {
        background: var(--color-secondary);
        color: var(--color-white);
      }

      .card-btn-edit:hover {
        background: var(--color-secondary-hover);
      }

      .card-btn-delete {
        background: var(--color-primary);
        color: var(--color-white);
      }

      .card-btn-delete:hover {
        background: var(--color-primary-hover);
      }
    `,
  ];

  static get properties() {
    return {
      employees: {type: Array},
      selectedEmployees: {type: Array},
      viewMode: {type: String},
      pagination: {type: Object},
      totalPages: {type: Number},
      deleteModalOpen: {type: Boolean},
      employeeToDelete: {type: Object},
    };
  }

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployees = [];
    this.viewMode = 'table';
    this.pagination = {currentPage: 1, itemsPerPage: 10};
    this.totalPages = 1;
    this.deleteModalOpen = false;
    this.employeeToDelete = null;

    // Subscribe to store changes
    store.subscribe((state) => {
      this.employees = state.employees;
      this.viewMode = state.viewMode;
      this.pagination = state.pagination;
      this.totalPages = state.getTotalPages();
    });

    // Get initial state
    const initialState = store.getState();
    this.employees = initialState.employees;
    this.viewMode = initialState.viewMode;
    this.pagination = initialState.pagination;
    this.totalPages = initialState.getTotalPages();

    // Enable automatic re-render when locale changes
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">${msg('Employees')}</h1>
          <div class="controls">
            <div class="view-toggle">
              <button
                class="${this.viewMode === 'table' ? 'active' : ''}"
                @click=${() => this.handleViewModeChange('table')}
                title="${msg('Table View')}"
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
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <button
                class="${this.viewMode === 'card' ? 'active' : ''}"
                @click=${() => this.handleViewModeChange('card')}
                title="${msg('Card View')}"
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
                  <rect x="3" y="3" width="3" height="3" rx="1" />
                  <rect x="9" y="3" width="3" height="3" rx="1" />
                  <rect x="15" y="3" width="3" height="3" rx="1" />
                  <rect x="3" y="9" width="3" height="3" rx="1" />
                  <rect x="9" y="9" width="3" height="3" rx="1" />
                  <rect x="15" y="9" width="3" height="3" rx="1" />
                  <rect x="3" y="15" width="3" height="3" rx="1" />
                  <rect x="9" y="15" width="3" height="3" rx="1" />
                  <rect x="15" y="15" width="3" height="3" rx="1" />
                </svg>
              </button>
            </div>
            <button
              class="btn-bulk-delete"
              ?disabled=${this.selectedEmployees.length === 0}
              @click=${this.handleBulkDelete}
              title="${msg('Delete Selected')} (${this.selectedEmployees
                .length})"
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
                <polyline points="3,6 5,6 21,6" />
                <path
                  d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
                />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>

        ${this.viewMode === 'table'
          ? this.renderTableView()
          : this.renderCardView()}

        <pagination-component
          .currentPage=${this.pagination.currentPage}
          .totalPages=${this.totalPages}
          .totalItems=${store.getState().totalCount}
          .itemsPerPage=${this.pagination.itemsPerPage}
          .onPageChange=${this.handlePageChange}
        ></pagination-component>

        <modal-component
          .open=${this.deleteModalOpen}
          @modal-confirm=${this.handleDeleteConfirm}
          @modal-cancel=${this.handleDeleteCancel}
        ></modal-component>
      </div>
    `;
  }

  renderTableView() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  class="checkbox"
                  .checked=${this.selectedEmployees.length ===
                    this.employees.length && this.employees.length > 0}
                  @change=${this.handleSelectAll}
                />
              </th>

              <th>${msg('First Name')}</th>
              <th>${msg('Last Name')}</th>
              <th>${msg('Date of Employment')}</th>
              <th>${msg('Date of Birth')}</th>
              <th>${msg('Phone')}</th>
              <th>${msg('Email')}</th>
              <th>${msg('Department')}</th>
              <th>${msg('Position')}</th>
              <th>${msg('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(
              (employee) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      class="checkbox"
                      .checked=${this.selectedEmployees.includes(employee.id)}
                      @change=${(e) =>
                        this.handleSelectEmployee(
                          employee.id,
                          e.target.checked
                        )}
                    />
                  </td>

                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>
                    ${new Date(employee.dateOfEmployment).toLocaleDateString()}
                  </td>
                  <td>
                    ${new Date(employee.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td class="actions">
                    <button
                      class="btn btn-edit"
                      @click=${() => this.handleEdit(employee)}
                      title="${msg('Edit')}"
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                    <button
                      class="btn btn-delete"
                      @click=${() => this.handleDelete(employee.id)}
                      title="${msg('Delete')}"
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3,6 5,6 21,6" />
                        <path
                          d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
                        />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  renderCardView() {
    return html`
      <div class="card-grid">
        ${this.employees.map(
          (employee) => html`
            <div class="employee-card">
              <input
                type="checkbox"
                class="card-checkbox"
                .checked=${this.selectedEmployees.includes(employee.id)}
                @change=${(e) =>
                  this.handleSelectEmployee(employee.id, e.target.checked)}
              />

              <div class="card-details">
                <div class="card-details-column">
                  <div class="card-detail">
                    <div class="card-detail-label">First Name:</div>
                    <div class="card-detail-value">${employee.firstName}</div>
                  </div>
                  <div class="card-detail">
                    <div class="card-detail-label">Date of Employment:</div>
                    <div class="card-detail-value">
                      ${new Date(
                        employee.dateOfEmployment
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div class="card-detail">
                    <div class="card-detail-label">Phone:</div>
                    <div class="card-detail-value">${employee.phone}</div>
                  </div>
                  <div class="card-detail">
                    <div class="card-detail-label">Department:</div>
                    <div class="card-detail-value">${employee.department}</div>
                  </div>
                </div>
                <div class="card-details-column">
                  <div class="card-detail">
                    <div class="card-detail-label">Last Name:</div>
                    <div class="card-detail-value">${employee.lastName}</div>
                  </div>
                  <div class="card-detail">
                    <div class="card-detail-label">Date of Birth:</div>
                    <div class="card-detail-value">
                      ${new Date(employee.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                  <div class="card-detail">
                    <div class="card-detail-label">Email:</div>
                    <div class="card-detail-value">${employee.email}</div>
                  </div>
                  <div class="card-detail">
                    <div class="card-detail-label">Position:</div>
                    <div class="card-detail-value">${employee.position}</div>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button
                  class="card-btn card-btn-edit"
                  @click=${() => this.handleEdit(employee)}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                  ${msg('Edit')}
                </button>
                <button
                  class="card-btn card-btn-delete"
                  @click=${() => this.handleDelete(employee.id)}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="3,6 5,6 21,6" />
                    <path
                      d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
                    />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  ${msg('Delete')}
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  handleViewModeChange(mode) {
    store.getState().setViewMode(mode);
  }

  handlePageChange(page) {
    store.getState().setCurrentPage(page);
  }

  handleSelectAll(e) {
    if (e.target.checked) {
      this.selectedEmployees = this.employees.map((emp) => emp.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  handleSelectEmployee(id, checked) {
    if (checked) {
      this.selectedEmployees = [...this.selectedEmployees, id];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (empId) => empId !== id
      );
    }
  }

  handleEdit(employee) {
    store.getState().setSelectedEmployee(employee);
    Router.go(`/employees/edit/${employee.id}`);
  }

  handleDelete(id) {
    const employee = this.employees.find((emp) => emp.id === id);
    this.employeeToDelete = employee;
    this.deleteModalOpen = true;

    // Open modal with delete confirmation
    const modal = this.shadowRoot.querySelector('modal-component');
    modal.openModal({
      title: msg('Are you sure?'),
      message: msg(
        str`Selected Employee record of ${employee.firstName} ${employee.lastName} will be deleted`
      ),
      confirmText: msg('Proceed'),
      cancelText: msg('Cancel'),
      type: 'delete',
    });
  }

  handleBulkDelete() {
    this.deleteModalOpen = true;

    // Open modal with bulk delete confirmation
    const modal = this.shadowRoot.querySelector('modal-component');
    modal.openModal({
      title: msg('Are you sure?'),
      message: msg(
        str`Selected ${this.selectedEmployees.length} Employee records will be deleted`
      ),
      confirmText: msg('Proceed'),
      cancelText: msg('Cancel'),
      type: 'delete',
    });
  }

  handleDeleteConfirm() {
    if (this.employeeToDelete) {
      // Single employee delete
      store.getState().removeEmployee(this.employeeToDelete.id);
      this.employeeToDelete = null;
    } else {
      // Bulk delete
      store.getState().removeMultipleEmployees(this.selectedEmployees);
      this.selectedEmployees = [];
    }
    this.deleteModalOpen = false;
  }

  handleDeleteCancel() {
    this.deleteModalOpen = false;
    this.employeeToDelete = null;
  }
}

customElements.define('employees-page', EmployeesPage);
