import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import heroInterior from "@/assets/hero-interior.jpg";




const UserLogin = () => {
  
  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroInterior})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-accent/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-96px)]">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Welcome to Your
                <span className="block bg-gradient-to-r from-gold-accent to-accent bg-clip-text text-transparent">
                  Dream Home
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg mx-auto lg:mx-0">
                Discover beautiful interior designs and find the perfect PG accommodation that feels like home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-white/80 text-sm">Happy Residents</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-white/80 text-sm">Premium PGs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-white/80 text-sm">Cities</div>
                </div>
              </div>
            </div>
            
            {/* Login Form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm
                title="User Login"
                description="Sign in to explore amazing PG accommodations"
                userType="user"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;