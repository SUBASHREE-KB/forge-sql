import React, { useState } from 'react';
import { invoke } from '@forge/bridge';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        phone: ''
    });

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Saving...');
        const result = await invoke('createUser', formData);
        if (result.success) {
            setMessage(result.message);
            setFormData({ name: '', email: '', dob: '', phone: '' });
        } else {
            setMessage(result.message);
        }
    };

    const handleGetUsers = async () => {
        setMessage('Loading...');
        const result = await invoke('getUsers');
        if (result.success) {
            setUsers(result.users);
            setMessage('Found ' + result.users.length + ' users');
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            {message && <p>{message}</p>}
            <br/>
            <button onClick={async () => {
                const res = await invoke("initDb");
                setMessage(res.message);
            }}>
                Initialize Database
            </button>
            <br/>
            <br/>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name: </label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <br/>
                <div>
                    <label>Email: </label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                 <br/>
                <div>
                    <label>Date of Birth: </label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
                </div>
                 <br/>
                <div>
                    <label>Phone: </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                 <br/>
                <button type="submit">Save User</button>
            </form>
            <br/>
            <hr />
              <br/>
            <h2>View All Users</h2>
            <br/>
            <button onClick={handleGetUsers}>Retrieve Users</button>
             <br/>
             <br/>
            {users.length > 0 && (
                <div>
                    <h3>User List ({users.length})</h3>
                    {users.map((user) => (
                        <div key={user.id}>
                            <hr />
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>DOB:</strong> {user.dob}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;