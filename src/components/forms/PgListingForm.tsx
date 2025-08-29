import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, Loader2 } from 'lucide-react';
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
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  pg_images: { image_url: string; image_order: number }[];
}

interface PgListingFormProps {
  listing?: PgListing | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PgListingForm: React.FC<PgListingFormProps> = ({ listing, onSuccess, onCancel }) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    listing?.pg_images?.map(img => img.image_url) || []
  );
  
  const [formData, setFormData] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    address: listing?.address || '',
    city: listing?.city || '',
    state: listing?.state || '',
    pincode: listing?.pincode || '',
    num_beds: listing?.num_beds || 1,
    has_ac: listing?.has_ac || false,
    has_wifi: listing?.has_wifi || false,
    has_washing_machine: listing?.has_washing_machine || false,
    food_type: listing?.food_type || '',
    rent_per_month: listing?.rent_per_month || 0,
    security_deposit: listing?.security_deposit || 0,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Limit to 10 images total
    const totalImages = images.length + imagePreviews.length + files.length;
    if (totalImages > 10) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 10 images per listing",
        variant: "destructive",
      });
      return;
    }

    // Add new files to images array
    setImages([...images, ...files]);

    // Create previews for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < (listing?.pg_images?.length || 0);
    
    if (isExistingImage) {
      // Remove from previews only (existing images)
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from both images and previews (new images)
      const newImageIndex = index - (listing?.pg_images?.length || 0);
      setImages(prev => prev.filter((_, i) => i !== newImageIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImages = async (listingId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop() || 'jpg';
      // Use UUID-based filename for security
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`Image ${file.name} is too large. Maximum size is 10MB.`);
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`File ${file.name} is not a valid image.`);
      }

      const { data, error } = await supabase.storage
        .from('pg-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('pg-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        throw new Error('Please fill in all required fields');
      }

      if (!listing) {
        // Create new listing
        const { data: newListing, error: listingError } = await supabase
          .from('pg_listings')
          .insert({
            ...formData,
            owner_id: profile?.id,
          })
          .select()
          .single();

        if (listingError) throw listingError;

        // Upload images if any
        if (images.length > 0) {
          const imageUrls = await uploadImages(newListing.id);
          
          // Save image records
          const imageRecords = imageUrls.map((url, index) => ({
            pg_listing_id: newListing.id,
            image_url: url,
            image_order: index + 1,
          }));

          const { error: imageError } = await supabase
            .from('pg_images')
            .insert(imageRecords);

          if (imageError) throw imageError;
        }

        toast({
          title: "Success",
          description: "PG listing created and sent for approval",
        });
      } else {
        // Update existing listing
        const { error: updateError } = await supabase
          .from('pg_listings')
          .update(formData)
          .eq('id', listing.id);

        if (updateError) throw updateError;

        // Handle image updates if needed
        if (images.length > 0) {
          const imageUrls = await uploadImages(listing.id);
          
          const imageRecords = imageUrls.map((url, index) => ({
            pg_listing_id: listing.id,
            image_url: url,
            image_order: (listing.pg_images?.length || 0) + index + 1,
          }));

          const { error: imageError } = await supabase
            .from('pg_images')
            .insert(imageRecords);

          if (imageError) throw imageError;
        }

        toast({
          title: "Success",
          description: "PG listing updated successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving listing:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Provide basic details about your PG</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Comfortable PG for Working Professionals"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your PG, amenities, rules, etc."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>Where is your PG located?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Full Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Complete address with landmarks"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                required
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="Pincode"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Details</CardTitle>
          <CardDescription>What amenities do you provide?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="num_beds">Number of Beds *</Label>
            <Input
              id="num_beds"
              type="number"
              min="1"
              value={formData.num_beds}
              onChange={(e) => setFormData({ ...formData, num_beds: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_ac"
                checked={formData.has_ac}
                onCheckedChange={(checked) => setFormData({ ...formData, has_ac: !!checked })}
              />
              <Label htmlFor="has_ac">Air Conditioning</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_wifi"
                checked={formData.has_wifi}
                onCheckedChange={(checked) => setFormData({ ...formData, has_wifi: !!checked })}
              />
              <Label htmlFor="has_wifi">WiFi</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_washing_machine"
                checked={formData.has_washing_machine}
                onCheckedChange={(checked) => setFormData({ ...formData, has_washing_machine: !!checked })}
              />
              <Label htmlFor="has_washing_machine">Washing Machine</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="food_type">Food Type</Label>
            <Select value={formData.food_type} onValueChange={(value) => setFormData({ ...formData, food_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select food type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not provided</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Set your rental rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rent_per_month">Monthly Rent (₹) *</Label>
              <Input
                id="rent_per_month"
                type="number"
                min="0"
                value={formData.rent_per_month}
                onChange={(e) => setFormData({ ...formData, rent_per_month: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="security_deposit">Security Deposit (₹)</Label>
              <Input
                id="security_deposit"
                type="number"
                min="0"
                value={formData.security_deposit}
                onChange={(e) => setFormData({ ...formData, security_deposit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Upload up to 10 images of your PG (Max 10MB per image)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File input */}
            <div>
              <Label htmlFor="images">Upload Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={imagePreviews.length >= 10}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {imagePreviews.length}/10 images uploaded
              </p>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {listing ? 'Update Listing' : 'Create Listing'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PgListingForm;