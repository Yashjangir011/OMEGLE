import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, type LoginFormData } from '../../schemas/authSchema';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

function Login_page({ onSwitchToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const validation = loginSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      validation.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof LoginFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setErrors({ email: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ email: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:outline-none ${
                errors.email 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:outline-none ${
                errors.password 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login_page;
