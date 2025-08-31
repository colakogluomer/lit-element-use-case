import {createStore} from 'zustand/vanilla';
import {employeesData} from '../employees.js';

// Initialize view mode from localStorage
const initializeViewMode = () => {
  const storedViewMode = localStorage.getItem('employeeViewMode');
  return storedViewMode || 'table'; // Default to table view
};

// Get items per page based on view mode
const getItemsPerPage = (viewMode) => {
  return viewMode === 'table' ? 9 : 4;
};

// Initialize pagination settings from localStorage
const initializePagination = () => {
  const storedPagination = localStorage.getItem('employeePagination');
  const viewMode = initializeViewMode();
  const itemsPerPage = getItemsPerPage(viewMode);

  if (storedPagination) {
    const parsed = JSON.parse(storedPagination);
    // Update itemsPerPage if view mode changed
    if (parsed.itemsPerPage !== itemsPerPage) {
      const updatedPagination = {
        ...parsed,
        itemsPerPage,
        currentPage: 1, // Reset to first page when changing view mode
      };
      localStorage.setItem(
        'employeePagination',
        JSON.stringify(updatedPagination)
      );
      return updatedPagination;
    }
    return parsed;
  }

  const defaultPagination = {
    currentPage: 1,
    itemsPerPage,
  };

  localStorage.setItem('employeePagination', JSON.stringify(defaultPagination));
  return defaultPagination;
};

// Get total count of employees (for pagination info)
const getTotalEmployeeCount = () => {
  const storedEmployees = localStorage.getItem('employees');
  if (storedEmployees) {
    return JSON.parse(storedEmployees).length;
  }
  return employeesData.length;
};

// Load employees for specific page (database-like approach)
const loadEmployeesForPage = (page, itemsPerPage) => {
  const storedEmployees = localStorage.getItem('employees');
  let allEmployees;

  if (storedEmployees) {
    allEmployees = JSON.parse(storedEmployees);
  } else {
    // First time: save to localStorage and return first page
    localStorage.setItem('employees', JSON.stringify(employeesData));
    allEmployees = employeesData;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return allEmployees.slice(startIndex, endIndex);
};

// Initialize employees for first page
const initializeEmployees = () => {
  const pagination = initializePagination();
  return loadEmployeesForPage(pagination.currentPage, pagination.itemsPerPage);
};

const store = createStore((set, get) => ({
  employees: initializeEmployees(), // Only current page employees
  viewMode: initializeViewMode(), // 'table' or 'card'
  pagination: initializePagination(),
  totalCount: getTotalEmployeeCount(), // Total number of employees
  selectedEmployee: null,

  // View mode actions
  setViewMode: (mode) => {
    localStorage.setItem('employeeViewMode', mode);

    // Update pagination with new itemsPerPage
    const newItemsPerPage = getItemsPerPage(mode);
    const currentPagination = get().pagination;
    const newPagination = {
      ...currentPagination,
      itemsPerPage: newItemsPerPage,
      currentPage: 1, // Reset to first page when changing view mode
    };

    localStorage.setItem('employeePagination', JSON.stringify(newPagination));

    // Load employees for the first page with new itemsPerPage
    const newEmployees = loadEmployeesForPage(1, newItemsPerPage);

    set({
      viewMode: mode,
      pagination: newPagination,
      employees: newEmployees,
    });
  },

  // Pagination actions
  setCurrentPage: (page) => {
    const currentPagination = get().pagination;
    const newPagination = {...currentPagination, currentPage: page};
    localStorage.setItem('employeePagination', JSON.stringify(newPagination));

    // Load employees for the new page
    const newEmployees = loadEmployeesForPage(page, newPagination.itemsPerPage);

    set({
      pagination: newPagination,
      employees: newEmployees,
    });
  },

  setItemsPerPage: (itemsPerPage) => {
    const currentPagination = get().pagination;
    const newPagination = {...currentPagination, itemsPerPage, currentPage: 1};
    localStorage.setItem('employeePagination', JSON.stringify(newPagination));

    // Load employees for the first page with new itemsPerPage
    const newEmployees = loadEmployeesForPage(1, itemsPerPage);

    set({
      pagination: newPagination,
      employees: newEmployees,
    });
  },

  // Employee actions (these need to reload current page after changes)
  addEmployee: (employee) => {
    const state = get();
    const storedEmployees = localStorage.getItem('employees');
    let allEmployees = storedEmployees
      ? JSON.parse(storedEmployees)
      : employeesData;

    const newEmployee = {
      ...employee,
      id: Math.max(...allEmployees.map((emp) => emp.id)) + 1,
    };

    const updatedAllEmployees = [...allEmployees, newEmployee];
    localStorage.setItem('employees', JSON.stringify(updatedAllEmployees));

    // Reload current page
    const newEmployees = loadEmployeesForPage(
      state.pagination.currentPage,
      state.pagination.itemsPerPage
    );

    set({
      employees: newEmployees,
      totalCount: updatedAllEmployees.length,
    });
  },

  removeEmployee: (id) => {
    const state = get();
    const storedEmployees = localStorage.getItem('employees');
    let allEmployees = storedEmployees
      ? JSON.parse(storedEmployees)
      : employeesData;

    const updatedAllEmployees = allEmployees.filter((emp) => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(updatedAllEmployees));

    // Reload current page
    const newEmployees = loadEmployeesForPage(
      state.pagination.currentPage,
      state.pagination.itemsPerPage
    );

    set({
      employees: newEmployees,
      totalCount: updatedAllEmployees.length,
    });
  },

  updateEmployee: (id, updatedEmployee) => {
    const state = get();
    const storedEmployees = localStorage.getItem('employees');
    let allEmployees = storedEmployees
      ? JSON.parse(storedEmployees)
      : employeesData;

    const updatedAllEmployees = allEmployees.map((emp) =>
      emp.id === id ? {...emp, ...updatedEmployee} : emp
    );
    localStorage.setItem('employees', JSON.stringify(updatedAllEmployees));

    // Reload current page
    const newEmployees = loadEmployeesForPage(
      state.pagination.currentPage,
      state.pagination.itemsPerPage
    );

    set({
      employees: newEmployees,
    });
  },

  removeMultipleEmployees: (ids) => {
    const state = get();
    const storedEmployees = localStorage.getItem('employees');
    let allEmployees = storedEmployees
      ? JSON.parse(storedEmployees)
      : employeesData;

    const updatedAllEmployees = allEmployees.filter(
      (emp) => !ids.includes(emp.id)
    );
    localStorage.setItem('employees', JSON.stringify(updatedAllEmployees));

    // Reload current page
    const newEmployees = loadEmployeesForPage(
      state.pagination.currentPage,
      state.pagination.itemsPerPage
    );

    set({
      employees: newEmployees,
      totalCount: updatedAllEmployees.length,
    });
  },

  // Computed getters
  getTotalPages: () => {
    const state = get();
    return Math.ceil(state.totalCount / state.pagination.itemsPerPage);
  },

  // Get all employees (for search/filter functionality if needed)
  getAllEmployees: () => {
    const storedEmployees = localStorage.getItem('employees');
    return storedEmployees ? JSON.parse(storedEmployees) : employeesData;
  },

  // Selected employee actions
  setSelectedEmployee: (employee) => {
    set({selectedEmployee: employee});
  },

  getEmployeeById: (id) => {
    const allEmployees = get().getAllEmployees();
    return allEmployees.find((emp) => emp.id === parseInt(id));
  },
}));

export default store;
