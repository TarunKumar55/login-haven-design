import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, Plus, Edit, Eye, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PgListingForm from '@/components/forms/PgListingForm';

interface PgListing {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  rent_per_month: number;
  created_at: string;
  pg_images: { image_url: string; image_order: number }[];
}

const PgOwnerDashboard = () => {
  const { profile, signOut } = useAuth();
  const [listings, setListings] = useState<PgListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<PgListing | null>(null);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('pg_listings')
        .select(`
          *,
          pg_images(image_url, image_order)
        `)
        .eq('owner_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data || []) as unknown as PgListing[]);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchListings();
    }
  }, [profile?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('pg_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setListings(listings.filter(listing => listing.id !== id));
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pg_listings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, is_active: !currentStatus } : listing
      ));

      toast({
        title: "Success",
        description: `Listing ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling listing status:', error);
      toast({
        title: "Error",
        description: "Failed to update listing status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingListing(null);
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">PG Owner Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name || profile?.email}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingListing ? 'Edit PG Listing' : 'Add New PG Listing'}
                  </DialogTitle>
                </DialogHeader>
                <PgListingForm 
                  listing={editingListing as any}
                  onSuccess={handleFormSuccess}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingListing(null);
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {listings.filter(l => l.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {listings.filter(l => l.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {listings.filter(l => l.is_active).length}
              </div>
            </CardContent>
          </Card>
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
              <Card key={listing.id} className="overflow-hidden">
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
                      <Upload className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge className={`${getStatusColor(listing.status)} text-white`}>
                      {listing.status}
                    </Badge>
                    <Badge variant={listing.is_active ? "secondary" : "outline"}>
                      {listing.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">₹{listing.rent_per_month}/month</Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <CardDescription>
                    {listing.address}, {listing.city}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {listing.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingListing(listing);
                        setShowForm(true);
                      }}
                      disabled={listing.status === 'approved'}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(listing.id, listing.is_active)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <Plus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first PG listing to start attracting tenants.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Listing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PgOwnerDashboard;