import {LitElement, html} from 'lit';
import {Router} from '@vaadin/router';
import {msg, updateWhenLocaleChanges} from '@lit/localize';
import store from '../store/employee';
import '../components/employee-form.js';
import '../components/modal.js';
import {globalCss} from '../global-css.js';

export class EditEmployeePage extends LitElement {
  static styles = [globalCss];

  static get properties() {
    return {
      employeeId: {type: Number},
      employee: {type: Object},
      loading: {type: Boolean},
      error: {type: String},
    };
  }

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
    this.loading = true;
    this.error = null;
    this.successModalOpen = false;
    this.employeeToUpdate = null;

    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployee();
  }

  loadEmployee() {
    const selectedEmployee = store.getState().selectedEmployee;

    if (selectedEmployee) {
      this.employee = selectedEmployee;
      this.employeeId = selectedEmployee.id;
      this.loading = false;
      store.getState().setSelectedEmployee(null);
      return;
    }

    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || isNaN(parseInt(id))) {
      this.error = msg('Employee ID is required');
      this.loading = false;
      return;
    }

    this.employeeId = parseInt(id);

    this.employee = store.getState().getEmployeeById(this.employeeId);

    if (!this.employee) {
      this.error = msg('Employee not found');
      this.loading = false;
      return;
    }

    this.loading = false;
  }

  render() {
    if (this.loading) {
      return html`<div class="page-container">
        <div class="loading">${msg('Loading employee data...')}</div>
      </div>`;
    }

    if (this.error) {
      return html`<div class="page-container">
        <div class="error">${this.error}</div>
      </div>`;
    }

    return html`
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">${msg('Edit Employee')}</h1>
        </div>

        <employee-form
          .employee=${this.employee}
          @employee-save=${this.handleEmployeeSave}
          @employee-cancel=${this.handleEmployeeCancel}
        ></employee-form>

        <modal-component
          .open=${this.successModalOpen}
          @modal-confirm=${this.handleSuccessConfirm}
          @modal-cancel=${this.handleSuccessCancel}
        ></modal-component>
      </div>
    `;
  }

  handleEmployeeSave(e) {
    const {employee} = e.detail;

    const modal = this.shadowRoot.querySelector('modal-component');
    modal.openModal({
      title: msg('Are you sure?'),
      message: msg('Are you sure you want to update this employee?'),
      confirmText: msg('Proceed'),
      cancelText: msg('Cancel'),
      type: 'confirm',
    });
    this.successModalOpen = true;
    this.employeeToUpdate = employee;
  }

  handleSuccessConfirm() {
    this.successModalOpen = false;
    store.getState().updateEmployee(this.employeeId, this.employeeToUpdate);
    this.employeeToUpdate = null;
    Router.go('/employees');
  }

  handleSuccessCancel() {
    this.successModalOpen = false;
  }

  handleEmployeeCancel() {
    Router.go('/employees');
  }
}

customElements.define('edit-employee-page', EditEmployeePage);
