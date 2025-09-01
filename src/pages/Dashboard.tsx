import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserDashboard from '@/components/dashboards/UserDashboard';
import PgOwnerDashboard from '@/components/dashboards/PgOwnerDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();

  console.log('Dashboard component - Auth state:', { user: user?.id, profile: profile?.role, loading });

  if (loading) {
    console.log('Dashboard: Still loading auth state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    console.log('Dashboard: No user or profile, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Dashboard: Routing based on role:', profile.role);
  switch (profile.role) {
    case 'user':
      console.log('Dashboard: Redirecting user to /pg-listings');
      return <Navigate to="/pg-listings" replace />;
    case 'pg_owner':
      console.log('Dashboard: Showing PgOwnerDashboard');
      return <PgOwnerDashboard />;
    case 'admin':
      console.log('Dashboard: Showing AdminDashboard');
      return <AdminDashboard />;
    default:
      console.log('Dashboard: Unknown role, redirecting to home');
      return <Navigate to="/" replace />;
  }
};

export default Dashboard;