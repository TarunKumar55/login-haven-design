import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import PgListingForm from '@/components/forms/PgListingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Plus } from 'lucide-react';

const PgOwnerForm = () => {
  const { user, profile, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  if (profile.role !== 'pg_owner') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome, PG Owner!</h1>
            <p className="text-muted-foreground text-lg">List your property and start attracting tenants</p>
          </div>

          {!showForm ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Getting Started Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowForm(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Your First PG Listing
                  </CardTitle>
                  <CardDescription>
                    Create a detailed listing for your PG property with photos, amenities, and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Add property details and photos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Set pricing and amenities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Submit for admin approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Start receiving inquiries</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-accent" />
                    Why List With Us?
                  </CardTitle>
                  <CardDescription>
                    Grow your business with our platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Reach thousands of potential tenants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Professional listing management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Quality verification for trust</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Free listing and easy management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create Your PG Listing</CardTitle>
                <CardDescription>
                  Fill in the details below to create your first PG listing. All listings are reviewed by our team before going live.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PgListingForm 
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowForm(false)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PgOwnerForm;