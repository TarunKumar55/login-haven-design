import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import heroInterior from "@/assets/hero-interior.jpg";

const PgOwnerLogin = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroInterior})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-gold-accent/20 to-primary/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-96px)]">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Manage Your
                <span className="block bg-gradient-to-r from-gold-accent to-accent bg-clip-text text-transparent">
                  PG Business
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg mx-auto lg:mx-0">
                Streamline your PG operations, manage tenants, and grow your business with our comprehensive platform.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">99%</div>
                  <div className="text-white/80 text-sm">Occupancy Rate</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-white/80 text-sm">Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">Smart</div>
                  <div className="text-white/80 text-sm">Analytics</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">Easy</div>
                  <div className="text-white/80 text-sm">Management</div>
                </div>
              </div>
            </div>
            
            {/* Login Form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm
                title="PG Owner Login"
                description="Access your property management dashboard"
                userType="pg-owner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgOwnerLogin;