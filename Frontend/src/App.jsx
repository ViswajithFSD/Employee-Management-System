/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Groups as GroupsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import EmployeeService from "./services/EmployeeService";
import EmployeeForm from "./components/EmployeeForm";

const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" },
    secondary: { main: "#ec4899" },
    background: { default: "#f8fafc" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = useCallback((message, severity = "success") => {
    setToast({ message, severity });
  }, []);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch (err) {
      showToast("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleSave = async (employee) => {
    try {
      if (editingEmployee) {
        await EmployeeService.update(editingEmployee.id, employee);
        showToast("Employee updated successfully");
      } else {
        await EmployeeService.create(employee);
        showToast("Employee created successfully");
      }
      setShowForm(false);
      setEditingEmployee(null);
      loadEmployees();
    } catch (err) {
      const backendErrors = err.response?.data;
      if (backendErrors && typeof backendErrors === "object") {
        throw backendErrors;
      }
      showToast("Failed to save employee", "error");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await EmployeeService.delete(confirmDelete);
      showToast("Employee deleted");
      loadEmployees();
    } catch (err) {
      showToast("Failed to delete employee", "error");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search)
  );

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "text.primary", borderBottom: 1, borderColor: "divider" }}>
          <Toolbar>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <GroupsIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Employee Manager
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {employees.length} {employees.length === 1 ? "employee" : "employees"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddNew}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Add Employee
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3, bgcolor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            {loading ? (
              <Box sx={{ p: 6, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ p: 6, textAlign: "center", color: "text.secondary" }}>
                <Typography>
                  {search ? "No employees match your search." : "No employees yet. Add one to get started."}
                </Typography>
              </Box>
            ) : (
              <Table>
                <TableHead sx={{ bgcolor: "grey.50" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "text.secondary" }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "text.secondary" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "text.secondary" }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "text.secondary" }}>Department</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", color: "text.secondary" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: "primary.light", width: 36, height: 36, fontSize: 14 }}>
                            {getInitials(emp.name)}
                          </Avatar>
                          <Typography fontWeight={600}>{emp.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{emp.email}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{emp.phone}</TableCell>
                      <TableCell>
                        <Chip label={emp.department} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(emp)} size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setConfirmDelete(emp.id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Container>

        {/* Form Dialog */}
        <Dialog open={showForm} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <EmployeeForm
              initialData={editingEmployee}
              onSubmit={handleSave}
              onCancel={handleClose}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Delete Employee?</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to delete this employee? This action cannot be undone.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={() => setConfirmDelete(null)} sx={{ textTransform: "none" }}>
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained" sx={{ textTransform: "none" }}>
                Delete
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Toast */}
        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={3000}
          onClose={() => setToast(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {toast && (
            <Alert onClose={() => setToast(null)} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
              {toast.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}