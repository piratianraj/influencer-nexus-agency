
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'brand' | 'creator'>('brand');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, loginAsGuest, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Reset mode when defaultMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      // Reset form when modal opens
      setEmail('');
      setPassword('');
      setName('');
      setIsSubmitting(false);
    }
  }, [isOpen, defaultMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        const { error } = await login(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error,
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        onClose();
        navigate('/');
      } else {
        if (!name.trim()) {
          toast({
            title: "Name Required",
            description: "Please enter your full name.",
            variant: "destructive"
          });
          return;
        }
        
        const { error } = await signup(email, password, name, userType);
        if (error) {
          toast({
            title: "Signup Failed",
            description: error,
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        onClose();
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      toast({
        title: "Guest Session Started",
        description: "You can now browse and search creators.",
      });
      onClose();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start guest session.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="userType">Account Type</Label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'brand' | 'creator')}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="brand">Brand/Company</option>
                  <option value="creator">Content Creator</option>
                </select>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          Continue as Guest
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-blue-600 hover:underline"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
