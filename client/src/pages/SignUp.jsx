import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Handle input change & trim input values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  // Validate form fields
  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      return "All fields are required.";
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Password length validation
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return null; // No errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      setLoading(false);
      setSuccess("Signup successful! Redirecting to Sign In...");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-6">Sign Up</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to="/sign-in" className="text-blue-700">Sign in</Link>
      </div>

      {/* Error & Success Messages */}
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {success && <p className="text-green-500 mt-5">{success}</p>}
    </div>
  );
}
