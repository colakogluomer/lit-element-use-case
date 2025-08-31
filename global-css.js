import {css} from 'lit';

export const globalCss = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif;
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--color-text-primary);
    background-color: black !important;
  }

  .text-primary {
    color: var(--color-text-primary);
  }
  .text-secondary {
    color: var(--color-text-secondary);
  }
  .text-muted {
    color: var(--color-text-muted);
  }
  .text-inverse {
    color: var(--color-text-inverse);
  }

  .bg-primary {
    background-color: var(--color-bg-primary);
  }
  .bg-secondary {
    background-color: var(--color-bg-secondary);
  }
  .bg-tertiary {
    background-color: var(--color-bg-tertiary);
  }

  .text-xs {
    font-size: var(--font-size-xs);
  }
  .text-sm {
    font-size: var(--font-size-sm);
  }
  .text-base {
    font-size: var(--font-size-base);
  }
  .text-lg {
    font-size: var(--font-size-lg);
  }
  .text-xl {
    font-size: var(--font-size-xl);
  }
  .text-2xl {
    font-size: var(--font-size-2xl);
  }
  .text-3xl {
    font-size: var(--font-size-3xl);
  }
  .text-4xl {
    font-size: var(--font-size-4xl);
  }
  .text-5xl {
    font-size: var(--font-size-5xl);
  }

  .font-light {
    font-weight: var(--font-weight-light);
  }
  .font-normal {
    font-weight: var(--font-weight-normal);
  }
  .font-medium {
    font-weight: var(--font-weight-medium);
  }
  .font-semibold {
    font-weight: var(--font-weight-semibold);
  }
  .font-bold {
    font-weight: var(--font-weight-bold);
  }

  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .page-container {
    display: block;
    padding: var(--spacing-xl);
    max-width: var(--xlarge-desktop);
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .page-container {
      padding: var(--spacing-md);
    }
  }

  @media (max-width: 480px) {
    .page-container {
      padding: var(--spacing-sm);
    }
  }

  .page-header {
    margin-bottom: var(--spacing-xl);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .page-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
  }

  .controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .controls {
      justify-content: center;
    }
  }

  .form-container {
    background: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    padding: var(--spacing-xl);
  }

  .form-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
  }

  .form-input {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-normal);
    background: var(--color-white);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  .form-select {
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    background: var(--color-white);
    cursor: pointer;
    transition: border-color var(--transition-normal);
  }

  .form-select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg)
      brightness(118%) contrast(119%);
    cursor: pointer;
  }

  input[type='date']::-webkit-calendar-picker-indicator:hover {
    filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg)
      brightness(100%) contrast(119%);
  }

  input[type='date'] {
    color: var(--color-text-primary);
  }

  input[type='date']::-webkit-datetime-edit {
    color: var(--color-text-primary);
  }

  input[type='date']::-webkit-datetime-edit-fields-wrapper {
    color: var(--color-text-primary);
  }

  input[type='date']::-webkit-datetime-edit-text {
    color: var(--color-text-primary);
  }

  input[type='date']::-webkit-datetime-edit-month-field,
  input[type='date']::-webkit-datetime-edit-day-field,
  input[type='date']::-webkit-datetime-edit-year-field {
    color: var(--color-text-primary);
  }

  .phone-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .phone-prefix {
    position: absolute;
    left: var(--spacing-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
    z-index: 1;
    pointer-events: none;
  }

  .phone-input {
    padding-left: 50px;
    width: 100%;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .btn {
    padding: var(--spacing-sm) var(--spacing-xl);
    border: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-normal);
    min-width: 120px;
  }

  .btn-primary {
    background: var(--color-primary);
    color: var(--color-white);
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
  }

  .btn-secondary {
    background: var(--color-white);
    color: var(--color-secondary);
    border: 1px solid var(--color-secondary);
  }

  .btn-secondary:hover {
    background: var(--color-secondary);
    color: var(--color-white);
  }

  .btn-danger {
    background: var(--color-danger);
    color: var(--color-white);
  }

  .btn-danger:hover {
    background: var(--color-danger-hover);
  }

  .error-message {
    color: var(--color-danger);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
  }

  .loading {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text-secondary);
  }

  .error {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-danger);
  }
`;
