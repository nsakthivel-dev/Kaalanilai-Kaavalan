import { useQuery } from "@tanstack/react-query";
import { Download, TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Diagnosis } from "@shared/schema";

export default function Dashboard() {
  const { data: diagnoses, isLoading } = useQuery<Diagnosis[]>({
    queryKey: ["/api/diagnoses"],
  });

  const cropHealthScore = 78;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Your Dashboard</h1>
            <p className="text-muted-foreground">Track your crop health and diagnosis history</p>
          </div>
          <Button variant="outline" data-testid="button-download-report">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-health-score">
            <CardHeader>
              <CardTitle className="text-base">Crop Health Score</CardTitle>
              <CardDescription>Overall health this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${cropHealthScore * 2.51}, 251`}
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{cropHealthScore}</span>
                    <span className="text-xs text-muted-foreground">Good</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-total-diagnoses">
            <CardHeader>
              <CardTitle className="text-base">Total Diagnoses</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{diagnoses?.length || 0}</div>
              <p className="text-sm text-muted-foreground mt-2">
                <TrendingUp className="inline h-4 w-4 mr-1 text-primary" />
                3 this week
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-active-alerts">
            <CardHeader>
              <CardTitle className="text-base">Active Alerts</CardTitle>
              <CardDescription>Requires attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">2</div>
              <p className="text-sm text-muted-foreground mt-2">
                <AlertTriangle className="inline h-4 w-4 mr-1 text-destructive" />
                1 high priority
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-recent-diagnoses">
            <CardHeader>
              <CardTitle>Recent Diagnoses</CardTitle>
              <CardDescription>Your latest crop scans</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : diagnoses && diagnoses.length > 0 ? (
                <div className="space-y-4">
                  {diagnoses.slice(0, 5).map(diagnosis => (
                    <div key={diagnosis.id} className="flex items-center gap-4 p-3 rounded-lg border hover-elevate" data-testid={`diagnosis-item-${diagnosis.id}`}>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">Crop Diagnosis</p>
                        <p className="text-sm text-muted-foreground">
                          {diagnosis.createdAt ? new Date(diagnosis.createdAt).toLocaleDateString() : "Recent"}
                        </p>
                      </div>
                      <Badge variant="secondary">View</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No diagnoses yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Start by uploading a crop photo</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-regional-alerts">
            <CardHeader>
              <CardTitle>Regional Disease Watchlist</CardTitle>
              <CardDescription>Active in your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-l-destructive pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">Fall Armyworm</h4>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Affecting maize crops in your region</p>
              </div>

              <div className="border-l-4 border-l-yellow-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">Late Blight Risk</h4>
                  <Badge className="bg-yellow-500">Warning</Badge>
                </div>
                <p className="text-sm text-muted-foreground">High humidity increases risk for tomatoes</p>
              </div>

              <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">Crop Insurance Update</h4>
                  <Badge variant="secondary">Info</Badge>
                </div>
                <p className="text-sm text-muted-foreground">New government scheme available</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-field-tracking">
          <CardHeader>
            <CardTitle>Field Tracking</CardTitle>
            <CardDescription>Monitor multiple fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">North Field - Tomatoes</h4>
                  <p className="text-sm text-muted-foreground">2.5 acres</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Health Score: 82</p>
                  <Progress value={82} className="w-24 mt-2" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">South Field - Maize</h4>
                  <p className="text-sm text-muted-foreground">3.0 acres</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Health Score: 74</p>
                  <Progress value={74} className="w-24 mt-2" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">East Field - Wheat</h4>
                  <p className="text-sm text-muted-foreground">1.8 acres</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Health Score: 88</p>
                  <Progress value={88} className="w-24 mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
