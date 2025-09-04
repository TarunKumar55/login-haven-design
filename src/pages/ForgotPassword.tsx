import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import heroInterior from "@/assets/hero-interior.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (!result.error) {
        setSent(true);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-full max-w-md">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-elegant">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {sent ? "Check Your Email" : "Reset Password"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {sent 
                    ? "We've sent password reset instructions to your email address."
                    : "Enter your email address and we'll send you a link to reset your password."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sent ? (
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If an account with email <strong>{email}</strong> exists, you will receive password reset instructions.
                    </p>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => {
                          setSent(false);
                          setEmail("");
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Send Another Email
                      </Button>
                      <Link to="/user-login">
                        <Button variant="ghost" className="w-full">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Login
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-input/50 border-border/50 focus:border-accent"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading || !email}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>

                    <Link to="/user-login">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;