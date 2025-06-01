
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Creator {
  id: string;
  username: string;
  name: string;
  niche: string;
}

interface OutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
  type: "email" | "call";
  onNegotiationComplete: (creatorId: string, negotiationData: any) => void;
}

const OutreachModal = ({ isOpen, onClose, creator, type, onNegotiationComplete }: OutreachModalProps) => {
  const [step, setStep] = useState<"draft" | "response" | "transcript">("draft");
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateMockEmailDraft = (creatorName: string, niche: string) => {
    return `Subject: Collaboration Opportunity with [Brand Name]

Hi ${creatorName},

We're reaching out regarding a potential collaboration for our upcoming ${niche} campaign. We'd love to discuss:

- Your rates for sponsored posts/content
- Available deliverables (posts, stories, reels)
- Your availability for the next month
- Any specific requirements you might have

Looking forward to hearing from you!

Best regards,
[Agency Team]`;
  };

  const generateMockCallTranscript = (creatorName: string) => {
    const transcripts = [
      `AgencyRep: Hello, is this ${creatorName}?
Creator: Yes, this is ${creatorName}. How can I help?
AgencyRep: We're interested in collaborating on a campaign for a new brand. What are your rates?
Creator: For a single feed post, I charge ₹25,000, and for two stories, ₹8,000 more. I'm available in the second half of this month.
AgencyRep: Great! Can you handle 2 feed posts and 3 stories?
Creator: Yes, that would be ₹58,000 total. I can deliver over 2 weeks.
AgencyRep: Perfect. We'll send over the brief details.
Creator: Sounds good, looking forward to it!`,
      
      `AgencyRep: Hi ${creatorName}, thanks for taking our call.
Creator: Of course! What's this collaboration about?
AgencyRep: We have a ${creator?.niche} brand campaign coming up. What's your pricing structure?
Creator: I typically charge ₹30,000 per reel and ₹15,000 per story. For multiple deliverables, I can offer a package deal.
AgencyRep: We're looking at 3 reels and 5 stories. What would be your package rate?
Creator: For that volume, I can do ₹120,000 total. I'm free next month.
AgencyRep: That works for us. I'll follow up with contract details.
Creator: Perfect, I'll send you my media kit as well.`
    ];
    
    return transcripts[Math.floor(Math.random() * transcripts.length)];
  };

  const parseNegotiationResponse = (text: string) => {
    // Simple regex parsing for mock data
    const priceMatch = text.match(/₹([\d,]+)/g);
    const deliverableMatch = text.match(/(\d+)\s*(post|reel|story|stories)/gi);
    const timeMatch = text.match(/(next month|this month|week|august|september|available)/i);
    
    const prices = priceMatch ? priceMatch.map(p => parseInt(p.replace(/[₹,]/g, ""))) : [];
    const totalPrice = prices.reduce((sum, price) => sum + price, 0) || 25000; // fallback
    
    const deliverables = deliverableMatch ? deliverableMatch.length : 2; // fallback
    
    return {
      agreed_price: totalPrice,
      deliverables_count: deliverables,
      availability_window: timeMatch ? timeMatch[0] : "TBD",
      follow_up_flag: text.toLowerCase().includes("send") || text.toLowerCase().includes("follow"),
      parsed_summary: `Negotiated ${deliverables} deliverables for ₹${totalPrice.toLocaleString()}. Availability: ${timeMatch ? timeMatch[0] : "TBD"}`
    };
  };

  const handleSendEmail = () => {
    setStep("response");
    toast({
      title: "Email sent",
      description: "Waiting for influencer response..."
    });
  };

  const handleStartCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStep("transcript");
      setIsLoading(false);
      const transcript = generateMockCallTranscript(creator?.name || "Creator");
      setResponseText(transcript);
    }, 2000);
  };

  const handleSubmitResponse = () => {
    if (!responseText.trim()) return;
    
    const negotiationData = parseNegotiationResponse(responseText);
    onNegotiationComplete(creator?.id || "", {
      ...negotiationData,
      contact_method: type,
      raw_response_text: responseText,
      contacted_at: new Date().toISOString(),
      last_response_at: new Date().toISOString(),
      status: "completed"
    });
    
    toast({
      title: "Negotiation completed",
      description: `Successfully parsed response from ${creator?.name}`
    });
    
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setStep("draft");
    setResponseText("");
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  if (!creator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "email" ? "Email Outreach" : "Call Outreach"} - {creator.name}
          </DialogTitle>
          <DialogDescription>
            {type === "email" 
              ? "Send an email and paste the response" 
              : "Initiate a mock call with automated transcript"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {type === "email" && step === "draft" && (
            <>
              <div>
                <Label>Email Draft</Label>
                <Textarea
                  value={generateMockEmailDraft(creator.name, creator.niche)}
                  rows={10}
                  readOnly
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSendEmail} className="w-full">
                Send Email
              </Button>
            </>
          )}

          {type === "email" && step === "response" && (
            <>
              <div>
                <Label>Paste Influencer's Email Response</Label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Paste the influencer's reply here..."
                  rows={8}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleSubmitResponse} 
                disabled={!responseText.trim()}
                className="w-full"
              >
                Parse Response & Save
              </Button>
            </>
          )}

          {type === "call" && step === "draft" && (
            <>
              <div className="text-center p-6">
                <p className="text-lg mb-4">Ready to start call with {creator.name}?</p>
                <p className="text-sm text-gray-600 mb-6">
                  This will generate a mock call transcript automatically.
                </p>
                <Button 
                  onClick={handleStartCall} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Calling..." : "Start Call"}
                </Button>
              </div>
            </>
          )}

          {type === "call" && step === "transcript" && (
            <>
              <div>
                <Label>Call Transcript</Label>
                <Textarea
                  value={responseText}
                  rows={12}
                  readOnly
                  className="mt-2 font-mono text-sm"
                />
              </div>
              <Button onClick={handleSubmitResponse} className="w-full">
                Summarize & Save Negotiation
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutreachModal;
