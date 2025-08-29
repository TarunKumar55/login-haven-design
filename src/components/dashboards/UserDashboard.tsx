import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, MapPin, Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {profile?.full_name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Find your perfect PG accommodation</p>
          </div>
          <Button onClick={signOut} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/pg-listings')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                Browse PGs
              </CardTitle>
              <CardDescription>
                Find available PG accommodations in your preferred location
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Saved PGs
              </CardTitle>
              <CardDescription>
                View your favorite and saved PG listings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                My Profile
              </CardTitle>
              <CardDescription>
                Update your profile and preferences
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest searches and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start browsing PGs to see your activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;