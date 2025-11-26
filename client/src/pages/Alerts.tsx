import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Cloud, Megaphone, Gift, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Alert as AlertType } from "@shared/schema";

const iconMap = {
  pest_outbreak: AlertTriangle,
  weather: Cloud,
  bulletin: Megaphone,
  scheme: Gift,
};

const severityColors = {
  urgent: "destructive",
  warning: "default",
  info: "secondary",
} as const;

export default function Alerts() {
  const { data: alerts, isLoading } = useQuery<AlertType[]>({
    queryKey: ["/api/alerts"],
  });

  const groupedAlerts = alerts?.reduce((acc, alert) => {
    const type = alert.type || "bulletin";
    if (!acc[type]) acc[type] = [];
    acc[type].push(alert);
    return acc;
  }, {} as Record<string, AlertType[]>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">Alerts & Updates</h1>
          <p className="text-muted-foreground">
            Stay informed about pest outbreaks, weather risks, and agricultural schemes
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Input
                placeholder="Search alerts..."
                className="max-w-md"
                data-testid="input-search-alerts"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
            <TabsTrigger value="all" data-testid="tab-all">All Alerts</TabsTrigger>
            <TabsTrigger value="pest_outbreak" data-testid="tab-pest">Pest Outbreaks</TabsTrigger>
            <TabsTrigger value="weather" data-testid="tab-weather">Weather Warnings</TabsTrigger>
            <TabsTrigger value="bulletin" data-testid="tab-bulletin">Bulletins</TabsTrigger>
            <TabsTrigger value="scheme" data-testid="tab-scheme">Government Schemes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {alerts?.map(alert => {
                  const Icon = iconMap[alert.type as keyof typeof iconMap] || Megaphone;
                  const severityVariant = severityColors[alert.severity as keyof typeof severityColors] || "secondary";

                  return (
                    <Card
                      key={alert.id}
                      className={`border-l-4 ${
                        alert.severity === "urgent" ? "border-l-destructive" :
                        alert.severity === "warning" ? "border-l-yellow-500" :
                        "border-l-blue-500"
                      }`}
                      data-testid={`card-alert-${alert.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="h-5 w-5 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-base">{alert.title}</CardTitle>
                                <Badge variant={severityVariant}>{alert.severity}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                          {alert.region && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.region}
                            </div>
                          )}
                          {alert.publishedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(alert.publishedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {Object.keys(iconMap).map(type => (
            <TabsContent key={type} value={type} className="mt-6">
              <div className="space-y-4">
                {groupedAlerts?.[type]?.map(alert => {
                  const Icon = iconMap[type as keyof typeof iconMap];
                  const severityVariant = severityColors[alert.severity as keyof typeof severityColors] || "secondary";

                  return (
                    <Card
                      key={alert.id}
                      className={`border-l-4 ${
                        alert.severity === "urgent" ? "border-l-destructive" :
                        alert.severity === "warning" ? "border-l-yellow-500" :
                        "border-l-blue-500"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-base">{alert.title}</CardTitle>
                              <Badge variant={severityVariant}>{alert.severity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                              {alert.region && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {alert.region}
                                </div>
                              )}
                              {alert.publishedAt && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(alert.publishedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                }) || <p className="text-center text-muted-foreground py-8">No alerts in this category</p>}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Alert>
          <Megaphone className="h-4 w-4" />
          <AlertDescription>
            Subscribe to email notifications to receive alerts directly to your inbox
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
