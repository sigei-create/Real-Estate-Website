
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signin() {
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Capture input changes
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  // Submit signin form
  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || 'Signin failed'
        );
      }

      // Redirect after successful signin
      navigate('/profile');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

      </form>

      {/* Error message */}
      {error && (
        <p className="text-red-600 mt-4">
          {error}
        </p>
      )}

      {/* Signup link */}
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>

        <Link
          to="/signup"
          className="text-blue-700 hover:underline"
        >
          Sign Up
        </Link>
      </div>

    </div>
  );
}
