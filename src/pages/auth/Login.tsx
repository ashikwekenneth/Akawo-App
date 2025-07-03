import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary">
            Akawo
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="text-primary hover:text-primary/80">
              create an account
            </Link>
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="mx-4 text-xs text-gray-400 uppercase">or</span>
              <Separator className="flex-1" />
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="w-5 h-5 mr-2 text-[#1877f2]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"
                  />
                </svg>
                Continue with Facebook
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9999 1.998C6.4769 1.998 1.9989 6.476 1.9989 12c0 4.824 3.4209 8.840 7.9699 9.758.0739.014.1019-.032.1019-.07v-2.381c-3.2399.711-3.9399-1.416-3.9399-1.416-.5299-1.347-1.2979-1.704-1.2979-1.704-1.0549-.719.0851-.704.0851-.704 1.1689.082 1.7849 1.199 1.7849 1.199 1.0389 1.78 2.7279 1.266 3.3899.967.1079-.752.4089-1.266.7399-1.557-2.5849-.293-5.3019-1.292-5.3019-5.754 0-1.272.4519-2.309 1.1989-3.125-.1169-.295-.5229-1.476.1169-3.075 0 0 .9899-.317 3.2399 1.207.9389-.262 1.9399-.393 2.9399-.398 1.001.005 1.9999.136 2.9369.398 2.2509-1.524 3.2399-1.207 3.2399-1.207.6379 1.599.2379 2.78.1189 3.075.7459.816 1.1989 1.853 1.1989 3.125 0 4.474-2.7209 5.457-5.3159 5.744.4189.359.7849 1.07.7849 2.155 0 1.554-.0139 2.811-.0139 3.193 0 .038.0299.084.1059.069 4.5529-.915 7.9699-4.932 7.9699-9.758-.001-5.523-4.478-10.002-10.001-10.002z"
                  />
                </svg>
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:text-primary/80">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;