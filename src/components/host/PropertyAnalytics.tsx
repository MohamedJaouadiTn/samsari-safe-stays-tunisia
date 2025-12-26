import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, Heart, DollarSign, Calendar, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { format, subDays, subMonths, subYears, startOfMonth, endOfMonth, parseISO, differenceInDays } from 'date-fns';

type TimeRange = '7d' | '30d' | '1y' | '5y';

interface PropertyStats {
  totalViews: number;
  uniqueViews: number;
  wishlisted: number;
  totalRevenue: number;
  totalBookings: number;
  averageStay: number;
  conversionRate: number;
  viewsOverTime: { date: string; views: number }[];
  bookingsByPeriod: { period: string; bookings: number; revenue: number }[];
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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [stats, setStats] = useState<PropertyStats>({
    totalViews: 0,
    uniqueViews: 0,
    wishlisted: 0,
    totalRevenue: 0,
    totalBookings: 0,
    averageStay: 0,
    conversionRate: 0,
    viewsOverTime: [],
    bookingsByPeriod: [],
    peakPeriod: 'N/A',
  });

  const getStartDate = (range: TimeRange): Date => {
    const now = new Date();
    switch (range) {
      case '7d':
        return subDays(now, 7);
      case '30d':
        return subDays(now, 30);
      case '1y':
        return subYears(now, 1);
      case '5y':
        return subYears(now, 5);
      default:
        return subDays(now, 30);
    }
  };

  const getTimeRangeLabel = (range: TimeRange): string => {
    switch (range) {
      case '7d':
        return t('analytics.last_7_days');
      case '30d':
        return t('analytics.last_30_days');
      case '1y':
        return t('analytics.last_year');
      case '5y':
        return t('analytics.last_5_years');
      default:
        return t('analytics.last_30_days');
    }
  };

  useEffect(() => {
    if (propertyId && user) {
      fetchAnalytics();
    }
  }, [propertyId, user, timeRange]);

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
          title: t('common.error'),
          description: t('analytics.property_not_found'),
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      if (property.host_id !== user.id) {
        toast({
          title: t('analytics.access_denied'),
          description: t('analytics.no_access'),
          variant: "destructive"
        });
        navigate('/profile');
        return;
      }

      setPropertyTitle(property.title);

      const startDate = getStartDate(timeRange);

      // Fetch views within time range
      const { data: views, error: viewsError } = await supabase
        .from('property_views')
        .select('*')
        .eq('property_id', propertyId)
        .gte('viewed_at', startDate.toISOString());

      // Fetch wishlisted count (all time)
      const { count: wishlistCount, error: wishlistError } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      // Fetch bookings within time range
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId)
        .gte('created_at', startDate.toISOString());

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

      // Generate views and bookings over time based on time range
      const viewsOverTime: { date: string; views: number }[] = [];
      const bookingsByPeriod: { period: string; bookings: number; revenue: number }[] = [];

      if (timeRange === '7d' || timeRange === '30d') {
        // Daily data
        const days = timeRange === '7d' ? 7 : 30;
        for (let i = days - 1; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayViews = viewsData.filter(v => 
            format(parseISO(v.viewed_at), 'yyyy-MM-dd') === dateStr
          ).length;
          viewsOverTime.push({ date: format(date, 'MMM dd'), views: dayViews });

          const dayBookings = confirmedBookings.filter(b => 
            format(parseISO(b.created_at), 'yyyy-MM-dd') === dateStr
          );
          bookingsByPeriod.push({
            period: format(date, 'MMM dd'),
            bookings: dayBookings.length,
            revenue: dayBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
          });
        }
      } else if (timeRange === '1y') {
        // Monthly data for 1 year
        for (let i = 11; i >= 0; i--) {
          const monthDate = subMonths(new Date(), i);
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          
          const monthViews = viewsData.filter(v => {
            const viewDate = parseISO(v.viewed_at);
            return viewDate >= monthStart && viewDate <= monthEnd;
          }).length;
          viewsOverTime.push({ date: format(monthDate, 'MMM yyyy'), views: monthViews });

          const monthBookings = confirmedBookings.filter(b => {
            const bookingDate = parseISO(b.created_at);
            return bookingDate >= monthStart && bookingDate <= monthEnd;
          });
          bookingsByPeriod.push({
            period: format(monthDate, 'MMM yyyy'),
            bookings: monthBookings.length,
            revenue: monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
          });
        }
      } else if (timeRange === '5y') {
        // Yearly data for 5 years
        for (let i = 4; i >= 0; i--) {
          const yearDate = subYears(new Date(), i);
          const yearStart = new Date(yearDate.getFullYear(), 0, 1);
          const yearEnd = new Date(yearDate.getFullYear(), 11, 31, 23, 59, 59);
          
          const yearViews = viewsData.filter(v => {
            const viewDate = parseISO(v.viewed_at);
            return viewDate >= yearStart && viewDate <= yearEnd;
          }).length;
          viewsOverTime.push({ date: format(yearDate, 'yyyy'), views: yearViews });

          const yearBookings = confirmedBookings.filter(b => {
            const bookingDate = parseISO(b.created_at);
            return bookingDate >= yearStart && bookingDate <= yearEnd;
          });
          bookingsByPeriod.push({
            period: format(yearDate, 'yyyy'),
            bookings: yearBookings.length,
            revenue: yearBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
          });
        }
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
        viewsOverTime,
        bookingsByPeriod,
        peakPeriod,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: t('common.error'),
        description: t('analytics.load_error'),
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile?tab=properties')}
            className="mb-4 md:mb-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('analytics.back_to_properties')}
          </Button>
          
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('analytics.select_period')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t('analytics.last_7_days')}</SelectItem>
              <SelectItem value="30d">{t('analytics.last_30_days')}</SelectItem>
              <SelectItem value="1y">{t('analytics.last_year')}</SelectItem>
              <SelectItem value="5y">{t('analytics.last_5_years')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('analytics.title')}</h1>
          <p className="text-muted-foreground">{propertyTitle}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.total_views')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                {stats.uniqueViews} {t('analytics.unique_visitors')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.wishlisted')}</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.wishlisted}</div>
              <p className="text-xs text-muted-foreground">
                {t('analytics.people_saved')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.total_revenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} TND</div>
              <p className="text-xs text-muted-foreground">
                {t('analytics.from_bookings').replace('{count}', stats.totalBookings.toString())}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.conversion_rate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {t('analytics.views_to_bookings')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.average_stay')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageStay} {t('analytics.nights')}</div>
              <p className="text-xs text-muted-foreground">
                {t('analytics.per_booking')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.peak_period')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.peakPeriod}</div>
              <p className="text-xs text-muted-foreground">
                {t('analytics.most_popular_month')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('analytics.total_bookings')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {t('analytics.confirmed_reservations')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.views_over_time')} ({getTimeRangeLabel(timeRange)})</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.bookings_revenue')} ({getTimeRangeLabel(timeRange)})</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={stats.bookingsByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="period" 
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
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;