import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

function Signup_page({ onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    sex: '',
    age: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.username || !formData.email || !formData.password || !formData.sex || !formData.age || !formData.state) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        sex: formData.sex,
        age: parseInt(formData.age),
        state: formData.state,
      };

      const success = await register(userData);
      if (!success) {
        setError('Registration failed. Email might already exist.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Sign Up
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-gray-600 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
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
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm text-gray-600 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm text-gray-600 mb-1">
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm text-gray-600 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
              min="1"
              max="120"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm text-gray-600 mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter your state"
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup_page;
