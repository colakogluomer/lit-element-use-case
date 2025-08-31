/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {EmployeeForm} from '../../components/employee-form.js';

suite('EmployeeForm', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<employee-form></employee-form>`);
  });

  test('is defined', () => {
    assert.instanceOf(element, EmployeeForm);
  });

  test('renders form with all fields', async () => {
    await element.updateComplete;

    const form = element.shadowRoot.querySelector('form');
    assert.exists(form);

    // Check all form fields exist
    const inputs = element.shadowRoot.querySelectorAll('input');
    const selects = element.shadowRoot.querySelectorAll('select');

    assert.equal(inputs.length, 6); // firstName, lastName, dateOfEmployment, dateOfBirth, phone, email
    assert.equal(selects.length, 2); // department, position
  });

  test('renders with employee data in edit mode', async () => {
    const employee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 532 123 45 67',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
    };

    element.employee = employee;
    await element.updateComplete;

    // Force another update cycle
    element.requestUpdate();
    await element.updateComplete;

    const firstNameInput =
      element.shadowRoot.querySelector('input[type="text"]');
    const emailInput = element.shadowRoot.querySelector('input[type="email"]');

    assert.equal(firstNameInput.value, 'John');
    assert.equal(emailInput.value, 'john@example.com');
  });

  test('validates required fields', async () => {
    const form = element.shadowRoot.querySelector('form');

    // Try to submit empty form
    const submitEvent = new Event('submit', {bubbles: true, cancelable: true});
    form.dispatchEvent(submitEvent);

    await element.updateComplete;

    // Should have validation errors
    assert.isTrue(Object.keys(element.errors).length > 0);
  });

  test('validates email format', async () => {
    element.formData.email = 'invalid-email';

    const isValid = element.isValidEmail('invalid-email');
    assert.isFalse(isValid);

    const isValid2 = element.isValidEmail('valid@email.com');
    assert.isTrue(isValid2);
  });

  test('validates phone format', async () => {
    const isValid = element.isValidPhone('+90 532 123 45 67');
    assert.isTrue(isValid);

    const isValid2 = element.isValidPhone('invalid-phone');
    assert.isFalse(isValid2);
  });

  test('formats phone number correctly', async () => {
    const formatted = element.formatPhoneNumber('5321234567');
    assert.equal(formatted, '532 123 45 67');
  });

  test('updates form data when input changes', async () => {
    const firstNameInput =
      element.shadowRoot.querySelector('input[type="text"]');

    firstNameInput.value = 'Jane';
    firstNameInput.dispatchEvent(new Event('input'));

    await element.updateComplete;
    assert.equal(element.formData.firstName, 'Jane');
  });

  test('dispatches employee-save event on valid submit', async () => {
    // Fill form with valid data
    element.formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 532 123 45 67',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
    };

    let eventDispatched = false;
    element.addEventListener('employee-save', () => {
      eventDispatched = true;
    });

    const form = element.shadowRoot.querySelector('form');
    const submitEvent = new Event('submit', {bubbles: true, cancelable: true});
    form.dispatchEvent(submitEvent);

    await element.updateComplete;
    assert.isTrue(eventDispatched);
  });

  test('dispatches employee-cancel event', async () => {
    let eventDispatched = false;
    element.addEventListener('employee-cancel', () => {
      eventDispatched = true;
    });

    element.handleCancel();

    assert.isTrue(eventDispatched);
  });

  test('validates date of employment cannot be in future', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    element.formData.dateOfEmployment = futureDateString;

    const isValid = element.validateForm();
    assert.isFalse(isValid);
    assert.exists(element.errors.dateOfEmployment);
  });

  test('validates employee must be at least 18 years old', async () => {
    const recentDate = new Date();
    recentDate.setFullYear(recentDate.getFullYear() - 17);
    const recentDateString = recentDate.toISOString().split('T')[0];

    element.formData.dateOfBirth = recentDateString;

    const isValid = element.validateForm();
    assert.isFalse(isValid);
    assert.exists(element.errors.dateOfBirth);
  });

  test('clears error when field is updated', async () => {
    // Set an error first
    element.errors.firstName = 'First name is required';

    // Update the field
    element.updateField('firstName', 'John');

    assert.isNull(element.errors.firstName);
  });
});
