import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

export default function EmployeeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    department: initialData?.department || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validation mirrors the backend Employee entity exactly
  const validate = () => {
    const e = {};

    // Name: @NotBlank + @Size(min=3, max=50)
    if (!form.name.trim()) {
      e.name = "Name cannot be empty";
    } else if (form.name.length < 3 || form.name.length > 50) {
      e.name = "Name must be between 3 and 50 characters";
    }

    // Email: @NotBlank + @Email
    if (!form.email.trim()) {
      e.email = "Email cannot be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email format";
    }

    // Phone: @NotBlank + @Pattern(^[6-9]\d{9}$)
    if (!form.phone.trim()) {
      e.phone = "Phone cannot be empty";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      e.phone = "Invalid Indian phone number";
    }

    // Department: @NotBlank + @Size(min=2, max=30)
    if (!form.department.trim()) {
      e.department = "Department cannot be empty";
    } else if (form.department.length < 2 || form.department.length > 30) {
      e.department = "Department must be between 2 and 30 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (backendErrors) {
      if (backendErrors && typeof backendErrors === "object") {
        setErrors(backendErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Stack spacing={2.5}>
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          fullWidth
          placeholder="John Doe"
        />

        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
          fullWidth
          placeholder="john@example.com"
        />

        <TextField
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={Boolean(errors.phone)}
          helperText={errors.phone || "10 digit Indian mobile number"}
          fullWidth
          inputProps={{ maxLength: 10 }}
          placeholder="9876543210"
        />

        <TextField
          label="Department"
          value={form.department}
          onChange={(e) => handleChange("department", e.target.value)}
          error={Boolean(errors.department)}
          helperText={errors.department}
          fullWidth
          placeholder="Engineering"
        />

        <Box sx={{ display: "flex", gap: 1.5, pt: 1 }}>
          <Button
            onClick={onCancel}
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            disabled={submitting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {submitting ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}