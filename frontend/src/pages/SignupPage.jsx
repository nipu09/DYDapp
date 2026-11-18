import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/ui/AuthLayout";
import { registerUser } from "../api/auth";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      };

      await registerUser(userData);

      

      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in.",
        },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="FREE, ALWAYS"
      title="Your best days"
      accent="start here."
      kicker="FREE, ALWAYS"
      heading="Join the streak"
      subtitle="Create your account in a minute."
      topText="Already have an account?"
      topLabel="Log in"
      topTo="/login"
      footer={
        <>
          By signing up, you agree to our{" "}
          <a
            href="#terms"
            className="font-extrabold text-ink underline decoration-grape underline-offset-[3px]"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#privacy"
            className="font-extrabold text-ink underline decoration-grape underline-offset-[3px]"
          >
            Privacy Policy
          </a>
          .
        </>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-[18px]">
        {/* Full Name */}
        <label className="grid gap-2 text-[11px] font-extrabold">
          Full name
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]"
          />
        </label>

        {/* Username */}
        <label className="grid gap-2 text-[11px] font-extrabold">
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]"
          />
        </label>

        {/* Email */}
        <label className="grid gap-2 text-[11px] font-extrabold">
          Email address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]"
          />
        </label>

        {/* Password */}
        <label className="grid gap-2 text-[11px] font-extrabold">
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            minLength={8}
            required
            className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]"
          />
        </label>

        {/* Confirm Password */}
        <label className="grid gap-2 text-[11px] font-extrabold">
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Enter it again"
            required
            className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]"
          />
        </label>

        {/* Error Message */}
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-[5px] inline-flex h-[49px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-grape px-[22px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#8d43bd] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
          {!loading && <span className="text-[17px]">↗</span>}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
