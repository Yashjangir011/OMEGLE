import { useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { signupSchema, type SignupFormData } from '../../schemas/authSchema';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

function Signup_page({ onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    sex: '',
    age: '',
    state: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const validation = signupSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      validation.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof SignupFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
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
        setErrors({ email: 'Registration failed. Email might already exist.' });
      }
    } catch (error) {
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Sign Up
        </h2>


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
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:outline-none ${
                errors.username 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
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
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:outline-none ${
                errors.confirm_password 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            />
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
            )}
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
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 shadow-sm focus:ring-2 focus:outline-none ${
                errors.sex 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.sex && (
              <p className="mt-1 text-sm text-red-600">{errors.sex}</p>
            )}
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
              min="1"
              max="120"
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:outline-none ${
                errors.age 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
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
              className={`w-full px-4 py-2 rounded-xl border bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:ring-2 focus:outline-none ${
                errors.state 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-gray-200'
              }`}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
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
