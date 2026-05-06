import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function NewEmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        display_name: "",
        start_date: "",
        department: ""
    });

    const [editingId, setEditingId] = useState(null);

    const getHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
    };

    const fetchEmployees = async () => {
        const res = await fetch(`${API}/new-employees`, {
            headers: getHeaders()
        });

        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editingId
            ? `${API}/new-employees/${editingId}`
            : `${API}/new-employees`;

        const method = editingId ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(form)
        });

        setForm({
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            display_name: "",
            start_date: "",
            department: ""
        });

        setEditingId(null);
        fetchEmployees();
    };

    const handleEdit = (emp) => {
        setForm({
            username: emp.username || "",
            email: emp.email || "",
            first_name: emp.first_name || "",
            last_name: emp.last_name || "",
            display_name: emp.display_name || "",
            start_date: emp.start_date ? emp.start_date.split("T")[0] : "",
            department: emp.department || ""
        });

        setEditingId(emp.employee_id);
    };

    const handleDelete = async (id) => {
        await fetch(`${API}/new-employees/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        fetchEmployees();
    };

    const handleActivate = async (id) => {
        await fetch(`${API}/new-employees/activate/${id}`, {
            method: "PUT",
            headers: getHeaders()
        });

        fetchEmployees();
    };

    const handleDeactivate = async (id) => {
        await fetch(`${API}/new-employees/deactivate/${id}`, {
            method: "PUT",
            headers: getHeaders()
        });

        fetchEmployees();
    };

    return (
        <div className="container employee-page">

            <div className="card">
                <h2>New Employees</h2>

                <form onSubmit={handleSubmit} className="employee-form">
                    <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

                    <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} />
                    <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} />
                    <input name="display_name" placeholder="Display Name" value={form.display_name} onChange={handleChange} />
                    <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
                    <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />

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
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.employee_id}>
                                <td>{emp.username}</td>
                                <td className="small">{emp.email}</td>
                                <td>{emp.department}</td>

                                <td>
                                    <span className={`badge status-${emp.status}`}>
                                        {emp.status}
                                    </span>
                                </td>

                                <td>
                                    <div className="employee-actions">

                                        <button
                                            className="btn-gray"
                                            onClick={() => handleEdit(emp)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn-red"
                                            onClick={() => handleDelete(emp.employee_id)}
                                        >
                                            Delete
                                        </button>

                                        <button
                                            className="btn-green"
                                            onClick={() => handleActivate(emp.employee_id)}
                                        >
                                            Activate
                                        </button>

                                        <button
                                            className="btn-gray"
                                            onClick={() => handleDeactivate(emp.employee_id)}
                                        >
                                            Deactivate
                                        </button>

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