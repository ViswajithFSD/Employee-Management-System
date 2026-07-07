package com.subtle.employee.server.repository;

import com.subtle.employee.server.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // 🔍 FindBy (Auto Query Methods)
    List<Employee> findByName(String name);

    Employee findByEmail(String email);


}
