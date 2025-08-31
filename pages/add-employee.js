import {LitElement, html} from 'lit';
import {Router} from '@vaadin/router';
import {msg, updateWhenLocaleChanges} from '@lit/localize';
import store from '../store/employee';
import '../components/employee-form.js';
import '../components/modal.js';
import {globalCss} from '../global-css.js';

export class AddEmployeePage extends LitElement {
  static styles = [globalCss];

  constructor() {
    super();
    this.successModalOpen = false;
    this.employeeToSave = null;
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">${msg('Add New Employee')}</h1>
        </div>

        <employee-form
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
      message: msg('Are you sure you want to save this employee?'),
      confirmText: msg('Proceed'),
      cancelText: msg('Cancel'),
      type: 'confirm',
    });
    this.successModalOpen = true;
    this.employeeToSave = employee;
  }

  handleSuccessConfirm() {
    this.successModalOpen = false;
    store.getState().addEmployee(this.employeeToSave);
    this.employeeToSave = null;
    Router.go('/employees');
  }

  handleSuccessCancel() {
    this.successModalOpen = false;
  }

  handleEmployeeCancel() {
    Router.go('/employees');
  }
}

customElements.define('add-employee-page', AddEmployeePage);
