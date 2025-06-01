
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  negotiationData: any;
  contractStatus: "none" | "unsigned" | "signed";
  onStatusChange: (status: "unsigned" | "signed") => void;
}

const ContractModal = ({ 
  isOpen, 
  onClose, 
  creatorName, 
  negotiationData, 
  contractStatus,
  onStatusChange 
}: ContractModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateContract = () => {
    setIsGenerating(true);
    
    // Simulate contract generation
    setTimeout(() => {
      // Create a mock blob for PDF download
      const contractContent = `
CONTRACT AGREEMENT

This is a mock contract between Brand Agency and ${creatorName}

DELIVERABLES:
- ${negotiationData.deliverables_count} posts/content pieces
- Total Value: ₹${negotiationData.agreed_price.toLocaleString()}
- Delivery Window: ${negotiationData.availability_window}

TERMS:
- Payment due within 30 days of delivery
- Content must meet brand guidelines
- Creator retains rights to content after campaign

This is a MOCK CONTRACT for demonstration purposes only.
      `;

      const blob = new Blob([contractContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Contract_${creatorName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onStatusChange("unsigned");
      setIsGenerating(false);
      
      toast({
        title: "Contract Generated",
        description: `Mock contract created for ${creatorName}`,
      });
    }, 1500);
  };

  const handleSignContract = () => {
    onStatusChange("signed");
    toast({
      title: "Contract Signed",
      description: `Contract with ${creatorName} has been marked as signed`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contract Management - {creatorName}</DialogTitle>
          <DialogDescription>
            Generate and manage contracts for this collaboration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Deal Summary</h4>
            <div className="text-sm space-y-1">
              <div>Price: ₹{negotiationData.agreed_price.toLocaleString()}</div>
              <div>Deliverables: {negotiationData.deliverables_count}</div>
              <div>Timeline: {negotiationData.availability_window}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Contract Status:</span>
            <Badge variant={
              contractStatus === "signed" ? "default" : 
              contractStatus === "unsigned" ? "secondary" : "outline"
            }>
              {contractStatus === "signed" ? "Signed" : 
               contractStatus === "unsigned" ? "Unsigned" : "Not Generated"}
            </Badge>
          </div>

          <div className="space-y-3">
            {contractStatus === "none" && (
              <Button 
                onClick={handleGenerateContract} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Contract"}
              </Button>
            )}

            {contractStatus === "unsigned" && (
              <Button 
                onClick={handleSignContract}
                className="w-full"
              >
                Mark as Signed
              </Button>
            )}

            {contractStatus === "signed" && (
              <div className="text-center p-3 bg-green-50 rounded border text-green-700">
                ✓ Contract signed and ready for invoice generation
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;
