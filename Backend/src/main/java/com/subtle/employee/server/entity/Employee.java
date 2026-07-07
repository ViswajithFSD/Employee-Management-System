package com.subtle.employee.server.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Name: not null, min 2 chars
    @NotBlank(message = "Name is required")
    @Size(min = 2, message = "Name must be at least 5-10 characters")
    private String name;

    // ✅ Email: must be valid format
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    // ✅ Phone: exactly 10 digits
    @NotBlank(message = "Enter Mobile Number")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    // ✅ Department: not empty
    @NotBlank(message = "Department is must")
    private String department;
}