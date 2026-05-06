import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function NewEmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ username: "", email: "", status: "pending" });
    const [editingId, setEditingId] = useState(null);

    const fetchEmployees = async () => {
        const token = localStorage.getItem("token");
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
            const token = localStorage.getItem("token");
            await fetch(`${API}/new-employees/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(form)
            });
            setEditingId(null);
        } else {
            const token = localStorage.getItem("token");
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
        const token = localStorage.getItem("token");
        await fetch(`${API}/new-employees/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        fetchEmployees();
    };

    const handleActivate = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`${API}/new-employees/activate/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        fetchEmployees();
    };

    const handleDeactivate = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`${API}/new-employees/deactivate/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        fetchEmployees();
    };

    return (
        <div className="container employee-page">
            <div className="card">
                <h2>New Employees</h2>

                <form onSubmit={handleSubmit} className="employee-form">
                    <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button className="btn-blue">
                        {editingId ? "Update" : "Create"}
                    </button>
                </form>
            </div>

            <div className="card">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.employee_id}>
                                <td>{emp.username}</td>
                                <td className="small">{emp.email}</td>
                                <td>
                                    <span className={`badge status-${emp.status}`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="employee-actions">
                                        <button className="btn-gray" onClick={() => handleEdit(emp)}>Edit</button>
                                        <button className="btn-red" onClick={() => handleDelete(emp.employee_id)}>Delete</button>
                                        <button className="btn-green" onClick={() => handleActivate(emp.employee_id)}>Activate</button>
                                        <button className="btn-gray" onClick={() => handleDeactivate(emp.employee_id)}>Deactivate</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}