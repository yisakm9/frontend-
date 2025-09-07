/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Add type for form errors to fix TypeScript errors.
interface FormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const App = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [theme, setTheme] = useState('light');
    const [view, setView] = useState('signup');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-mode' : '';
    }, [theme]);

    useEffect(() => {
        if (view === 'signup') {
            validateForm();
        }
    }, [formData, view]);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required.';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is not valid.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        const isAllFieldsFilled = formData.fullName !== '' && formData.email !== '' && formData.password !== '' && formData.confirmPassword !== '';
        setIsFormValid(Object.keys(newErrors).length === 0 && isAllFieldsFilled);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        if (isFormValid) {
            console.log('Form submitted:', formData);
            setUserName(formData.fullName.split(' ')[0]);
            setView('dashboard');
        }
    };

    const handleLogout = () => {
        setView('signup');
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setUserName('');
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const EyeIcon = ({ visible }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {visible ? (
                <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                </>
            )}
        </svg>
    );

    const SunIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
    );

    const MoonIcon = () => (
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    );


    return (
         <>
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            {view === 'dashboard' ? (
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1>Welcome, {userName}!</h1>
                        <p className="subtitle">This is your personal dashboard.</p>
                    </div>
                    <div className="dashboard-content">
                        <p>Your journey starts now. Explore the features and possibilities that await.</p>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="signup-container">
                    <h1>Create Account</h1>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                aria-invalid={!!errors.fullName}
                                aria-describedby={errors.fullName ? "fullNameError" : undefined}
                            />
                            {errors.fullName && <p id="fullNameError" className="error-message">{errors.fullName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "emailError" : undefined}
                            />
                            {errors.email && <p id="emailError" className="error-message">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? "passwordError" : undefined}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                                   <EyeIcon visible={showPassword} />
                                </button>
                            </div>
                            {errors.password && <p id="passwordError" className="error-message">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                             <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                     aria-invalid={!!errors.confirmPassword}
                                     aria-describedby={errors.confirmPassword ? "confirmPasswordError" : undefined}
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirm password visibility">
                                    <EyeIcon visible={showConfirmPassword} />
                                </button>
                            </div>
                            {errors.confirmPassword && <p id="confirmPasswordError" className="error-message">{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" disabled={!isFormValid} className="submit-btn">
                            Sign Up
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);