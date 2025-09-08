import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, MapPin, User, Phone, Mail, Home, Bed, Wifi, Wind, Shirt, Utensils, IndianRupee, Calendar, Check, X } from 'lucide-react';

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
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  owner_address?: string;
  profiles: { full_name: string; email: string; phone: string } | null;
  pg_images: { image_url: string; image_order: number }[];
}

interface PgListingDetailModalProps {
  listing: PgListing;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

export const PgListingDetailModal = ({ 
  listing, 
  onApprove, 
  onReject, 
  showActions = false 
}: PgListingDetailModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  const getFoodTypeLabel = (foodType: string) => {
    switch (foodType) {
      case 'veg':
        return 'Vegetarian';
      case 'non_veg':
        return 'Non-Vegetarian';
      case 'both':
        return 'Both Veg & Non-Veg';
      default:
        return 'Not specified';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{listing.title}</span>
            <Badge className={getStatusColor(listing.status)}>
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {listing.pg_images && listing.pg_images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.pg_images
                    .sort((a, b) => a.image_order - b.image_order)
                    .map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{listing.description || 'No description provided'}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.address}, {listing.city}, {listing.state} - {listing.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Number of Beds</p>
                    <p className="text-sm text-muted-foreground">{listing.num_beds}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <Badge variant="outline">
                    {getFoodTypeLabel(listing.food_type || '')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="text-2xl font-bold">₹{listing.rent_per_month.toLocaleString()}</p>
                </div>
                {listing.security_deposit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                    <p className="text-xl font-semibold">₹{listing.security_deposit.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground">
                    {listing.owner_name || listing.profiles?.full_name || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {listing.owner_email || listing.profiles?.email || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {listing.owner_phone || listing.profiles?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                {listing.owner_address && (
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{listing.owner_address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Listing Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(listing.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(listing.updated_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {showActions && listing.status === 'pending' && (
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => onApprove?.(listing.id)}
                className="flex-1"
                size="lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Listing
              </Button>
              <Button
                variant="destructive"
                onClick={() => onReject?.(listing.id)}
                className="flex-1"
                size="lg"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Listing
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};