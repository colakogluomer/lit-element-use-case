# Employee Management System

Modern employee management application built with LitElement, featuring a responsive design, client-side routing, and robust state management.

## 🚀 Technologies

- **LitElement 3.0** - Web Components framework
- **Zustand** - Lightweight state management
- **@vaadin/router** - Client-side routing
- **@lit/localize** - Internationalization (EN/TR)
- **localStorage** - Data persistence
- **CSS Custom Properties** - Design system

## 🏗️ Architecture

### State Management

The application uses Zustand for centralized state management with the following features:

- **Database-like pagination**: Only loads current page data to memory
- **View mode persistence**: Table/Card view preferences saved to localStorage
- **Employee CRUD operations**: Add, edit, delete, bulk delete
- **Selection management**: Individual and bulk employee selection

### Component Structure

```
├── components/
│   ├── employee-form.js      # Reusable form component
│   ├── modal.js             # Confirmation modal
│   └── pagination.js        # Pagination component
├── pages/
│   ├── employees.js         # Employee list (table/card view)
│   ├── add-employee.js      # Add employee page
│   └── edit-employee.js     # Edit employee page
├── store/
│   └── employee.js          # Zustand store
└── global-css.js            # Global styles & utilities
```

### Global CSS System

Despite Shadow DOM encapsulation, global styles are applied using:

- **CSS Custom Properties**: Defined in `variables.css`
- **Global CSS Module**: `global-css.js` imported in each component
- **Utility Classes**: Reusable styling classes
- **Responsive Breakpoints**: Mobile-first approach

## 🛠️ Development

### Installation

```bash
npm install
```

### Development Server

```bash
npm run serve
```

Access at: http://localhost:8000

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Production mode tests
npm run test:prod
```

## 📱 Features

### Employee Management

- **250 sample employees** with realistic data
- **CRUD operations** with form validation
- **Bulk operations** with confirmation modals
- **Search & filtering** capabilities

### Responsive Design

- **Table view**: 9 items per page, horizontal scroll
- **Card view**: 4 items per page (2x2 grid)
- **Mobile drawer**: Hamburger menu navigation
- **Touch-friendly**: Optimized for mobile devices

### Internationalization

- **English & Turkish** language support
- **Locale persistence** across sessions
- **Dynamic content switching**

### Data Persistence

- **localStorage integration** for data persistence
- **One-time initialization** of sample data
- **View preferences** saved automatically

## 🎨 Design System

### CSS Variables

```css
/* Breakpoints */
--mobile: 480px
--tablet: 768px
--desktop: 1024px
--large-desktop: 1200px
--xlarge-desktop: 1400px

/* Colors */
--color-primary: #ff6b35
--color-text-primary: #333333
--color-bg-primary: #ffffff

/* Spacing */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
```

### Utility Classes

- **Text utilities**: `.text-primary`, `.text-sm`, `.font-bold`
- **Background utilities**: `.bg-primary`, `.bg-secondary`, `.bg-tertiary`
- **Font utilities**: `.text-xs`, `.text-lg`, `.font-medium`, `.font-semibold`
- **Layout utilities**: `.page-container`, `.form-container`, `.controls`
- **Form utilities**: `.form-grid`, `.form-group`, `.btn-primary`, `.btn-secondary`

## 🔧 Configuration

### Routing

Client-side routing with fallback to index.html for SPA behavior.

### Localization

Configured in `lit-localize.json` with English and Turkish locales.

### Testing

Uses `@web/test-runner` with Playwright for cross-browser testing.
