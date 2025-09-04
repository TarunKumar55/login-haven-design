import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'user' | 'pg_owner' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  organization_name?: string;
  property_count?: number;
  created_at: string;
  updated_at: string;
}

interface SignupData {
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  organizationName?: string;
  propertyCount?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (signupData: SignupData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; profile?: Profile | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider state:', { user: user?.id, profile: profile?.role, loading });

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const cleanupAuthState = () => {
    // Clear all auth-related keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Clear from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Set up auth state listener (non-async for stability)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (signupData: SignupData) => {
    try {
      const { email, password, role, fullName, phone, organizationName, propertyCount } = signupData;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
            organization_name: organizationName,
            property_count: propertyCount
          }
        }
      });

      if (error) throw error;

      // Don't try to update profile immediately after signup
      // The trigger will handle profile creation with all the provided data
      
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account before signing in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: any; profile?: Profile | null }> => {
    try {
      console.log('AuthContext signIn called with:', email);
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase auth result:', { error, userData: data?.user?.id });

      if (error) throw error;

      // Fetch the user's profile after successful login
      let profileData = null;
      if (data.user) {
        console.log('Fetching profile for user:', data.user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        console.log('Profile fetch result:', { profile, profileError });
        profileData = profile;
      }

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });

      console.log('Returning from signIn:', { error: null, profile: profileData });
      return { error: null, profile: profileData };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      setUser(null);
      setSession(null);
      setProfile(null);

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });

      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Security: Only allow specific fields to be updated from client
      const allowedFields: Array<keyof Profile> = ['full_name', 'phone', 'organization_name', 'property_count'];
      const filteredUpdates: Partial<Profile> = {};
      
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          (filteredUpdates as any)[field] = updates[field];
        }
      });

      if (Object.keys(filteredUpdates).length === 0) {
        return { error: new Error('No valid fields to update') };
      }

      const { error } = await supabase
        .from('profiles')
        .update(filteredUpdates)
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...filteredUpdates } : null);

      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};