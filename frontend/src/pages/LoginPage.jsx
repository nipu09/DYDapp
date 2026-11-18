import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/ui/AuthLayout";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { loginUser } from "../api/auth";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Show flash message after signup redirect
  useEffect(() => {
    const message = location.state?.message;

    if (message) {
      toast.success(message, {
        id: "signup-success",
      });

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.state, location.pathname, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const input = formData.emailOrUsername.trim();
      const isEmail = input.includes("@");

      // Backend expects email OR username
      const userData = {
        email: isEmail ? input : "",
        username: isEmail ? "" : input,
        password: formData.password,
      };

      await loginUser(userData);

      toast.success("Login successful!", {
        id: "login-success",
      });

      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid email/username or password. Please try again.";

      setError(errorMessage);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        eyebrow="GOOD TO SEE YOU"
        title="Good to see you"
        accent="again."
        kicker="GOOD TO SEE YOU"
        heading="Welcome back"
        subtitle="Your habits are waiting."
        topText="New around here?"
        topLabel="Sign up"
        topTo="/signup"
        footer={
          <>
            New to aadat?{" "}
            <Link
              to="/signup"
              className="font-extrabold text-ink underline decoration-grape underline-offset-[3px]"
            >
              Create an account
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid gap-[18px]">
          {/* Email or Username */}
          <label className="grid gap-2 text-[11px] font-extrabold">
            Email address or username

            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="you@example.com or username"
              autoComplete="username"
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
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-lg border border-[#deded8] bg-transparent px-3.5 text-xs outline-none placeholder:text-[#aaa] focus:border-[#bd72ec] focus:shadow-[0_0_0_3px_#c575f822]"
            />
          </label>

          {/* Remember Me and Forgot Password */}
          <div className="-mt-[5px] flex items-center justify-between text-[10px] text-[#777]">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                className="accent-[#a34ed3]"
              />
              Remember me
            </label>

            <a
              href="#forgot"
              className="text-ink underline underline-offset-[3px]"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-[5px] inline-flex h-[49px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-grape px-[22px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#8d43bd] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}

            {!loading && <span className="text-[17px]">↗</span>}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default LoginPage;