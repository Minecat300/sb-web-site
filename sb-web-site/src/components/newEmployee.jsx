import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function NewEmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ username: "", email: "", status: "pending" });
    const [editingId, setEditingId] = useState(null);

    const fetchEmployees = async () => {
        const res = await fetch(`${API}/new-employees`, { headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        const data = await res.json();
        setEmployees(data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            const API = ""
            await fetch(`${API}/new-employees/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(form)
            });
            setEditingId(null);
        } else {
            await fetch(`${API}/new-employees`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(form)
            });
        }

        setForm({ username: "", email: "", status: "pending" });
        fetchEmployees();
    };

    const handleEdit = (emp) => {
        setForm({
            username: emp.username,
            email: emp.email,
            status: emp.status
        });
        setEditingId(emp.employee_id);
    };

    const handleDelete = async (id) => {
        await fetch(`${API}/new-employees/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        fetchEmployees();
    };

    const handleActivate = async (id) => {
        await fetch(`${API}/new-employees/${id}/activate`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        fetchEmployees();
    };

    const handleDeactivate = async (id) => {
        await fetch(`${API}/new-employees/${id}/deactivate`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        fetchEmployees();
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>New Employees</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <select name="status" value={form.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit">
                    {editingId ? "Update" : "Create"}
                </button>
            </form>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.employee_id}>
                            <td>{emp.username}</td>
                            <td>{emp.email}</td>
                            <td>{emp.status}</td>
                            <td>
                                <button onClick={() => handleEdit(emp)}>Edit</button>
                                <button onClick={() => handleDelete(emp.employee_id)}>Delete</button>
                                <button onClick={() => handleActivate(emp.employee_id)}>Activate</button>
                                <button onClick={() => handleDeactivate(emp.employee_id)}>Deactivate</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}