
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NegotiationData {
  contact_method: "email" | "call";
  agreed_price: number;
  deliverables_count: number;
  availability_window: string;
  follow_up_flag: boolean;
  parsed_summary: string;
  contacted_at: string;
  status: string;
}

interface NegotiationSummaryProps {
  negotiation: NegotiationData;
  creatorName: string;
  onOpenContract: () => void;
  onOpenInvoice: () => void;
  contractStatus: "none" | "unsigned" | "signed";
  invoiceStatus: "none" | "unpaid" | "paid";
}

const NegotiationSummary = ({ 
  negotiation, 
  creatorName, 
  onOpenContract, 
  onOpenInvoice,
  contractStatus,
  invoiceStatus 
}: NegotiationSummaryProps) => {
  return (
    <Card className="mt-4 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center justify-between">
          Negotiation Complete
          <Badge variant={negotiation.contact_method === "email" ? "default" : "secondary"}>
            {negotiation.contact_method}
          </Badge>
        </CardTitle>
        <CardDescription className="text-green-700">
          Successfully negotiated with {creatorName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Agreed Price:</span>
            <span className="ml-2">₹{negotiation.agreed_price.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium">Deliverables:</span>
            <span className="ml-2">{negotiation.deliverables_count}</span>
          </div>
          <div>
            <span className="font-medium">Availability:</span>
            <span className="ml-2">{negotiation.availability_window}</span>
          </div>
          <div>
            <span className="font-medium">Follow-up Needed:</span>
            <span className="ml-2">{negotiation.follow_up_flag ? "Yes" : "No"}</span>
          </div>
        </div>
        
        <div className="p-3 bg-white rounded border">
          <h5 className="font-medium mb-2">Summary:</h5>
          <p className="text-sm text-gray-700">{negotiation.parsed_summary}</p>
        </div>

        {/* Contract & Invoice Status */}
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Contract:</span>
            <Badge variant={
              contractStatus === "signed" ? "default" : 
              contractStatus === "unsigned" ? "secondary" : "outline"
            }>
              {contractStatus === "signed" ? "Signed" : 
               contractStatus === "unsigned" ? "Unsigned" : "Not Generated"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Invoice:</span>
            <Badge variant={
              invoiceStatus === "paid" ? "default" : 
              invoiceStatus === "unpaid" ? "secondary" : "outline"
            }>
              {invoiceStatus === "paid" ? "Paid" : 
               invoiceStatus === "unpaid" ? "Unpaid" : "Not Generated"}
            </Badge>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button onClick={onOpenContract} variant="default">
            {contractStatus === "none" ? "Generate Contract" : "Manage Contract"}
          </Button>
          <Button 
            onClick={onOpenInvoice} 
            variant="secondary"
            disabled={contractStatus !== "signed"}
          >
            {invoiceStatus === "none" ? "Generate Invoice" : "Manage Invoice"}
          </Button>
          {negotiation.follow_up_flag && (
            <Badge variant="outline" className="px-3 py-1">
              Follow-up Required
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiationSummary;
