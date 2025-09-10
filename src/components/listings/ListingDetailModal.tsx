import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ListingContactInfo } from './ListingContactInfo';
import { Eye, MapPin, Bed, Wifi, Wind, Shirt, Utensils, IndianRupee, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

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

interface ListingDetailModalProps {
  listing: PgListing;
  trigger?: React.ReactNode;
}

export const ListingDetailModal = ({ listing, trigger }: ListingDetailModalProps) => {
  const { user, profile } = useAuth();
  const [contactInfo, setContactInfo] = useState<{
    owner_name?: string;
    owner_phone?: string;
    owner_email?: string;
    owner_address?: string;
  }>({});

  useEffect(() => {
    const fetchContactInfo = async () => {
      if (user && profile) {
        try {
          const { data, error } = await supabase.rpc('get_listing_contact_info', {
            listing_id: listing.id
          });
          
          if (error) {
            console.error('Error fetching contact info:', error);
            return;
          }
          
          if (data && data.length > 0) {
            setContactInfo({
              owner_name: data[0].owner_name,
              owner_phone: data[0].owner_phone,
              owner_email: data[0].owner_email,
              owner_address: data[0].owner_address
            });
          }
        } catch (error) {
          console.error('Error fetching contact info:', error);
        }
      }
    };

    fetchContactInfo();
  }, [listing.id, user, profile]);

  const getFoodTypeLabel = (foodType: string) => {
    switch (foodType) {
      case 'veg':
        return 'Vegetarian Only';
      case 'non_veg':
        return 'Non-Vegetarian';
      case 'both':
        return 'Both Veg & Non-Veg';
      default:
        return 'Not specified';
    }
  };

  const getMainImage = () => {
    if (!listing.pg_images || listing.pg_images.length === 0) {
      return '/placeholder.svg';
    }
    const sortedImages = listing.pg_images.sort((a, b) => a.image_order - b.image_order);
    return sortedImages[0].image_url;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold">{listing.title}</DialogTitle>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.city}, {listing.state}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={getMainImage()}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional Images */}
            {listing.pg_images && listing.pg_images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {listing.pg_images
                  .sort((a, b) => a.image_order - b.image_order)
                  .slice(1, 4)
                  .map((image, index) => (
                    <div key={index} className="aspect-video rounded overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={`${listing.title} - Image ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {listing.description || 'Comfortable accommodation with modern amenities in a great location.'}
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Address:</strong> {listing.address}</p>
                  <p><strong>City:</strong> {listing.city}, {listing.state}</p>
                  <p><strong>Pincode:</strong> {listing.pincode}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-2" />
                      <span>Number of Beds</span>
                    </div>
                    <Badge variant="outline">{listing.num_beds}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wind className="w-4 h-4 mr-2" />
                      <span>Air Conditioning</span>
                    </div>
                    <Badge variant={listing.has_ac ? "default" : "secondary"}>
                      {listing.has_ac ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 mr-2" />
                      <span>WiFi</span>
                    </div>
                    <Badge variant={listing.has_wifi ? "default" : "secondary"}>
                      {listing.has_wifi ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shirt className="w-4 h-4 mr-2" />
                      <span>Washing Machine</span>
                    </div>
                    <Badge variant={listing.has_washing_machine ? "default" : "secondary"}>
                      {listing.has_washing_machine ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="w-4 h-4 mr-2" />
                      <span>Food Type</span>
                    </div>
                    <Badge variant="outline">{getFoodTypeLabel(listing.food_type)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    ₹{listing.rent_per_month.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                
                {listing.security_deposit && (
                  <>
                    <Separator />
                    <div className="text-center">
                      <div className="text-xl font-semibold">
                        ₹{listing.security_deposit.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">security deposit</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <ListingContactInfo 
              contactInfo={contactInfo}
              listingTitle={listing.title}
            />

            {/* Listing Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Listing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Posted:</span>
                  <span className="ml-2">{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Property ID:</span>
                  <span className="ml-2 font-mono text-xs">{listing.id.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};