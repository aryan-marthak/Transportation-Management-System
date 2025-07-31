import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from '../store/useAuthStore';
import { API_ENDPOINTS } from '../utils/config.js';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [department, setDepartment] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const signup = useAuthStore((state) => state.signup);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupName, setSignupName] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!employeeId) newErrors.employeeId = "Employee ID is required";
        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        else if (!email.endsWith("@adityabirla.com")) newErrors.email = "Only @adityabirla.com emails are allowed";
        if (!department) newErrors.department = "Department is required";
        if (!phoneNo) newErrors.phoneNo = "Mobile number is required";
        else if (!/^\d{10}$/.test(phoneNo)) newErrors.phoneNo = "Enter a valid 10-digit mobile number";
        if (!password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Password is required";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        setErrors("");
        try {
            const response = await axios.post(API_ENDPOINTS.SIGNUP, {
                employeeId,
                name,
                email,
                password,
                department,
                phoneNo
            });
            if (response.data.message) {
                setShowOtpInput(true);
                setSignupEmail(email);
                setSignupName(name);
            }
        } catch (err) {
            setErrors({ api: err.response?.data?.error || "Signup failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        setOtpError("");
        try {
            const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, {
                email: signupEmail,
                otp
            });
            if (response.data.user) {
                alert("Signup successful! You can now log in.");
                navigate("/login");
            }
        } catch (err) {
            setOtpError(err.response?.data?.error || "OTP verification failed");
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-8 rounded shadow-md w-96"
                onSubmit={showOtpInput ? handleOtpSubmit : handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {errors.api && (
                    <p className="text-red-500 text-sm mb-2 text-center">{errors.api}</p>
                )}
                {!showOtpInput && (
                    <>
                        {/* Signup form fields */}
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Department</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring focus:border-blue-300"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="Enter your department"
                            />
                            {errors.department && (
                                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Employee ID</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="Enter your employee ID"
                            />
                            {errors.employeeId && (
                                <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Mobile Number</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                placeholder="Enter your 10-digit mobile number"
                            />
                            {errors.phoneNo && (
                                <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block mb-1 text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Sign Up"}
                        </button>
                        <p className="text-center text-gray-500 mt-4">
                            Already have an account?
                            <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}> Login</span>
                        </p>
                    </>
                )}
                {showOtpInput && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-1 text-gray-700">Enter OTP sent to your email {signupEmail} </label>
                            <span className="text-xs text-gray-500">(check your spam folder)</span>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                maxLength={6}
                            />
                            {otpError && (
                                <p className="text-red-500 text-sm mt-1">{otpError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                            disabled={otpLoading}
                        >
                            {otpLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default Signup;
