import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import {
  configureLocalization,
  updateWhenLocaleChanges,
  msg,
} from '@lit/localize';
import {sourceLocale, targetLocales} from './generated/locale-codes.js';
import './pages/employees.js';
import './pages/add-employee.js';
import './pages/edit-employee.js';
import {globalCss} from './global-css.js';

// Configure localization
export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale) => import(`./generated/locales/${locale}.js`),
});

class EmployeeElement extends LitElement {
  static properties = {
    mobileMenuOpen: {type: Boolean},
  };

  static styles = [
    globalCss,
    css`
      .header {
        background: var(--color-white);
        border-bottom: 1px solid var(--color-border-light);
        padding: 0 var(--spacing-xl);
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: var(--shadow-sm);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-primary);
        text-decoration: none;
      }

      .logo-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .company-name {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .nav-link {
        padding: var(--spacing-sm) var(--spacing-md);
        color: var(--color-primary);
        text-decoration: none;
        border-radius: var(--border-radius-md);
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        background: transparent;
      }

      .nav-link:hover {
        background: var(--color-gray-100);
      }

      .nav-link.active {
        background: var(--color-gray-100);
      }

      .nav-link svg {
        width: 24px;
        height: 24px;
        color: var(--color-primary);
      }

      .language-select {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        border-radius: var(--border-radius-md);
        background: transparent;
        color: var(--color-text-primary);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all var(--transition-normal);
      }

      .language-select:hover {
        background: var(--color-gray-100);
      }

      .language-select:focus {
        outline: none;
        background: var(--color-gray-100);
      }

      /* Hamburger Menu */
      .hamburger-menu {
        display: none;
        flex-direction: column;
        cursor: pointer;
        padding: var(--spacing-sm);
        border: none;
        background: transparent;
        gap: 4px;
      }

      .hamburger-menu span {
        width: 24px;
        height: 2px;
        background: var(--color-primary);
        transition: all var(--transition-normal);
      }

      .hamburger-menu.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .hamburger-menu.active span:nth-child(2) {
        opacity: 0;
      }

      .hamburger-menu.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }

      /* Mobile Drawer */
      .mobile-drawer {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--color-white);
        border-bottom: 1px solid var(--color-border-light);
        box-shadow: var(--shadow-lg);
        transform: translateY(-100%);
        transition: transform var(--transition-normal);
        z-index: 999;
        padding: var(--spacing-lg);
        opacity: 0;
        visibility: hidden;
      }

      .mobile-drawer.open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      /* Hide mobile drawer on desktop */
      @media (min-width: 769px) {
        .mobile-drawer {
          display: none !important;
        }
      }

      .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        color: var(--color-text-primary);
        text-decoration: none;
        border-radius: var(--border-radius-md);
        transition: all var(--transition-normal);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
      }

      .mobile-nav-link:hover {
        background: var(--color-gray-100);
        color: var(--color-primary);
      }

      .mobile-nav-link svg {
        width: 24px;
        height: 24px;
        color: var(--color-primary);
      }

      .mobile-language-select {
        margin-top: var(--spacing-md);
        padding: var(--spacing-md);
        border: 1px solid var(--color-border-light);
        border-radius: var(--border-radius-md);
        background: var(--color-white);
        color: var(--color-text-primary);
        font-size: var(--font-size-base);
        cursor: pointer;
        width: 100%;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .header {
          padding: 0 var(--spacing-md);
        }

        .company-name {
          display: none;
        }

        .nav-links,
        .language-select {
          display: none;
        }

        .hamburger-menu {
          display: flex;
        }
      }
    `,
  ];

  constructor() {
    super();
    this.mobileMenuOpen = false;
    this.currentLocale =
      localStorage.getItem('preferred-locale') || sourceLocale;
    updateWhenLocaleChanges(this);
  }

  firstUpdated() {
    super.firstUpdated();

    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('preferred-locale');
    if (savedLocale && savedLocale !== sourceLocale) {
      setLocale(savedLocale);
    }

    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      {path: '/employees', component: 'employees-page'},
      {path: '/employees/add', component: 'add-employee-page'},
      {path: '/employees/edit/:id', component: 'edit-employee-page'},
      {path: '(.*)', redirect: '/employees'},
    ]);
  }

  render() {
    return html`
      <header class="header">
        <div class="header-left">
          <a href="/employees" class="logo" @click=${this.handleNavigation}>
            <img src="/assets/logo.svg" alt="ING Logo" class="logo-img" />
          </a>
          <span class="company-name">ING</span>
        </div>

        <div class="header-right">
          <nav class="nav-links">
            <a
              href="/employees"
              class="nav-link"
              @click=${this.handleNavigation}
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>${msg('Employees')}</span>
            </a>
            <a
              href="/employees/add"
              class="nav-link"
              @click=${this.handleNavigation}
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>${msg('Add New')}</span>
            </a>
          </nav>

          <select
            class="language-select"
            .value=${this.currentLocale}
            @change=${(e) => this.switchLocale(e.target.value)}
          >
            <option value="en">🇺🇸 English</option>
            <option value="tr">🇹🇷 Türkçe</option>
          </select>

          <button
            class="hamburger-menu ${this.mobileMenuOpen ? 'active' : ''}"
            @click=${this.toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div class="mobile-drawer ${this.mobileMenuOpen ? 'open' : ''}">
        <nav class="mobile-nav">
          <a
            href="/employees"
            class="mobile-nav-link"
            @click=${this.handleMobileNavigation}
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>${msg('Employees')}</span>
          </a>
          <a
            href="/employees/add"
            class="mobile-nav-link"
            @click=${this.handleMobileNavigation}
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>${msg('Add New')}</span>
          </a>
        </nav>

        <select
          class="mobile-language-select"
          .value=${this.currentLocale}
          @change=${(e) => this.switchLocale(e.target.value)}
        >
          <option value="en">🇺🇸 English</option>
          <option value="tr">🇹🇷 Türkçe</option>
        </select>
      </div>

      <main>
        <div id="outlet"></div>
      </main>
    `;
  }

  switchLocale(locale) {
    this.currentLocale = locale;
    setLocale(locale);
    localStorage.setItem('preferred-locale', locale);
  }

  handleNavigation(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      Router.go(href);
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  handleMobileNavigation(e) {
    this.handleNavigation(e);
    this.mobileMenuOpen = false;
  }
}

customElements.define('employee-element', EmployeeElement);
