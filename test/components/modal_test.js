/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {ModalComponent} from '../../components/modal.js';

suite('ModalComponent', () => {
  let element;

  setup(async () => {
    element = await fixture(html`<modal-component></modal-component>`);
  });

  test('is defined', () => {
    assert.instanceOf(element, ModalComponent);
  });

  test('is hidden by default', async () => {
    await element.updateComplete;
    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.notExists(modal);
  });

  test('shows when opened', async () => {
    element.openModal({
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
    });

    await element.updateComplete;

    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.exists(modal);

    const title = element.shadowRoot.querySelector('.modal-title');
    const message = element.shadowRoot.querySelector('.modal-message');

    assert.equal(title.textContent.trim(), 'Test Title');
    assert.equal(message.textContent.trim(), 'Test Message');
  });

  test('dispatches modal-confirm event', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    let eventDispatched = false;
    element.addEventListener('modal-confirm', () => {
      eventDispatched = true;
    });

    const confirmButton =
      element.shadowRoot.querySelector('.modal-btn-primary');
    if (confirmButton) {
      confirmButton.click();
      await element.updateComplete;
      assert.isTrue(eventDispatched);
    } else {
      assert.fail('Confirm button not found');
    }
  });

  test('dispatches modal-cancel event', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    let eventDispatched = false;
    element.addEventListener('modal-cancel', () => {
      eventDispatched = true;
    });

    const cancelButton = element.shadowRoot.querySelector('.modal-btn-cancel');
    if (cancelButton) {
      cancelButton.click();
      await element.updateComplete;
      assert.isTrue(eventDispatched);
    } else {
      assert.fail('Cancel button not found');
    }
  });

  test('closes when close button is clicked', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const closeButton = element.shadowRoot.querySelector('.modal-close');
    closeButton.click();

    await element.updateComplete;

    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.notExists(modal);
  });

  test('closes when overlay is clicked', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const overlay = element.shadowRoot.querySelector('.modal-overlay');
    overlay.click();

    await element.updateComplete;

    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.notExists(modal);
  });

  test('does not close when modal content is clicked', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const modalContainer = element.shadowRoot.querySelector('.modal-container');
    modalContainer.click();

    await element.updateComplete;

    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.exists(modal);
  });

  test('uses default text when not provided', async () => {
    element.openModal({
      title: 'Test Title',
      message: 'Test Message',
    });

    await element.updateComplete;

    const confirmButton =
      element.shadowRoot.querySelector('.modal-btn-primary');
    const cancelButton = element.shadowRoot.querySelector('.modal-btn-cancel');

    assert.equal(confirmButton.textContent.trim(), 'Confirm');
    assert.equal(cancelButton.textContent.trim(), 'Cancel');
  });

  test('uses custom text when provided', async () => {
    element.openModal({
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Proceed',
      cancelText: 'No',
    });

    await element.updateComplete;

    const confirmButton =
      element.shadowRoot.querySelector('.modal-btn-primary');
    const cancelButton = element.shadowRoot.querySelector('.modal-btn-cancel');

    assert.equal(confirmButton.textContent.trim(), 'Proceed');
    assert.equal(cancelButton.textContent.trim(), 'No');
  });

  test('has correct button styling for primary action', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const confirmButton =
      element.shadowRoot.querySelector('.modal-btn-primary');
    assert.exists(confirmButton);
    assert.include(confirmButton.className, 'modal-btn-primary');
  });

  test('has correct button styling for cancel action', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const cancelButton = element.shadowRoot.querySelector('.modal-btn-cancel');
    assert.exists(cancelButton);
    assert.include(cancelButton.className, 'modal-btn-cancel');
  });

  test('closes modal after confirm', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const confirmButton =
      element.shadowRoot.querySelector('.modal-btn-primary');
    confirmButton.click();

    await element.updateComplete;

    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.notExists(modal);
  });

  test('closes modal after cancel', async () => {
    element.openModal({
      title: 'Test',
      message: 'Test',
    });

    await element.updateComplete;

    const cancelButton = element.shadowRoot.querySelector('.modal-btn-cancel');
    cancelButton.click();

    await element.updateComplete;

    const modal = element.shadowRoot.querySelector('.modal-overlay');
    assert.notExists(modal);
  });
});
