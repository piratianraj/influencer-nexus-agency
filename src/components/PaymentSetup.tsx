
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard } from 'lucide-react';

interface PaymentSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentSetup: React.FC<PaymentSetupProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Processing Setup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              To enable payment processing, this application needs to be connected to Supabase 
              for secure backend functionality and Stripe integration.
            </AlertDescription>
          </Alert>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 1: Connect to Supabase</h3>
              <p className="text-sm text-gray-600">
                Click the green Supabase button in the top right to connect your project to Supabase. 
                This will enable:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Secure user authentication</li>
                <li>Database storage for payments</li>
                <li>Backend API functions</li>
                <li>Stripe integration capabilities</li>
              </ul>
              <Button onClick={() => setStep(2)} className="w-full">
                I've Connected Supabase
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 2: Set Up Stripe</h3>
              <p className="text-sm text-gray-600">
                After connecting Supabase, you'll need to:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Create a Stripe account at stripe.com</li>
                <li>Get your Stripe Secret Key from the dashboard</li>
                <li>Add it to your Supabase Edge Function secrets</li>
                <li>Deploy payment processing functions</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Payment processing requires a backend server. 
                  The Supabase integration provides this functionality securely.
                </p>
              </div>
              <Button onClick={onClose} className="w-full">
                Got It!
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
