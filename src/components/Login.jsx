/* eslint-disable no-unused-vars */
// src/components/Login.js
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Background from "./Background";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login({ onLogin }) {
    const initialSignUpValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const initialLoginValues = {
        emailOrPhone: "",
        password: "",
    };

    const [formValues, setFormValues] = useState(initialSignUpValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [authError, setAuthError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            if (isLogin) {
                signInWithEmailAndPassword(auth, formValues.emailOrPhone, formValues.password)
                    .then((userCredential) => {
                        console.log(userCredential.user);
                        onLogin(userCredential.user.displayName || userCredential.user.email); // Pass user name or email
                        navigate('/dashboard');
                    })
                    .catch((error) => {
                        console.error(error.message);
                        setAuthError("Invalid email or password. Please try again.");
                    });
            } else {
                createUserWithEmailAndPassword(auth, formValues.email, formValues.password)
                    .then((userCredential) => {
                        console.log(userCredential.user);
                        onLogin(userCredential.user.displayName || userCredential.user.email); // Pass user name or email
                        navigate('/dashboard');
                    })
                    .catch((error) => {
                        console.error(error.message);
                        setAuthError("Failed to create an account. Please try again.");
                    });
            }
        }
    }, [formErrors, formValues, isSubmit, isLogin, navigate, onLogin]);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (isLogin) {
            if (!values.emailOrPhone) {
                errors.emailOrPhone = "Email or phone number is required!";
            }
            if (!values.password) {
                errors.password = "Password is required!";
            }
        } else {
            if (!values.username) {
                errors.username = "Username is required!";
            }
            if (!values.email) {
                errors.email = "Email is required!";
            } else if (!regex.test(values.email)) {
                errors.email = "This is not a valid email format!";
            }
            if (!values.password) {
                errors.password = "Password is required";
            } else if (values.password.length < 4) {
                errors.password = "Password must be more than 4 characters";
            } else if (values.password.length > 10) {
                errors.password = "Password cannot exceed more than 10 characters";
            }
            if (values.password !== values.confirmPassword) {
                errors.confirmPassword = "Passwords do not match!";
            }
        }
        return errors;
    };

    const switchToSignUp = () => {
        setFormValues(initialSignUpValues);
        setIsLogin(false);
        setFormErrors({});
        setIsSubmit(false);
        setAuthError("");
    };

    const switchToLogin = () => {
        setFormValues(initialLoginValues);
        setIsLogin(true);
        setFormErrors({});
        setIsSubmit(false);
        setAuthError("");
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                console.log(result.user);
                onLogin(result.user.displayName || result.user.email); // Pass user name or email
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error.message);
                setAuthError("Failed to sign in with Google. Please try again.");
            });
    };

    return (
        <Background>
            <div className="container max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
                {isLogin ? (
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-xl md:text-2xl font-bold mb-2">Login</h1>
                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1 text-left">Email or Phone</label>
                            <input
                                type="text"
                                name="emailOrPhone"
                                placeholder="Username"
                                value={formValues.emailOrPhone}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-black rounded-lg"
                        />
                        <p className="text-red-500 text-sm">{formErrors.emailOrPhone}</p>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1 text-left">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formValues.password}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-black rounded-lg"
                            />
                            <p className="text-red-500 text-sm">{formErrors.password}</p>
                        </div>
                        <div className="mb-3">
                            <button className="w-full bg-blue-500 text-white py-1 rounded-lg">Login</button>
                        </div>
                        <div className="mb-3 text-left">
                            <a href="ww" className="text-blue-800">Forgot Password?</a>
                        </div>
                        {authError && <p className="text-red-500 text-sm">{authError}</p>}
                        <div className="mb-3">
                            <button
                                type="button"
                                className="w-full bg-black text-white py-1 rounded-lg flex items-center justify-center"
                                onClick={handleGoogleSignIn}
                            >
                                <img src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" alt="Google" className="w-4 h-4 mr-2" />
                                Sign in with Google
                            </button>
                        </div>
                        <div className="text-center">
                            <span className="text-gray-700">Dont have an account?</span>{" "}
                            <button type="button" className="text-blue-800" onClick={switchToSignUp}>Sign Up</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-xl md:text-2xl font-bold mb-2">Sign Up</h1>
                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1 text-left">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formValues.username}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-black rounded-lg"
                            />
                            <p className="text-red-500 text-sm">{formErrors.username}</p>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1 text-left">Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={formValues.email}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-black rounded-lg"
                            />
                            <p className="text-red-500 text-sm">{formErrors.email}</p>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1 text-left">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formValues.password}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-black rounded-lg"
                            />
                            <p className="text-red-500 text-sm">{formErrors.password}</p>
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 mb-1 text-left">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formValues.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-2 py-1 border border-black rounded-lg"
                            />
                            <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>
                        </div>
                        <div className="mb-3">
                            <button className="w-full bg-green-500 text-white py-1 rounded-lg">Sign Up</button>
                        </div>
                        {authError && <p className="text-red-500 text-sm">{authError}</p>}
                        <div className="mb-3">
                            <button
                                type="button"
                                className="w-full bg-black text-white py-1 rounded-lg flex items-center justify-center"
                                onClick={handleGoogleSignIn}
                            >
                                <img src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" alt="Google" className="w-4 h-4 mr-2" />
                                Sign in with Google
                            </button>
                        </div>
                        <div className="text-center">
                            <span className="text-gray-700">Already have an account?</span>{" "}
                            <button type="button" className="text-blue-500" onClick={switchToLogin}>Login</button>
                        </div>
                    </form>
                )}
            </div>
        </Background>
    );
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
