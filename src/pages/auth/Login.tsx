import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../store/auth.store';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      
      if (response.data.status === 'success') {
        const { user: apiUser, accessToken, refreshToken } = response.data.data;
        
        const authUser: any = {
          id: apiUser.id,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          email: apiUser.email,
          phone: apiUser.phone || '08000000000',
          role: (apiUser.role as string).toLowerCase().replace('_', '') as any
        };
        
        setAuth.setUser(authUser);
        setAuth.setToken(accessToken);
        setAuth.setRefreshToken(refreshToken);
        navigate(`/${authUser.role}/dashboard`);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <Logo size={48} variant="stacked" />
          </Link>
          <h1 className="text-h1">Welcome Back</h1>
          <p className="text-textgray text-small">Sign in to your Recovang account</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-bordergray">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error text-ui font-bold">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <TextField
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <TextField
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <button type="button" className="text-ui font-bold text-primary hover:underline">Forgot Password?</button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-[56px] text-body" 
              isLoading={isLoading}
            >
              Sign In <LogIn size={20} />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-bordergray text-center">
            <p className="text-small text-textgray">
              Don't have an account? {' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
