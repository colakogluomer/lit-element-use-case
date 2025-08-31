/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {PaginationComponent} from '../../components/pagination.js';

suite('PaginationComponent', () => {
  let element;

  setup(async () => {
    element = await fixture(
      html`<pagination-component></pagination-component>`
    );
  });

  test('is defined', () => {
    assert.instanceOf(element, PaginationComponent);
  });

  test('renders with default values', async () => {
    element.totalPages = 5; // Set totalPages > 1 to render pagination
    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    assert.exists(pagination);
  });

  test('renders page numbers correctly', async () => {
    element.currentPage = 1;
    element.totalPages = 5;
    element.itemsPerPage = 10;

    await element.updateComplete;

    const pageButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    assert.equal(pageButtons.length, 7);
  });

  test('highlights current page', async () => {
    element.currentPage = 3;
    element.totalPages = 5;

    await element.updateComplete;

    const pageButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    const currentPageButton = Array.from(pageButtons).find(
      (btn) => btn.textContent.trim() === '3'
    );

    assert.include(currentPageButton.className, 'active');
  });

  test('calls onPageChange callback', async () => {
    element.currentPage = 1;
    element.totalPages = 5;

    let callbackCalled = false;
    let callbackPage = null;
    element.onPageChange = (page) => {
      callbackCalled = true;
      callbackPage = page;
    };

    await element.updateComplete;

    const pageButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    const secondPageButton = Array.from(pageButtons).find(
      (btn) => btn.textContent.trim() === '2'
    );
    secondPageButton.click();

    await element.updateComplete;

    assert.isTrue(callbackCalled);
    assert.equal(callbackPage, 2);
  });

  test('shows previous button when not on first page', async () => {
    element.currentPage = 2;
    element.totalPages = 5;

    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.pagination-item');
    assert.exists(prevButton);
    assert.isFalse(prevButton.disabled);
  });

  test('disables previous button on first page', async () => {
    element.currentPage = 1;
    element.totalPages = 5;

    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.pagination-item');
    assert.exists(prevButton);
    assert.isTrue(prevButton.disabled);
  });

  test('shows next button when not on last page', async () => {
    element.currentPage = 1;
    element.totalPages = 5;

    await element.updateComplete;

    const nextButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    const nextButton = nextButtons[nextButtons.length - 1];
    assert.exists(nextButton);
    assert.isFalse(nextButton.disabled);
  });

  test('disables next button on last page', async () => {
    element.currentPage = 5;
    element.totalPages = 5;

    await element.updateComplete;

    const nextButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    const nextButton = nextButtons[nextButtons.length - 1];
    assert.exists(nextButton);
    assert.isTrue(nextButton.disabled);
  });

  test('calls onPageChange for previous page', async () => {
    element.currentPage = 3;
    element.totalPages = 5;

    let callbackCalled = false;
    let callbackPage = null;
    element.onPageChange = (page) => {
      callbackCalled = true;
      callbackPage = page;
    };

    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.pagination-item');
    if (prevButton) {
      prevButton.click();
    }

    await element.updateComplete;

    assert.isTrue(callbackCalled);
    assert.equal(callbackPage, 2);
  });

  test('calls onPageChange for next page', async () => {
    element.currentPage = 3;
    element.totalPages = 5;

    let callbackCalled = false;
    let callbackPage = null;
    element.onPageChange = (page) => {
      callbackCalled = true;
      callbackPage = page;
    };

    await element.updateComplete;

    const nextButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    const nextButton = nextButtons[nextButtons.length - 1];
    if (nextButton) {
      nextButton.click();
    }

    await element.updateComplete;

    assert.isTrue(callbackCalled);
    assert.equal(callbackPage, 4);
  });

  test('does not call onPageChange when previous button is disabled', async () => {
    element.currentPage = 1;
    element.totalPages = 5;

    let callbackCalled = false;
    element.onPageChange = () => {
      callbackCalled = true;
    };

    await element.updateComplete;

    const prevButton = element.shadowRoot.querySelector('.pagination-item');
    if (prevButton) {
      prevButton.click();
    }

    await element.updateComplete;

    assert.isFalse(callbackCalled);
  });

  test('does not call onPageChange when next button is disabled', async () => {
    element.currentPage = 5;
    element.totalPages = 5;

    let callbackCalled = false;
    element.onPageChange = () => {
      callbackCalled = true;
    };

    await element.updateComplete;

    const nextButtons = element.shadowRoot.querySelectorAll('.pagination-item');
    const nextButton = nextButtons[nextButtons.length - 1];
    if (nextButton) {
      nextButton.click();
    }

    await element.updateComplete;

    assert.isFalse(callbackCalled);
  });

  test('shows ellipsis for many pages', async () => {
    element.currentPage = 1;
    element.totalPages = 20;

    await element.updateComplete;

    const ellipsis = element.shadowRoot.querySelector('.pagination-dots');
    assert.exists(ellipsis);
  });

  test('does not show ellipsis for few pages', async () => {
    element.currentPage = 1;
    element.totalPages = 5;

    await element.updateComplete;

    const ellipsis = element.shadowRoot.querySelector('.pagination-dots');
    assert.notExists(ellipsis);
  });

  test('renders with single page', async () => {
    element.currentPage = 1;
    element.totalPages = 1;

    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    assert.notExists(pagination);
  });
});
