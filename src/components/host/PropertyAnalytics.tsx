import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, Heart, DollarSign, Calendar, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, parseISO, differenceInDays } from 'date-fns';

interface PropertyStats {
  totalViews: number;
  uniqueViews: number;
  wishlisted: number;
  totalRevenue: number;
  totalBookings: number;
  averageStay: number;
  conversionRate: number;
  viewsOverTime: { date: string; views: number }[];
  bookingsByMonth: { month: string; bookings: number; revenue: number }[];
  peakPeriod: string;
}

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(var(--primary))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const PropertyAnalytics: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [stats, setStats] = useState<PropertyStats>({
    totalViews: 0,
    uniqueViews: 0,
    wishlisted: 0,
    totalRevenue: 0,
    totalBookings: 0,
    averageStay: 0,
    conversionRate: 0,
    viewsOverTime: [],
    bookingsByMonth: [],
    peakPeriod: 'N/A',
  });

  useEffect(() => {
    if (propertyId && user) {
      fetchAnalytics();
    }
  }, [propertyId, user]);

  const fetchAnalytics = async () => {
    if (!propertyId || !user) return;
    
    setLoading(true);
    try {
      // Fetch property to verify ownership and get title
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('title, host_id')
        .eq('id', propertyId)
        .single();

      if (propertyError || !property) {
        toast({
          title: "Error",
          description: "Property not found",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      if (property.host_id !== user.id) {
        toast({
          title: "Access denied",
          description: "You don't have access to this property's analytics",
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      setPropertyTitle(property.title);

      // Fetch views
      const { data: views, error: viewsError } = await supabase
        .from('property_views')
        .select('*')
        .eq('property_id', propertyId);

      // Fetch wishlisted count
      const { count: wishlistCount, error: wishlistError } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId);

      if (viewsError || wishlistError || bookingsError) {
        console.error('Error fetching analytics:', { viewsError, wishlistError, bookingsError });
      }

      const viewsData = views || [];
      const bookingsData = bookings || [];

      // Calculate total views
      const totalViews = viewsData.length;

      // Calculate unique views (by session_id)
      const uniqueSessions = new Set(viewsData.map(v => v.session_id).filter(Boolean));
      const uniqueViews = uniqueSessions.size || totalViews;

      // Calculate total revenue and bookings
      const confirmedBookings = bookingsData.filter(b => 
        b.status === 'confirmed' || b.status === 'completed'
      );
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const totalBookings = confirmedBookings.length;

      // Calculate average stay
      let averageStay = 0;
      if (confirmedBookings.length > 0) {
        const totalNights = confirmedBookings.reduce((sum, b) => {
          const checkIn = parseISO(b.check_in_date);
          const checkOut = parseISO(b.check_out_date);
          return sum + differenceInDays(checkOut, checkIn);
        }, 0);
        averageStay = Math.round(totalNights / confirmedBookings.length * 10) / 10;
      }

      // Calculate conversion rate
      const conversionRate = totalViews > 0 
        ? Math.round((totalBookings / totalViews) * 100 * 10) / 10 
        : 0;

      // Views over time (last 30 days)
      const last30Days: { date: string; views: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayViews = viewsData.filter(v => 
          format(parseISO(v.viewed_at), 'yyyy-MM-dd') === dateStr
        ).length;
        last30Days.push({ date: format(date, 'MMM dd'), views: dayViews });
      }

      // Bookings by month (last 6 months)
      const bookingsByMonth: { month: string; bookings: number; revenue: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const monthBookings = confirmedBookings.filter(b => {
          const bookingDate = parseISO(b.created_at);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        });
        bookingsByMonth.push({
          month: format(monthDate, 'MMM'),
          bookings: monthBookings.length,
          revenue: monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
        });
      }

      // Find peak booking period
      const monthCounts: Record<string, number> = {};
      confirmedBookings.forEach(b => {
        const month = format(parseISO(b.check_in_date), 'MMMM');
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      const peakMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
      const peakPeriod = peakMonth ? peakMonth[0] : 'N/A';

      setStats({
        totalViews,
        uniqueViews,
        wishlisted: wishlistCount || 0,
        totalRevenue,
        totalBookings,
        averageStay,
        conversionRate,
        viewsOverTime: last30Days,
        bookingsByMonth,
        peakPeriod,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Analytics</h1>
          <p className="text-muted-foreground">{propertyTitle}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                {stats.uniqueViews} unique visitors
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wishlisted</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wishlisted}</div>
              <p className="text-xs text-muted-foreground">
                People saved this property
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} TND</div>
              <p className="text-xs text-muted-foreground">
                From {stats.totalBookings} bookings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Views to bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Stay</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageStay} nights</div>
              <p className="text-xs text-muted-foreground">
                Per booking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Peak Period</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.peakPeriod}</div>
              <p className="text-xs text-muted-foreground">
                Most popular booking month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                Confirmed reservations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="views" className="space-y-4">
          <TabsList>
            <TabsTrigger value="views">Views (Last 30 Days)</TabsTrigger>
            <TabsTrigger value="bookings">Bookings & Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="views">
            <Card>
              <CardHeader>
                <CardTitle>Property Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={stats.viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="var(--color-views)" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings & Revenue (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={stats.bookingsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      yAxisId="left"
                      dataKey="bookings" 
                      fill="var(--color-bookings)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="revenue" 
                      fill="var(--color-revenue)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyAnalytics;
