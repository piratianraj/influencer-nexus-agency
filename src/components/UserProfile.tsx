
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setCompany(user.company || '');
      setIndustry(user.industry || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await updateProfile({
        name,
        company,
        industry,
      });

      if (error) {
        toast({
          title: "Update Failed",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-blue-600 capitalize">{user.type} Account</p>
              {user.isGuest && (
                <p className="text-sm text-orange-600">Guest User</p>
              )}
            </div>
          </div>
          
          {!user.isGuest && (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              {user.type === 'brand' && (
                <>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Enter your industry"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving || isLoading}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </>
          )}
          
          {user.isGuest && (
            <div className="text-center text-gray-500">
              <p>Sign up to save your profile and preferences.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
