import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, User, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ContactInfo {
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  owner_address?: string;
  profiles?: {
    full_name?: string;
    email?: string;
    phone?: string;
  };
}

interface ListingContactInfoProps {
  contactInfo: ContactInfo;
  listingTitle: string;
}

export const ListingContactInfo = ({ contactInfo, listingTitle }: ListingContactInfoProps) => {
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);

  // Don't show contact section if user is not authenticated
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground mb-4">
            <User className="w-8 h-8 mx-auto mb-2" />
            <p>Sign in to view owner contact information</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/user-login'}>
            Sign In to Contact Owner
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ownerName = contactInfo.owner_name || contactInfo.profiles?.full_name || 'Property Owner';
  const ownerPhone = contactInfo.owner_phone || contactInfo.profiles?.phone;
  const ownerEmail = contactInfo.owner_email || contactInfo.profiles?.email;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Contact Owner
          </span>
          <Badge variant="secondary">Verified</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{ownerName}</span>
          </div>
        </div>

        {!showContact ? (
          <div className="text-center py-4">
            <Button 
              onClick={() => setShowContact(true)}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show Contact Information
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Contact details are only shown to registered users
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Contact Information</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowContact(false)}
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
            
            {ownerPhone && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-mono">{ownerPhone}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`tel:${ownerPhone}`)}
                >
                  Call
                </Button>
              </div>
            )}

            {ownerEmail && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-mono text-sm">{ownerEmail}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`mailto:${ownerEmail}?subject=Inquiry about ${listingTitle}`)}
                >
                  Email
                </Button>
              </div>
            )}

            {contactInfo.owner_address && (
              <div className="flex items-start p-3 bg-muted rounded-lg">
                <MapPin className="w-4 h-4 mr-2 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Owner Address</p>
                  <p className="text-sm">{contactInfo.owner_address}</p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p>⚠️ Please verify property details in person before making any payments</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};