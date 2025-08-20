import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import heroInterior from "@/assets/hero-interior.jpg";

const AdminLogin = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroInterior})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-deep-charcoal/60 via-primary/40 to-accent/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-96px)]">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Platform
                <span className="block bg-gradient-to-r from-gold-accent to-accent bg-clip-text text-transparent">
                  Administration
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg mx-auto lg:mx-0">
                Oversee the entire platform, manage users, monitor operations, and ensure quality standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">Total</div>
                  <div className="text-white/80 text-sm">System Control</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">Real-time</div>
                  <div className="text-white/80 text-sm">Monitoring</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                  <div className="text-2xl font-bold text-white">Advanced</div>
                  <div className="text-white/80 text-sm">Reports</div>
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 text-red-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Authorized personnel only. All activities are logged and monitored.
                </div>
              </div>
            </div>
            
            {/* Login Form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm
                title="Admin Login"
                description="Secure access to administrative dashboard"
                userType="admin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;