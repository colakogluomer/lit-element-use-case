/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {assert} from '@open-wc/testing';
import store from '../../store/employee.js';

suite('Employee Store', () => {
  setup(() => {
    // Store'u test öncesi temizle
    localStorage.clear();
  });

  teardown(() => {
    // Test sonrası temizle
    localStorage.clear();
  });

  test('should initialize with default state', () => {
    const state = store.getState();
    assert.isArray(state.employees);
    assert.equal(state.pagination.currentPage, 1);
    assert.equal(state.viewMode, 'table');
    assert.equal(state.pagination.itemsPerPage, 9);
    assert.isNull(state.selectedEmployee);
  });

  test('should add employee', () => {
    const newEmployee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 532 123 45 67',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
    };

    const initialCount = store.getState().totalCount;
    store.getState().addEmployee(newEmployee);
    const state = store.getState();

    assert.equal(state.totalCount, initialCount + 1);
  });

  test('should remove employee', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 532 123 45 67',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
    };

    store.getState().addEmployee(employee);
    const allEmployees = store.getState().getAllEmployees();
    const employeeToRemove = allEmployees.find(
      (emp) => emp.email === 'john@example.com'
    );

    store.getState().removeEmployee(employeeToRemove.id);

    const state = store.getState();
    assert.equal(state.totalCount, 250); // Back to original count
  });

  test('should update employee', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 532 123 45 67',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
    };

    store.getState().addEmployee(employee);
    const allEmployees = store.getState().getAllEmployees();
    const employeeToUpdate = allEmployees.find(
      (emp) => emp.email === 'john@example.com'
    );

    const updatedEmployee = {
      firstName: 'Jane',
      position: 'Medior',
    };

    store.getState().updateEmployee(employeeToUpdate.id, updatedEmployee);

    const updatedAllEmployees = store.getState().getAllEmployees();
    const updatedEmp = updatedAllEmployees.find(
      (emp) => emp.id === employeeToUpdate.id
    );
    assert.equal(updatedEmp.firstName, 'Jane');
    assert.equal(updatedEmp.position, 'Medior');
  });

  test('should set current page', () => {
    store.getState().setCurrentPage(3);
    const state = store.getState();
    assert.equal(state.pagination.currentPage, 3);
  });

  test('should set view mode', () => {
    store.getState().setViewMode('cards');
    const state = store.getState();
    assert.equal(state.viewMode, 'cards');
    assert.equal(state.pagination.itemsPerPage, 4); // Cards mode should have 4 items per page
  });

  test('should get employee by id', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+90 532 123 45 67',
      department: 'Tech',
      position: 'Senior',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
    };

    store.getState().addEmployee(employee);
    const allEmployees = store.getState().getAllEmployees();
    const addedEmployee = allEmployees.find(
      (emp) => emp.email === 'john@example.com'
    );

    const foundEmployee = store.getState().getEmployeeById(addedEmployee.id);
    assert.deepEqual(foundEmployee, addedEmployee);
  });

  test('should return undefined for non-existent employee', () => {
    const foundEmployee = store.getState().getEmployeeById(999);
    assert.isUndefined(foundEmployee);
  });

  test('should set selected employee', () => {
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

    store.getState().setSelectedEmployee(employee);
    const state = store.getState();
    assert.deepEqual(state.selectedEmployee, employee);
  });

  test('should get all employees from localStorage', () => {
    const employees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+90 532 123 45 67',
        department: 'Tech',
        position: 'Senior',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: '1990-01-01',
      },
    ];

    localStorage.setItem('employees', JSON.stringify(employees));

    const allEmployees = store.getState().getAllEmployees();
    assert.deepEqual(allEmployees, employees);
  });
});
