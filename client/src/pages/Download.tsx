import { Smartphone, Download as DownloadIcon, Wifi, Zap, Shield, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import appMockup from "@assets/generated_images/mobile_app_screenshot_mockup.png";

const features = [
  {
    icon: Wifi,
    title: "Offline Mode",
    description: "Diagnose crops without internet connection",
  },
  {
    icon: HardDrive,
    title: "Under 50MB",
    description: "Lightweight and fast to download",
  },
  {
    icon: Zap,
    title: "Instant Diagnosis",
    description: "Get results in seconds with built-in AI",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your farm data stays on your device",
  },
];

export default function Download() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Mobile App</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
            Take Crop Scout Anywhere
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Download our mobile app for offline diagnosis, faster scanning, and instant notifications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex gap-4">
                <Button size="lg" className="flex-1" data-testid="button-download-android">
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  Download for Android
                </Button>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="flex-1" data-testid="button-download-apk">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Download APK
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                iOS version coming soon • Currently in beta testing
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
              <img
                src={appMockup}
                alt="Mobile app screenshot"
                className="relative z-10 mx-auto max-w-sm"
                data-testid="img-app-mockup"
              />
            </div>
          </div>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>App Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Complete Functionality</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Camera integration for instant photo capture</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Crop disease library with offline access</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>AI chat assistant with voice input</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Diagnosis history synced across devices</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Smart Notifications</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Regional pest outbreak alerts</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Weather-based disease risk warnings</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Government scheme updates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Expert consultation reminders</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
