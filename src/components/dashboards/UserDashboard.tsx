import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Search, Filter, MapPin, Bed, Wifi, WashingMachine, Car, Utensils } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PgListing {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  num_beds: number;
  has_ac: boolean;
  has_wifi: boolean;
  has_washing_machine: boolean;
  food_type: string;
  rent_per_month: number;
  security_deposit: number;
  created_at: string;
  pg_images: { image_url: string; image_order: number }[];
  profiles: { full_name: string; phone: string } | null;
}

const UserDashboard = () => {
  const { profile, signOut } = useAuth();
  const [listings, setListings] = useState<PgListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    minBeds: '',
    maxRent: '',
    hasAc: '',
    hasWifi: '',
    hasWashingMachine: '',
    foodType: ''
  });

  const fetchListings = async () => {
    try {
      let query = supabase
        .from('pg_listings')
        .select(`
          *,
          pg_images(image_url, image_order),
          profiles(full_name, phone)
        `)
        .eq('status', 'approved')
        .eq('is_active', true);

      // Apply filters
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.minBeds) {
        query = query.gte('num_beds', parseInt(filters.minBeds));
      }
      if (filters.maxRent) {
        query = query.lte('rent_per_month', parseInt(filters.maxRent));
      }
      if (filters.hasAc) {
        query = query.eq('has_ac', filters.hasAc === 'true');
      }
      if (filters.hasWifi) {
        query = query.eq('has_wifi', filters.hasWifi === 'true');
      }
      if (filters.hasWashingMachine) {
        query = query.eq('has_washing_machine', filters.hasWashingMachine === 'true');
      }
      if (filters.foodType) {
        query = query.eq('food_type', filters.foodType);
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data || []) as unknown as PgListing[]);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch PG listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters, searchTerm]);

  const resetFilters = () => {
    setFilters({
      city: '',
      minBeds: '',
      maxRent: '',
      hasAc: '',
      hasWifi: '',
      hasWashingMachine: '',
      foodType: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">PG Pathfinder</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name || profile?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, address, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={resetFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Input
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Min Beds"
              value={filters.minBeds}
              onChange={(e) => setFilters({ ...filters, minBeds: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Max Rent"
              value={filters.maxRent}
              onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
            />
            <Select value={filters.hasAc} onValueChange={(value) => setFilters({ ...filters, hasAc: value })}>
              <SelectTrigger>
                <SelectValue placeholder="AC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="true">AC</SelectItem>
                <SelectItem value="false">Non-AC</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.hasWifi} onValueChange={(value) => setFilters({ ...filters, hasWifi: value })}>
              <SelectTrigger>
                <SelectValue placeholder="WiFi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="true">WiFi</SelectItem>
                <SelectItem value="false">No WiFi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.hasWashingMachine} onValueChange={(value) => setFilters({ ...filters, hasWashingMachine: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Washing Machine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="true">Available</SelectItem>
                <SelectItem value="false">Not Available</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.foodType} onValueChange={(value) => setFilters({ ...filters, foodType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Food Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="veg">Veg</SelectItem>
                <SelectItem value="non_veg">Non-Veg</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-elegant transition-shadow">
                {/* Image */}
                <div className="h-48 bg-muted relative overflow-hidden">
                  {listing.pg_images?.[0] ? (
                    <img
                      src={listing.pg_images[0].image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">₹{listing.rent_per_month}/month</Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.address}, {listing.city}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      <Bed className="w-3 h-3 mr-1" />
                      {listing.num_beds} beds
                    </Badge>
                    {listing.has_ac && (
                      <Badge variant="outline" className="text-xs">
                        <Car className="w-3 h-3 mr-1" />
                        AC
                      </Badge>
                    )}
                    {listing.has_wifi && (
                      <Badge variant="outline" className="text-xs">
                        <Wifi className="w-3 h-3 mr-1" />
                        WiFi
                      </Badge>
                    )}
                    {listing.has_washing_machine && (
                      <Badge variant="outline" className="text-xs">
                        <WashingMachine className="w-3 h-3 mr-1" />
                        Washing Machine
                      </Badge>
                    )}
                    {listing.food_type && (
                      <Badge variant="outline" className="text-xs">
                        <Utensils className="w-3 h-3 mr-1" />
                        {listing.food_type === 'veg' ? 'Veg' : listing.food_type === 'non_veg' ? 'Non-Veg' : 'Both'}
                      </Badge>
                    )}
                  </div>

                  {listing.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {listing.profiles?.full_name && (
                        <p>Contact: {listing.profiles.full_name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {listing.security_deposit && (
                        <p className="text-xs text-muted-foreground">
                          Deposit: ₹{listing.security_deposit}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No PG listings found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;