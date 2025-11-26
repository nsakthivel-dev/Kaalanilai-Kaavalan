import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, MessageSquare, Bug, Lightbulb, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactTypes = [
  { value: "contact", label: "General Inquiry", icon: MessageSquare },
  { value: "bug", label: "Report a Bug", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
];

const faqs = [
  {
    question: "How accurate is the AI diagnosis?",
    answer: "Our AI has been trained on thousands of crop disease images and achieves approximately 85-90% accuracy. However, we always recommend consulting with local agricultural experts for confirmation and treatment plans.",
  },
  {
    question: "Does the app work offline?",
    answer: "Yes! The mobile app can diagnose common diseases offline. However, for the most up-to-date information and AI chat features, an internet connection is recommended.",
  },
  {
    question: "Is my farm data kept private?",
    answer: "Absolutely. We follow strict data privacy policies. Your farm data and photos are only used to provide diagnosis services and are never shared with third parties without your consent.",
  },
  {
    question: "Which crops are currently supported?",
    answer: "We currently support tomatoes, maize, rice, wheat, potatoes, and bananas. We're continuously adding more crops based on user demand.",
  },
  {
    question: "How do I contact an agricultural expert?",
    answer: "Visit our Experts page to browse verified agricultural extension officers. You can filter by district, specialization, and language, then contact them via chat, phone, or video call.",
  },
];

export default function Contact() {
  const [type, setType] = useState("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const feedbackMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/feedback", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    feedbackMutation.mutate({
      type,
      name,
      email,
      message,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">Get in Touch</h1>
          <p className="text-muted-foreground">
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">support@cropscout.org</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Join our farmer forums</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Bug className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-base">Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">24/7 technical assistance</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>Fill out the form below and we'll respond within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="mb-3 block">Type of Inquiry</Label>
                <RadioGroup value={type} onValueChange={setType}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {contactTypes.map(({ value, label, icon: Icon }) => (
                      <div key={value}>
                        <RadioGroupItem value={value} id={value} className="peer sr-only" />
                        <Label
                          htmlFor={value}
                          className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-card p-4 hover-elevate peer-data-[state=checked]:border-primary cursor-pointer"
                          data-testid={`radio-type-${value}`}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  data-testid="textarea-message"
                />
              </div>

              <Button type="submit" disabled={feedbackMutation.isPending} className="w-full" data-testid="button-submit">
                <Send className="h-4 w-4 mr-2" />
                {feedbackMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card id="faq">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger data-testid={`faq-question-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
