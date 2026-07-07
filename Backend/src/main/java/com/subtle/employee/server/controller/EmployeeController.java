package com.subtle.employee.server.controller;

import com.subtle.employee.server.entity.Employee;
import com.subtle.employee.server.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/employees")  // ✅ base path
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // ✅ CREATE
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.postEmployee(employee);
    }

    // ✅ READ ALL
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // ✅ READ BY ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id,
                                   @RequestBody Employee employee) {
        return employeeService.updateEmployee(id, employee);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return "Employee deleted successfully!";
    }

    // 🔍 FIND BY NAME
    @GetMapping("/search/name/{name}")
    public List<Employee> getByName(@PathVariable String name) {
        return employeeService.getByName(name);
    }

    // 🔍 FIND BY EMAIL
    @GetMapping("/search/email/{email}")
    public Employee getByEmail(@PathVariable String email) {
        return employeeService.getByEmail(email);
    }
}