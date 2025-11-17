import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ThemeToggle from '@/components/ThemeToggle';
import { useStudent } from '@/contexts/StudentContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useStudent();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    class_name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      if (isLogin) {
        // Store token
        localStorage.setItem('token', data.access_token);
        
        // Fetch user data
        try {
          const userResponse = await fetch('http://localhost:8000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
            },
          });
          
          console.log('User data fetch response status:', userResponse.status);
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('✅ Successfully fetched user data from backend:', userData);
            localStorage.setItem('user', JSON.stringify(userData));
            // Refresh the context with new user data
            refreshUserData();
          } else {
            const errorText = await userResponse.text();
            console.error('❌ Failed to fetch user data. Status:', userResponse.status, 'Error:', errorText);
            console.warn('Using fallback user data from login form');
            // Fallback: create minimal user data from login response
            const minimalUser = {
              email: formData.email,
              name: formData.email.split('@')[0], // Use email prefix as name
              class_name: '1', // Default class
            };
            localStorage.setItem('user', JSON.stringify(minimalUser));
            refreshUserData();
          }
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          // Still proceed with minimal user data
          const minimalUser = {
            email: formData.email,
            name: formData.email.split('@')[0],
            class_name: '1',
          };
          localStorage.setItem('user', JSON.stringify(minimalUser));
          refreshUserData();
        }
        
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.success('Signup successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', class_name: '', email: '', password: '' });
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <ThemeToggle />
      
      <Card className="w-full max-w-md p-8 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            {isLogin ? 'Welcome Back! 👋' : 'Join the Adventure! 🚀'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Login to continue learning' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_name">Class</Label>
                <Input
                  id="class_name"
                  name="class_name"
                  type="text"
                  placeholder="e.g., 1, 2, 3"
                  value={formData.class_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ name: '', class_name: '', email: '', password: '' });
            }}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
