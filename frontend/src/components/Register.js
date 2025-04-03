// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
        const res = await axios.post('/auth/register', form);
        setMessage('Registration successful! Your token: ' + res.data.token);
        } catch (error) {
        setMessage('Registration failed: ' + error.response.data.error);
        }
    };

    return (
        <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            /><br/>
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            /><br/>
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            /><br/>
            <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
