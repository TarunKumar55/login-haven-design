import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Wifi, Car, Utensils, AirVent, WashingMachine, Filter, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { ListingDetailModal } from '@/components/listings/ListingDetailModal';

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
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  owner_address?: string;
  pg_images: { image_url: string; image_order: number }[];
}

const PgListings = () => {
  const { user, profile, loading } = useAuth();
  const [listings, setListings] = useState<PgListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PgListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [foodType, setFoodType] = useState('any');
  const [hasAc, setHasAc] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasWashingMachine, setHasWashingMachine] = useState(false);
  const [budgetRange, setBudgetRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('pg_listings')
        .select(`
          *,
          pg_images (
            image_url,
            image_order
          )
        `)
        .eq('status', 'approved')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setListings(data || []);
      setFilteredListings(data || []);
      
      // Extract unique cities for filter dropdown
      const uniqueCities = [...new Set(data?.map(listing => listing.city) || [])];
      setCities(uniqueCities);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load PG listings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCity, foodType, hasAc, hasWifi, hasWashingMachine, budgetRange, listings]);

  const applyFilters = () => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // City filter
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(listing => listing.city === selectedCity);
    }

    // Food type filter
    if (foodType && foodType !== 'any') {
      filtered = filtered.filter(listing => listing.food_type === foodType);
    }

    // Amenities filters
    if (hasAc) {
      filtered = filtered.filter(listing => listing.has_ac);
    }
    if (hasWifi) {
      filtered = filtered.filter(listing => listing.has_wifi);
    }
    if (hasWashingMachine) {
      filtered = filtered.filter(listing => listing.has_washing_machine);
    }

    // Budget filter
    filtered = filtered.filter(listing =>
      listing.rent_per_month >= budgetRange[0] && listing.rent_per_month <= budgetRange[1]
    );

    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setFoodType('any');
    setHasAc(false);
    setHasWifi(false);
    setHasWashingMachine(false);
    setBudgetRange([0, 50000]);
  };

  const getMainImage = (images: { image_url: string; image_order: number }[]) => {
    if (!images || images.length === 0) return '/placeholder.svg';
    const sortedImages = images.sort((a, b) => a.image_order - b.image_order);
    return sortedImages[0].image_url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading PG listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect PG</h1>
          <p className="text-muted-foreground text-lg">Discover comfortable and affordable accommodations</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location, title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(hasAc || hasWifi || hasWashingMachine || foodType) && (
                  <Badge variant="secondary" className="ml-2">
                    {[hasAc, hasWifi, hasWashingMachine, foodType].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 p-4 border-t space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Food Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Food Type</label>
                    <Select value={foodType} onValueChange={setFoodType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Range */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Budget Range: ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
                    </label>
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      max={50000}
                      min={0}
                      step={1000}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Amenities</label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ac"
                        checked={hasAc}
                        onCheckedChange={(checked) => setHasAc(!!checked)}
                      />
                      <label htmlFor="ac" className="text-sm flex items-center">
                        <AirVent className="w-4 h-4 mr-1" />
                        Air Conditioning
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wifi"
                        checked={hasWifi}
                        onCheckedChange={(checked) => setHasWifi(!!checked)}
                      />
                      <label htmlFor="wifi" className="text-sm flex items-center">
                        <Wifi className="w-4 h-4 mr-1" />
                        WiFi
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="washing_machine"
                        checked={hasWashingMachine}
                        onCheckedChange={(checked) => setHasWashingMachine(!!checked)}
                      />
                      <label htmlFor="washing_machine" className="text-sm flex items-center">
                        <WashingMachine className="w-4 h-4 mr-1" />
                        Washing Machine
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredListings.length} of {listings.length} PG accommodations
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No PGs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={getMainImage(listing.pg_images)}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.food_type && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {listing.food_type === 'veg' ? 'Veg' : 
                       listing.food_type === 'non_veg' ? 'Non-Veg' : 'Both'}
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-2">{listing.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.city}, {listing.state}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description || 'Comfortable accommodation with modern amenities'}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{listing.num_beds} Beds</Badge>
                      {listing.has_ac && <AirVent className="w-4 h-4 text-blue-500" />}
                      {listing.has_wifi && <Wifi className="w-4 h-4 text-green-500" />}
                      {listing.has_washing_machine && <WashingMachine className="w-4 h-4 text-purple-500" />}
                      {listing.food_type && <Utensils className="w-4 h-4 text-orange-500" />}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          ₹{listing.rent_per_month.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                      <ListingDetailModal 
                        listing={listing}
                        trigger={<Button>View Details</Button>}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PgListings;