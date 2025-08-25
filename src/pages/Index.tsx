import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, Building, Shield, Home, Star, MapPin, Wifi } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";

const Index = () => {
  const features = [
    {
      icon: Home,
      title: "Premium Interiors",
      description: "Beautifully designed spaces with modern amenities and stylish furnishing."
    },
    {
      icon: Wifi,
      title: "High-Speed Internet",
      description: "Reliable connectivity for work, study, and entertainment needs."
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Verified properties with regular quality checks and maintenance."
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Strategic locations with easy access to offices, colleges, and transport."
    }
  ];

  const loginOptions = [
    {
      path: "/user-login",
      title: "I'm Looking for a PG",
      description: "Find your perfect home away from home",
      icon: User,
      variant: "default" as const,
      gradient: "from-primary to-accent",
      signupPath: "/user-signup"
    },
    {
      path: "/pg-owner-login",
      title: "I Own a PG",
      description: "Manage your property and reach more tenants",
      icon: Building,
      variant: "gold" as const,
      gradient: "from-gold-accent to-accent",
      signupPath: "/pg-owner-signup"
    },
    {
      path: "/admin-login",
      title: "Platform Admin",
      description: "Administrative access to the platform",
      icon: Shield,
      variant: "elegant" as const,
      gradient: "from-deep-charcoal to-primary"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroInterior})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/20" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Your Perfect
              <span className="block bg-gradient-to-r from-gold-accent to-accent bg-clip-text text-transparent">
                PG Pathfinder
              </span>
              Awaits
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
              Discover beautifully designed PG accommodations that combine comfort, style, and modern living.
            </p>
            
            {/* Login Options */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              {loginOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card key={option.path} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-xl">{option.title}</CardTitle>
                      <CardDescription className="text-white/80">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Link to={option.path}>
                          <Button variant={option.variant} className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        {option.signupPath && (
                          <Link to={option.signupPath}>
                            <Button variant="glass" className="w-full">
                              Sign Up
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Choose PG Pathfinder?
            </h2>
            <p className="text-xl text-muted-foreground">
              We provide more than just accommodation - we create beautifully designed living experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-gold-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-gold-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of satisfied residents who found their perfect PG accommodation with us.
            </p>
            <Link to="/user-login">
              <Button variant="glass" size="lg" className="text-lg px-8 py-4">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;