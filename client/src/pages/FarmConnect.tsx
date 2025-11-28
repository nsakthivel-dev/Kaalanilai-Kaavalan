import { useState } from "react";
import { 
  Search, 
  Globe, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Users, 
  Handshake, 
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Play,
  ThumbsUp,
  MapPin,
  Star,
  Upload,
  X,
  Plus,
  Filter,
  Leaf,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

// Types for our data
interface EmergencyPost {
  id: number;
  title: string;
  cropType: string;
  timePosted: string;
  responses: number;
  imageUrl: string;
}

interface MarketPrice {
  id: number;
  cropName: string;
  price: number;
  location: string;
  trend: "up" | "down" | "stable";
  reportedBy: number;
  lastUpdated: string;
}

interface Alert {
  id: number;
  title: string;
  type: "weather" | "sowing" | "scheme" | "demand";
  urgency: "high" | "medium" | "low";
  description: string;
}

interface Innovation {
  id: number;
  title: string;
  farmerName: string;
  age: number;
  results: string;
  triedBy: number;
  costSavings: string;
  videoUrl: string;
}

interface Mentor {
  id: number;
  name: string;
  experience: number;
  specialty: string[];
  location: string;
  rating: number;
  reviews: number;
}

interface BuyerRequest {
  id: number;
  company: string;
  crop: string;
  quantity: string;
  quality: string;
  location: string;
  priceRange: string;
}

interface Discussion {
  id: number;
  title: string;
  category: string;
  replies: number;
  latestReply: string;
  solved: boolean;
  upvotes: number;
}

// Sample data
const sampleEmergencies: EmergencyPost[] = [
  {
    id: 1,
    title: "Cotton Pest Infestation",
    cropType: "Cotton",
    timePosted: "15 mins ago",
    responses: 3,
    imageUrl: "https://images.unsplash.com/photo-1597668486775-1d7ff3d7e1cf?w=300"
  },
  {
    id: 2,
    title: "Tomato Yellowing Issue",
    cropType: "Tomato",
    timePosted: "42 mins ago",
    responses: 7,
    imageUrl: "https://images.unsplash.com/photo-1592840500050-257b3bdd0369?w=300"
  },
  {
    id: 3,
    title: "Soil Nutrient Deficiency",
    cropType: "Rice",
    timePosted: "1 hour ago",
    responses: 5,
    imageUrl: "https://images.unsplash.com/photo-1597668486775-1d7ff3d7e1cf?w=300"
  }
];

const sampleMarketPrices: MarketPrice[] = [
  {
    id: 1,
    cropName: "Tomato",
    price: 45,
    location: "Coimbatore",
    trend: "up",
    reportedBy: 124,
    lastUpdated: "2 mins ago"
  },
  {
    id: 2,
    cropName: "Onion",
    price: 32,
    location: "Erode",
    trend: "down",
    reportedBy: 89,
    lastUpdated: "5 mins ago"
  },
  {
    id: 3,
    cropName: "Rice",
    price: 28,
    location: "Thanjavur",
    trend: "stable",
    reportedBy: 210,
    lastUpdated: "10 mins ago"
  },
  {
    id: 4,
    cropName: "Cotton",
    price: 65,
    location: "Madurai",
    trend: "up",
    reportedBy: 76,
    lastUpdated: "15 mins ago"
  },
  {
    id: 5,
    cropName: "Chili",
    price: 85,
    location: "Salem",
    trend: "up",
    reportedBy: 92,
    lastUpdated: "20 mins ago"
  },
  {
    id: 6,
    cropName: "Potato",
    price: 22,
    location: "Dindigul",
    trend: "stable",
    reportedBy: 156,
    lastUpdated: "25 mins ago"
  },
  {
    id: 7,
    cropName: "Wheat",
    price: 18,
    location: "Trichy",
    trend: "down",
    reportedBy: 68,
    lastUpdated: "30 mins ago"
  },
  {
    id: 8,
    cropName: "Maize",
    price: 25,
    location: "Karur",
    trend: "stable",
    reportedBy: 112,
    lastUpdated: "35 mins ago"
  }
];

const sampleAlerts: Alert[] = [
  {
    id: 1,
    title: "Heavy Rain Expected",
    type: "weather",
    urgency: "high",
    description: "30-40mm rainfall expected in next 24 hours"
  },
  {
    id: 2,
    title: "Best Time to Sow Cotton",
    type: "sowing",
    urgency: "medium",
    description: "Optimal sowing window for cotton in your region"
  },
  {
    id: 3,
    title: "PMKSY Scheme Deadline",
    type: "scheme",
    urgency: "high",
    description: "Apply for Pradhan Mantri Krishi Sinchayee Yojana before Dec 15"
  },
  {
    id: 4,
    title: "High Demand for Organic Vegetables",
    type: "demand",
    urgency: "medium",
    description: "Organic tomatoes and cucumbers in high demand"
  },
  {
    id: 5,
    title: "Fertilizer Subsidy Available",
    type: "scheme",
    urgency: "low",
    description: "50% subsidy on organic fertilizers until March"
  }
];

const sampleInnovations: Innovation[] = [
  {
    id: 1,
    title: "Drip Irrigation System",
    farmerName: "Rajesh Kumar",
    age: 32,
    results: "40% water savings, 25% yield increase",
    triedBy: 45,
    costSavings: "₹15,000 annually",
    videoUrl: "#"
  },
  {
    id: 2,
    title: "Organic Pest Control",
    farmerName: "Priya Devi",
    age: 28,
    results: "Eliminated chemical pesticides, improved soil health",
    triedBy: 62,
    costSavings: "₹8,000 annually",
    videoUrl: "#"
  },
  {
    id: 3,
    title: "Vertical Farming Technique",
    farmerName: "Arjun Singh",
    age: 25,
    results: "3x space efficiency, year-round cultivation",
    triedBy: 28,
    costSavings: "₹22,000 annually",
    videoUrl: "#"
  },
  {
    id: 4,
    title: "Solar-Powered Water Pump",
    farmerName: "Suresh Babu",
    age: 45,
    results: "Reduced electricity costs by 90%",
    triedBy: 37,
    costSavings: "₹35,000 annually",
    videoUrl: "#"
  }
];

const sampleMentors: Mentor[] = [
  {
    id: 1,
    name: "Dr. Anil Kumar",
    experience: 25,
    specialty: ["Rice", "Wheat", "Sugarcane"],
    location: "Coimbatore",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Meena Devi",
    experience: 18,
    specialty: ["Vegetables", "Organic Farming"],
    location: "Erode",
    rating: 4.9,
    reviews: 98
  },
  {
    id: 3,
    name: "Karthik Raj",
    experience: 15,
    specialty: ["Cotton", "Turmeric"],
    location: "Madurai",
    rating: 4.7,
    reviews: 87
  },
  {
    id: 4,
    name: "Lakshmi Priya",
    experience: 22,
    specialty: ["Flowers", "Fruits", "Hydroponics"],
    location: "Salem",
    rating: 4.9,
    reviews: 112
  },
  {
    id: 5,
    name: "Ganesh Babu",
    experience: 30,
    specialty: ["Pulses", "Oilseeds"],
    location: "Trichy",
    rating: 4.6,
    reviews: 156
  },
  {
    id: 6,
    name: "Deepa Rani",
    experience: 12,
    specialty: ["Dairy", "Organic Farming"],
    location: "Thanjavur",
    rating: 4.8,
    reviews: 76
  }
];

const sampleBuyerRequests: BuyerRequest[] = [
  {
    id: 1,
    company: "Southern Agro Foods",
    crop: "Organic Tomatoes",
    quantity: "500 kg/week",
    quality: "Grade A",
    location: "Within 50km radius",
    priceRange: "₹40-₹50/kg"
  },
  {
    id: 2,
    company: "Tamil Nadu Co-op Federation",
    crop: "Basmati Rice",
    quantity: "10 tons/month",
    quality: "Premium",
    location: "State-wide",
    priceRange: "₹35-₹45/kg"
  },
  {
    id: 3,
    company: "Madurai Textiles Ltd",
    crop: "Cotton",
    quantity: "2 tons/month",
    quality: "Long staple",
    location: "Madurai district",
    priceRange: "₹70-₹80/kg"
  },
  {
    id: 4,
    company: "Chennai Organic Markets",
    crop: "Mixed Vegetables",
    quantity: "Varies",
    quality: "Organic certified",
    location: "Chennai &周边",
    priceRange: "Market rate"
  }
];

const sampleDiscussions: Discussion[] = [
  {
    id: 1,
    title: "Best organic fertilizer for tomato plants?",
    category: "Fertilizers",
    replies: 24,
    latestReply: "5 mins ago",
    solved: true,
    upvotes: 42
  },
  {
    id: 2,
    title: "How to prevent pest infestation in cotton?",
    category: "Pests",
    replies: 18,
    latestReply: "12 mins ago",
    solved: false,
    upvotes: 35
  },
  {
    id: 3,
    title: "Government schemes for small farmers in 2024",
    category: "Schemes",
    replies: 32,
    latestReply: "18 mins ago",
    solved: true,
    upvotes: 56
  },
  {
    id: 4,
    title: "Water conservation techniques for drought-prone areas",
    category: "Irrigation",
    replies: 27,
    latestReply: "22 mins ago",
    solved: false,
    upvotes: 48
  },
  {
    id: 5,
    title: "Setting up a greenhouse for vegetables",
    category: "Infrastructure",
    replies: 15,
    latestReply: "30 mins ago",
    solved: false,
    upvotes: 29
  },
  {
    id: 6,
    title: "Market prices for onion in Tamil Nadu",
    category: "Market",
    replies: 41,
    latestReply: "35 mins ago",
    solved: true,
    upvotes: 67
  },
  {
    id: 7,
    title: "Best crops for summer season in Coimbatore",
    category: "Crops",
    replies: 19,
    latestReply: "40 mins ago",
    solved: false,
    upvotes: 33
  },
  {
    id: 8,
    title: "Organic certification process for farmers",
    category: "Certification",
    replies: 22,
    latestReply: "45 mins ago",
    solved: true,
    upvotes: 41
  }
];

const cropTypes = ["All", "Rice", "Wheat", "Cotton", "Vegetables", "Fruits", "Pulses", "Oilseeds"];
const experienceLevels = ["All", "Beginner (0-2 years)", "Intermediate (3-7 years)", "Experienced (8+ years)"];

export default function FarmConnect() {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [radius, setRadius] = useState([50]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMoreDiscussions, setShowMoreDiscussions] = useState(false);
  const [emergencyTitle, setEmergencyTitle] = useState("");
  const [emergencyDescription, setEmergencyDescription] = useState("");
  const [emergencyCrop, setEmergencyCrop] = useState("");
  const [emergencyImage, setEmergencyImage] = useState<File | null>(null);
  const { toast } = useToast();

  // Filter discussions based on show more state
  const displayedDiscussions = showMoreDiscussions 
    ? sampleDiscussions 
    : sampleDiscussions.slice(0, 4);

  // Handle emergency post submission
  const handleEmergencyPost = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Emergency Post Created",
      description: "Your emergency request has been posted successfully!",
    });
    setIsEmergencyModalOpen(false);
    // Reset form
    setEmergencyTitle("");
    setEmergencyDescription("");
    setEmergencyCrop("");
    setEmergencyImage(null);
  };

  // Handle price report submission
  const handlePriceReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Price Reported",
      description: "Thank you for reporting the market price!",
    });
    setIsPriceModalOpen(false);
  };

  // Handle mentor connection request
  const handleMentorRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Sent",
      description: "Your mentor connection request has been sent!",
    });
    setIsMentorModalOpen(false);
  };

  // Handle upvote
  const handleUpvote = (id: number) => {
    toast({
      title: "Upvoted!",
      description: "You've upvoted this discussion.",
    });
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ta" : "en");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEmergencyImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        {/* Emergency Help Board */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              URGENT HELP NEEDED
            </h2>
            <Dialog open={isEmergencyModalOpen} onOpenChange={setIsEmergencyModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your Emergency
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Post Emergency Request
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEmergencyPost}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergency-title">Problem Title</Label>
                      <Input
                        id="emergency-title"
                        value={emergencyTitle}
                        onChange={(e) => setEmergencyTitle(e.target.value)}
                        placeholder="Describe the problem briefly"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency-crop">Crop Type</Label>
                      <Select value={emergencyCrop} onValueChange={setEmergencyCrop}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          {cropTypes.slice(1).map((crop) => (
                            <SelectItem key={crop} value={crop.toLowerCase()}>
                              {crop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="emergency-description">Description</Label>
                      <Textarea
                        id="emergency-description"
                        value={emergencyDescription}
                        onChange={(e) => setEmergencyDescription(e.target.value)}
                        placeholder="Provide detailed information about the problem"
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency-image">Upload Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="emergency-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="flex-1"
                        />
                        {emergencyImage && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Leaf className="h-3 w-3" />
                            Image Added
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsEmergencyModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Post Emergency
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleEmergencies.map((emergency) => (
              <Card key={emergency.id} className="border border-red-200 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={emergency.imageUrl} 
                      alt={emergency.title} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-red-700">{emergency.title}</h3>
                        <Badge variant="destructive">{emergency.cropType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{emergency.timePosted}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium">{emergency.responses} responses</span>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-full">
                          Help Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Market Intelligence */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                TODAY'S MARKET PRICES
              </h2>
              <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                    Report Price
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Report Market Price
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handlePriceReport}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="crop-name">Crop Name</Label>
                        <Input id="crop-name" placeholder="Enter crop name" required />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹/kg)</Label>
                        <Input id="price" type="number" placeholder="Enter price" required />
                      </div>
                      <div>
                        <Label htmlFor="location">Market Location</Label>
                        <Input id="location" placeholder="Enter location" required />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity Available</Label>
                        <Input id="quantity" placeholder="Enter quantity" required />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsPriceModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Report Price
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {sampleMarketPrices.map((price) => (
                <Card key={price.id} className="border border-green-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{price.cropName}</h3>
                          <Badge variant="outline">{price.location}</Badge>
                        </div>
                        <p className="text-2xl font-bold text-green-700 mt-1">₹{price.price}/kg</p>
                        <p className="text-sm text-muted-foreground">
                          Reported by {price.reportedBy} farmers • {price.lastUpdated}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {price.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : price.trend === "down" ? (
                            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                          <span className={`text-sm font-medium ${
                            price.trend === "up" ? "text-green-600" : 
                            price.trend === "down" ? "text-red-600" : "text-muted-foreground"
                          }`}>
                            {price.trend === "up" ? "Up" : price.trend === "down" ? "Down" : "Stable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* This Week Alerts */}
          <section>
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
              <Calendar className="h-6 w-6" />
              THIS WEEK ALERTS
            </h2>
            
            <div className="space-y-4">
              {sampleAlerts.map((alert) => (
                <Card key={alert.id} className="border border-blue-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        alert.type === "weather" ? "bg-blue-100" :
                        alert.type === "sowing" ? "bg-green-100" :
                        alert.type === "scheme" ? "bg-purple-100" : "bg-orange-100"
                      }`}>
                        {alert.type === "weather" ? (
                          <Calendar className="h-5 w-5 text-blue-600" />
                        ) : alert.type === "sowing" ? (
                          <Leaf className="h-5 w-5 text-green-600" />
                        ) : alert.type === "scheme" ? (
                          <Star className="h-5 w-5 text-purple-600" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge 
                            variant={alert.urgency === "high" ? "destructive" : alert.urgency === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {alert.urgency === "high" ? "High" : alert.urgency === "medium" ? "Medium" : "Low"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Young Farmers Corner */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2 mb-6">
            <Play className="h-6 w-6" />
            INNOVATION SHOWCASE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleInnovations.map((innovation) => (
              <Card key={innovation.id} className="border border-purple-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center">
                      <Play className="h-8 w-8 text-purple-600" />
                    </div>
                    <Button size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700">
                      <Play className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mt-3">{innovation.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {innovation.farmerName} ({innovation.age} yrs)
                  </p>
                  <p className="text-sm mt-2">{innovation.results}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {innovation.triedBy}
                    </Badge>
                    <span className="text-sm font-medium text-green-600">{innovation.costSavings}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-3 border-purple-500 text-purple-700 hover:bg-purple-50">
                    Watch & Learn
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* Direct Buyer Connection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-orange-700 flex items-center gap-2 mb-6">
            <Handshake className="h-6 w-6" />
            BUYERS LOOKING FOR SUPPLIES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleBuyerRequests.map((buyer) => (
              <Card key={buyer.id} className="border border-orange-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-orange-700">{buyer.company}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{buyer.crop}</p>
                    </div>
                    <Badge variant="outline" className="border-orange-500 text-orange-700">
                      {buyer.quantity}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-24">Quality:</span>
                      <span className="text-sm">{buyer.quality}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-24">Location:</span>
                      <span className="text-sm">{buyer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-24">Price:</span>
                      <span className="text-sm font-medium text-green-600">{buyer.priceRange}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                      I Can Supply
                    </Button>
                    <Button variant="outline" className="border-orange-500 text-orange-700 hover:bg-orange-50">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Discussions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              ACTIVE DISCUSSIONS
            </h2>
            <Button variant="outline" className="border-teal-500 text-teal-700 hover:bg-teal-50">
              Start Discussion
            </Button>
          </div>
          
          <div className="space-y-4">
            {displayedDiscussions.map((discussion) => (
              <Card key={discussion.id} className="border border-teal-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 h-auto"
                      onClick={() => handleUpvote(discussion.id)}
                    >
                      <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                      <span className="ml-1 text-sm font-medium">{discussion.upvotes}</span>
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{discussion.title}</h3>
                        {discussion.solved && (
                          <Badge variant="secondary" className="ml-2">
                            Solved
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{discussion.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {discussion.replies} replies • {discussion.latestReply}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="border-teal-500 text-teal-700 hover:bg-teal-50"
              onClick={() => setShowMoreDiscussions(!showMoreDiscussions)}
            >
              {showMoreDiscussions ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show More
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Seasonal Calendar */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-cyan-700 flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6" />
            THIS MONTH IN YOUR REGION
          </h2>
          
          <Card className="border border-cyan-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => {
                  const day = index - 3; // Adjust for month start
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isToday = day === 15; // Example today
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-16 p-1 border rounded ${
                        isCurrentMonth 
                          ? isToday 
                            ? "bg-cyan-100 border-cyan-500" 
                            : "border-border hover:bg-muted/50"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className={`text-center text-sm ${
                            isToday ? "font-bold text-cyan-700" : ""
                          }`}>
                            {day}
                          </div>
                          {day === 5 && (
                            <div className="text-[8px] bg-green-100 text-green-800 rounded px-1 py-0.5 mt-1 text-center">
                              Sow
                            </div>
                          )}
                          {day === 12 && (
                            <div className="text-[8px] bg-yellow-100 text-yellow-800 rounded px-1 py-0.5 mt-1 text-center">
                              Harvest
                            </div>
                          )}
                          {day === 20 && (
                            <div className="text-[8px] bg-blue-100 text-blue-800 rounded px-1 py-0.5 mt-1 text-center">
                              Weather
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Sowing Window
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  Harvest Time
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Weather Prediction
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Stats Dashboard */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6" />
            QUICK STATS DASHBOARD
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">1,248</div>
                <div className="text-sm text-muted-foreground mt-1">Active Farmers</div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">86</div>
                <div className="text-sm text-muted-foreground mt-1">Problems Solved</div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">241</div>
                <div className="text-sm text-muted-foreground mt-1">Fair Trades</div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">57</div>
                <div className="text-sm text-muted-foreground mt-1">Success Stories</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Floating Quick Help Button */}
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
        onClick={() => setIsEmergencyModalOpen(true)}
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}