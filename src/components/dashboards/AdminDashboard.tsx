import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Check, X, Eye, Trash2, Users, Building, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  profiles: { full_name: string; email: string; phone: string } | null;
  pg_images: { image_url: string; image_order: number }[];
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'user' | 'pg_owner' | 'admin';
  created_at: string;
}

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [pendingListings, setPendingListings] = useState<PgListing[]>([]);
  const [allListings, setAllListings] = useState<PgListing[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchPendingListings = async () => {
    try {
      const { data, error } = await supabase
        .from('pg_listings')
        .select(`
          *,
          profiles(full_name, email, phone),
          pg_images(image_url, image_order)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingListings((data || []) as unknown as PgListing[]);
    } catch (error: any) {
      console.error('Error fetching pending listings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending listings",
        variant: "destructive",
      });
    }
  };

  const fetchAllListings = async () => {
    try {
      const { data, error } = await supabase
        .from('pg_listings')
        .select(`
          *,
          profiles(full_name, email, phone),
          pg_images(image_url, image_order)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllListings((data || []) as unknown as PgListing[]);
    } catch (error: any) {
      console.error('Error fetching all listings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingListings();
    fetchAllListings();
    fetchUsers();
  }, []);

  const handleApproveReject = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('pg_listings')
        .update({ 
          status, 
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: status === 'approved' ? profile?.id : null
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPendingListings(pendingListings.filter(listing => listing.id !== id));
      setAllListings(allListings.map(listing => 
        listing.id === id ? { ...listing, status } : listing
      ));

      toast({
        title: "Success",
        description: `Listing ${status} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating listing status:', error);
      toast({
        title: "Error",
        description: "Failed to update listing status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase
        .from('pg_listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllListings(allListings.filter(listing => listing.id !== id));
      setPendingListings(pendingListings.filter(listing => listing.id !== id));

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500';
      case 'pg_owner':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {profile?.full_name || profile?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingListings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Total Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allListings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                PG Owners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'pg_owner').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="listings">All Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingListings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Check className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">No listings pending approval.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      {listing.pg_images?.[0] ? (
                        <img
                          src={listing.pg_images[0].image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Building className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">₹{listing.rent_per_month}/month</Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <CardDescription>
                        {listing.address}, {listing.city}
                      </CardDescription>
                      {listing.profiles && (
                        <CardDescription className="text-sm">
                          Owner: {listing.profiles.full_name} ({listing.profiles.email})
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      {listing.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {listing.description}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveReject(listing.id, 'approved')}
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleApproveReject(listing.id, 'rejected')}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* All Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>
                      {listing.profiles?.full_name || 'Unknown'}
                    </TableCell>
                    <TableCell>{listing.city}, {listing.state}</TableCell>
                    <TableCell>₹{listing.rent_per_month}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(listing.status)} text-white`}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {listing.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReject(listing.id, 'approved')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveReject(listing.id, 'rejected')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteListing(listing.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Not provided'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'Not provided'}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleColor(user.role)} text-white`}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;