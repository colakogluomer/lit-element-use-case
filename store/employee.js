import {createStore} from 'zustand/vanilla';
import {employeesData} from '../employees.js';

const initializeViewMode = () => {
  const storedViewMode = localStorage.getItem('employeeViewMode');
  return storedViewMode || 'table';
};

const getItemsPerPage = (viewMode) => {
  return viewMode === 'table' ? 9 : 4;
};

const initializePagination = () => {
  const storedPagination = localStorage.getItem('employeePagination');
  const viewMode = initializeViewMode();
  const itemsPerPage = getItemsPerPage(viewMode);

  if (storedPagination) {
    const parsed = JSON.parse(storedPagination);
    if (parsed.itemsPerPage !== itemsPerPage) {
      const updatedPagination = {
        ...parsed,
        itemsPerPage,
        currentPage: 1,
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

const getTotalEmployeeCount = () => {
  const storedEmployees = localStorage.getItem('employees');
  if (storedEmployees) {
    return JSON.parse(storedEmployees).length;
  }
  return employeesData.length;
};

const loadEmployeesForPage = (page, itemsPerPage) => {
  const storedEmployees = localStorage.getItem('employees');
  let allEmployees;

  if (storedEmployees) {
    allEmployees = JSON.parse(storedEmployees);
  } else {
    localStorage.setItem('employees', JSON.stringify(employeesData));
    allEmployees = employeesData;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return allEmployees.slice(startIndex, endIndex);
};

const initializeEmployees = () => {
  const pagination = initializePagination();
  return loadEmployeesForPage(pagination.currentPage, pagination.itemsPerPage);
};

const store = createStore((set, get) => ({
  employees: initializeEmployees(),
  viewMode: initializeViewMode(),
  pagination: initializePagination(),
  totalCount: getTotalEmployeeCount(),
  selectedEmployee: null,

  setViewMode: (mode) => {
    localStorage.setItem('employeeViewMode', mode);

    const newItemsPerPage = getItemsPerPage(mode);
    const currentPagination = get().pagination;
    const newPagination = {
      ...currentPagination,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    };

    localStorage.setItem('employeePagination', JSON.stringify(newPagination));

    const newEmployees = loadEmployeesForPage(1, newItemsPerPage);

    set({
      viewMode: mode,
      pagination: newPagination,
      employees: newEmployees,
    });
  },

  setCurrentPage: (page) => {
    const currentPagination = get().pagination;
    const newPagination = {...currentPagination, currentPage: page};
    localStorage.setItem('employeePagination', JSON.stringify(newPagination));

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

    const newEmployees = loadEmployeesForPage(1, itemsPerPage);

    set({
      pagination: newPagination,
      employees: newEmployees,
    });
  },

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

    const newEmployees = loadEmployeesForPage(
      state.pagination.currentPage,
      state.pagination.itemsPerPage
    );

    set({
      employees: newEmployees,
      totalCount: updatedAllEmployees.length,
    });
  },

  getTotalPages: () => {
    const state = get();
    return Math.ceil(state.totalCount / state.pagination.itemsPerPage);
  },

  getAllEmployees: () => {
    const storedEmployees = localStorage.getItem('employees');
    return storedEmployees ? JSON.parse(storedEmployees) : employeesData;
  },

  setSelectedEmployee: (employee) => {
    set({selectedEmployee: employee});
  },

  getEmployeeById: (id) => {
    const allEmployees = get().getAllEmployees();
    return allEmployees.find((emp) => emp.id === parseInt(id));
  },
}));

export default store;
