
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  negotiationData: any;
  invoiceStatus: "none" | "unpaid" | "paid";
  onStatusChange: (status: "unpaid" | "paid") => void;
  contractSigned: boolean;
}

const InvoiceModal = ({ 
  isOpen, 
  onClose, 
  creatorName, 
  negotiationData, 
  invoiceStatus,
  onStatusChange,
  contractSigned 
}: InvoiceModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateInvoice = () => {
    setIsGenerating(true);
    
    // Simulate invoice generation
    setTimeout(() => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      const invoiceContent = `
INVOICE

Bill To: ${creatorName}
From: Brand Agency
Invoice Date: ${new Date().toLocaleDateString()}
Due Date: ${dueDate.toLocaleDateString()}

DESCRIPTION:
${negotiationData.deliverables_count} content deliverables as per contract
Delivery period: ${negotiationData.availability_window}

AMOUNT DUE: ₹${negotiationData.agreed_price.toLocaleString()}

Payment Terms: Net 30 days
This is a MOCK INVOICE for demonstration purposes only.
      `;

      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${creatorName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onStatusChange("unpaid");
      setIsGenerating(false);
      
      toast({
        title: "Invoice Generated",
        description: `Mock invoice created for ${creatorName}`,
      });
    }, 1500);
  };

  const handleMarkAsPaid = () => {
    onStatusChange("paid");
    toast({
      title: "Payment Recorded",
      description: `Invoice for ${creatorName} has been marked as paid`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invoice Management - {creatorName}</DialogTitle>
          <DialogDescription>
            Generate and track invoices for this collaboration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Invoice Details</h4>
            <div className="text-sm space-y-1">
              <div>Amount: ₹{negotiationData.agreed_price.toLocaleString()}</div>
              <div>Deliverables: {negotiationData.deliverables_count}</div>
              <div>Due: 30 days from generation</div>
            </div>
          </div>

          {!contractSigned && (
            <div className="text-center p-3 bg-yellow-50 rounded border text-yellow-700">
              ⚠️ Contract must be signed before generating invoice
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-medium">Invoice Status:</span>
            <Badge variant={
              invoiceStatus === "paid" ? "default" : 
              invoiceStatus === "unpaid" ? "secondary" : "outline"
            }>
              {invoiceStatus === "paid" ? "Paid" : 
               invoiceStatus === "unpaid" ? "Unpaid" : "Not Generated"}
            </Badge>
          </div>

          <div className="space-y-3">
            {invoiceStatus === "none" && contractSigned && (
              <Button 
                onClick={handleGenerateInvoice} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Invoice"}
              </Button>
            )}

            {invoiceStatus === "unpaid" && (
              <Button 
                onClick={handleMarkAsPaid}
                className="w-full"
              >
                Mark as Paid
              </Button>
            )}

            {invoiceStatus === "paid" && (
              <div className="text-center p-3 bg-green-50 rounded border text-green-700">
                ✓ Invoice paid - collaboration complete
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
