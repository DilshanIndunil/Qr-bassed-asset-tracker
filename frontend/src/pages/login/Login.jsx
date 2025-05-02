import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSltAdmin, sendVerificationCode, verifyCode } from "../../api/apiService.js";
import "./Login.scss";

function Login() {
    const [role, setRole] = useState("systemAdmin");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [enteredCode, setEnteredCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // SLT Admin Login
    const handleSystemAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginSltAdmin(username, password);
            localStorage.setItem("token", data.token);
            alert("Login Successful!");
            navigate("/slt-dashboard");
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        }
    };

    // Company Admin: Send Verification Code
    const handleSendVerificationCode = async () => {
        try {
            await sendVerificationCode(email); // Call backend API to send the code
            setIsCodeSent(true);
            setError("");
            alert("Verification code sent to your email!");
        } catch (err) {
            setError(err.message || "Failed to send verification code. Please try again.");
        }
    };

    // Company Admin: Verify Code and Login
    const handleCompanyAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await verifyCode(email, enteredCode); // Verify the code
            localStorage.setItem("token", data.token);
            alert("Login Successful!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid verification code. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="role-selector">
                <button
                    onClick={() => {
                        setRole("systemAdmin");
                        setError("");
                    }}
                    className={role === "systemAdmin" ? "active-role" : ""}
                >
                    System Admin Login
                </button>
                <button
                    onClick={() => {
                        setRole("companyAdmin");
                        setError("");
                    }}
                    className={role === "companyAdmin" ? "active-role" : ""}
                >
                    Company Admin Login
                </button>
            </div>

            {/* System Admin Login */}
            {role === "systemAdmin" && (
                <div className="login-box">
                    <h2 className="login-title">System Admin Login</h2>
                    <form onSubmit={handleSystemAdminLogin}>
                        <div className="input-group">
                            <input
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="login-button" type="submit">
                            Sign In
                        </button>
                    </form>
                </div>
            )}

            {/* Company Admin Login */}
            {role === "companyAdmin" && (
                <div className="login-box">
                    <h2 className="login-title">Company Admin Login</h2>
                    <form onSubmit={handleCompanyAdminLogin}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Administrator Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="login-button"
                            onClick={handleSendVerificationCode}
                            disabled={isCodeSent}
                        >
                            {isCodeSent ? "Code Sent" : "Send Verification Code"}
                        </button>
                        {isCodeSent && (
                            <>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter Verification Code"
                                        value={enteredCode}
                                        onChange={(e) => setEnteredCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <button className="login-button" type="submit">
                                    Login
                                </button>
                            </>
                        )}
                    </form>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Login;
