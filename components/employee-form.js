import {LitElement, html, css} from 'lit';
import {msg, updateWhenLocaleChanges} from '@lit/localize';
import {globalCss} from '../global-css.js';
import store from '../store/employee.js';

export class EmployeeForm extends LitElement {
  static styles = [
    globalCss,
    css`
      .btn {
        width: 100%;
      }
      .button-group {
        max-width: var(--mobile);
        margin: 0 auto;
      }
    `,
  ];

  static get properties() {
    return {
      employee: {type: Object},
      isEdit: {type: Boolean},
      formData: {type: Object},
      errors: {type: Object},
    };
  }

  constructor() {
    super();
    this.employee = null;
    this.isEdit = false;
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
    this.errors = {};

    // Enable automatic re-render when locale changes
    updateWhenLocaleChanges(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('employee') && this.employee) {
      this.formData = {...this.employee};
      this.isEdit = true;
    }
  }

  render() {
    return html`
      <div class="form-container">
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <!-- First Name -->
            <div class="form-group">
              <label class="form-label">${msg('First Name')}</label>
              <input
                type="text"
                class="form-input"
                .value=${this.formData.firstName}
                @input=${(e) => this.updateField('firstName', e.target.value)}
                required
              />
              ${this.errors.firstName
                ? html`<div class="error-message">
                    ${this.errors.firstName}
                  </div>`
                : ''}
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label class="form-label">${msg('Last Name')}</label>
              <input
                type="text"
                class="form-input"
                .value=${this.formData.lastName}
                @input=${(e) => this.updateField('lastName', e.target.value)}
                required
              />
              ${this.errors.lastName
                ? html`<div class="error-message">${this.errors.lastName}</div>`
                : ''}
            </div>

            <!-- Date of Employment -->
            <div class="form-group">
              <label class="form-label">${msg('Date of Employment')}</label>
              <input
                type="date"
                class="form-input"
                .value=${this.formData.dateOfEmployment}
                @input=${(e) =>
                  this.updateField('dateOfEmployment', e.target.value)}
                max=${new Date().toISOString().split('T')[0]}
                required
              />
              ${this.errors.dateOfEmployment
                ? html`<div class="error-message">
                    ${this.errors.dateOfEmployment}
                  </div>`
                : ''}
            </div>

            <!-- Date of Birth -->
            <div class="form-group">
              <label class="form-label">${msg('Date of Birth')}</label>
              <input
                type="date"
                class="form-input"
                .value=${this.formData.dateOfBirth}
                @input=${(e) => this.updateField('dateOfBirth', e.target.value)}
                max=${new Date().toISOString().split('T')[0]}
                required
              />
              ${this.errors.dateOfBirth
                ? html`<div class="error-message">
                    ${this.errors.dateOfBirth}
                  </div>`
                : ''}
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label class="form-label">${msg('Phone')}</label>
              <div class="phone-input-container">
                <span class="phone-prefix">+90</span>
                <input
                  type="tel"
                  class="form-input phone-input"
                  .value=${this.getPhoneNumberWithoutPrefix()}
                  @input=${(e) => this.handlePhoneInput(e)}
                  @keydown=${(e) => this.handlePhoneKeydown(e)}
                  placeholder="532 123 45 67"
                  required
                />
              </div>
              ${this.errors.phone
                ? html`<div class="error-message">${this.errors.phone}</div>`
                : ''}
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">${msg('Email')}</label>
              <input
                type="email"
                class="form-input"
                .value=${this.formData.email}
                @input=${(e) => this.updateField('email', e.target.value)}
                required
              />
              ${this.errors.email
                ? html`<div class="error-message">${this.errors.email}</div>`
                : ''}
            </div>

            <!-- Department -->
            <div class="form-group">
              <label class="form-label">${msg('Department')}</label>
              <select
                class="form-select"
                .value=${this.formData.department}
                @change=${(e) => this.updateField('department', e.target.value)}
                required
              >
                <option value="">${msg('Please Select')}</option>
                <option value="Tech">Tech</option>
                <option value="Analytics">Analytics</option>
              </select>
              ${this.errors.department
                ? html`<div class="error-message">
                    ${this.errors.department}
                  </div>`
                : ''}
            </div>

            <!-- Position -->
            <div class="form-group">
              <label class="form-label">${msg('Position')}</label>
              <select
                class="form-select"
                .value=${this.formData.position}
                @change=${(e) => this.updateField('position', e.target.value)}
                required
              >
                <option value="">${msg('Please Select')}</option>
                <option value="Junior">Junior</option>
                <option value="Medior">Medior</option>
                <option value="Senior">Senior</option>
              </select>
              ${this.errors.position
                ? html`<div class="error-message">${this.errors.position}</div>`
                : ''}
            </div>
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              ${this.isEdit ? msg('Update') : msg('Save')}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click=${this.handleCancel}
            >
              ${msg('Cancel')}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  updateField(field, value) {
    this.formData = {
      ...this.formData,
      [field]: value,
    };
    this.clearError(field);
  }

  clearError(field) {
    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: null,
      };
    }
  }

  validateForm() {
    const errors = {};

    if (!this.formData.firstName.trim()) {
      errors.firstName = msg('First name is required');
    }

    if (!this.formData.lastName.trim()) {
      errors.lastName = msg('Last name is required');
    }

    // Date of Employment validation
    if (!this.formData.dateOfEmployment) {
      errors.dateOfEmployment = msg('Date of employment is required');
    } else {
      const employmentDate = new Date(this.formData.dateOfEmployment);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (employmentDate > today) {
        errors.dateOfEmployment = msg(
          'Date of employment cannot be in the future'
        );
      }
    }

    // Date of Birth validation
    if (!this.formData.dateOfBirth) {
      errors.dateOfBirth = msg('Date of birth is required');
    } else {
      const birthDate = new Date(this.formData.dateOfBirth);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 18);

      if (birthDate > today) {
        errors.dateOfBirth = msg('Date of birth cannot be in the future');
      } else if (birthDate > minAge) {
        errors.dateOfBirth = msg('Employee must be at least 18 years old');
      }
    }

    // Phone validation
    if (!this.formData.phone.trim()) {
      errors.phone = msg('Phone is required');
    } else if (!this.isValidPhone(this.formData.phone)) {
      errors.phone = msg('Please enter a valid phone number');
    }

    // Email validation
    if (!this.formData.email.trim()) {
      errors.email = msg('Email is required');
    } else if (!this.isValidEmail(this.formData.email)) {
      errors.email = msg('Please enter a valid email');
    }

    if (!this.formData.department) {
      errors.department = msg('Department is required');
    }

    if (!this.formData.position) {
      errors.position = msg('Position is required');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    // Allow Turkish phone format: +90 532 123 45 67
    const phoneRegex = /^\+90 [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}$/;
    return phoneRegex.test(phone);
  }

  getPhoneNumberWithoutPrefix() {
    // Remove +90 prefix and return only the number part
    if (this.formData.phone && this.formData.phone.startsWith('+90 ')) {
      return this.formData.phone.substring(4);
    }
    return this.formData.phone || '';
  }

  formatPhoneNumber(value) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Format: XXX XXX XX XX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6,
        8
      )} ${digits.slice(8, 10)}`;
    }
  }

  handlePhoneInput(e) {
    const input = e.target;
    const value = input.value;

    // Format the phone number
    const formatted = this.formatPhoneNumber(value);

    // Update the input value with formatted number
    input.value = formatted;

    // Update form data with full phone number (including +90 prefix)
    this.updateField('phone', `+90 ${formatted}`);
  }

  handlePhoneKeydown(e) {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 27, 13, 46, 37, 39].includes(e.keyCode)) {
      return;
    }

    // Allow only digits
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Check if we already have 10 digits (max length for Turkish phone)
    const currentValue = e.target.value;
    const digitsOnly = currentValue.replace(/\D/g, '');

    if (digitsOnly.length >= 10) {
      e.preventDefault();
    }
  }

  checkUniqueEmail(email) {
    const allEmployees = store.getState().getAllEmployees();
    const existingEmployee = allEmployees.find(
      (emp) =>
        emp.email.toLowerCase() === email.toLowerCase() &&
        (!this.isEdit || emp.id !== this.employee?.id)
    );
    return !existingEmployee;
  }

  checkUniquePhone(phone) {
    const allEmployees = store.getState().getAllEmployees();
    const existingEmployee = allEmployees.find(
      (emp) =>
        emp.phone === phone && (!this.isEdit || emp.id !== this.employee?.id)
    );
    return !existingEmployee;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateForm()) {
      // Check for unique email and phone
      const uniqueErrors = {};

      if (!this.checkUniqueEmail(this.formData.email)) {
        uniqueErrors.email = msg('This email is already in use');
      }

      if (!this.checkUniquePhone(this.formData.phone)) {
        uniqueErrors.phone = msg('This phone number is already in use');
      }

      if (Object.keys(uniqueErrors).length > 0) {
        this.errors = {...this.errors, ...uniqueErrors};
        return;
      }

      const event = new CustomEvent('employee-save', {
        detail: {
          employee: this.formData,
          isEdit: this.isEdit,
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }
  }

  handleCancel() {
    const event = new CustomEvent('employee-cancel', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('employee-form', EmployeeForm);
