import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Loader2 } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SignupFormProps {
  title: string;
  description: string;
  userType: "user" | "pg-owner" | "admin";
}

const SignupForm = ({ title, description, userType }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    propertyCount: "",
    agreeToTerms: false
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both password fields match.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const role: UserRole = userType === 'pg-owner' ? 'pg_owner' : 'user';
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        role: role,
        fullName: formData.fullName,
        phone: formData.phone,
        organizationName: formData.organizationName || undefined,
        propertyCount: formData.propertyCount || undefined
      });
      
      if (!error) {
        // Don't auto-redirect - let user check email for verification
        // The toast message from signUp will inform them to check email
        console.log('Signup successful - please check email for verification');
      }
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getButtonVariant = () => {
    switch (userType) {
      case "admin":
        return "elegant";
      case "pg-owner":
        return "gold";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="pl-10 bg-input/50 border-border/50 focus:border-accent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-input/50 border-border/50 focus:border-accent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10 bg-input/50 border-border/50 focus:border-accent"
                  required
                />
              </div>
            </div>

            {userType === "pg-owner" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="text-sm font-medium text-foreground">
                    Organization/Property Name
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="organizationName"
                      type="text"
                      placeholder="Enter organization name"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      className="pl-10 bg-input/50 border-border/50 focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyCount" className="text-sm font-medium text-foreground">
                    Number of Properties
                  </Label>
                  <Input
                    id="propertyCount"
                    type="number"
                    placeholder="Enter number of properties"
                    value={formData.propertyCount}
                    onChange={(e) => handleInputChange("propertyCount", e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-accent"
                    min="1"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 bg-input/50 border-border/50 focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10 bg-input/50 border-border/50 focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="mt-1 rounded border-border/50"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant={getButtonVariant()}
              className="w-full"
              size="lg"
              disabled={loading || !formData.email || !formData.password || !formData.fullName}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href={`/${userType}-login`} className="text-accent hover:text-accent/80 transition-colors font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;