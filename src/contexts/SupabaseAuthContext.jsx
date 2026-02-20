import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      // Using maybeSingle() instead of single() prevents the PGRST116 error
      // when a row is not found. It returns null data instead of throwing an error.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUserProfile(data);
      } else {
        // Profile doesn't exist yet, which is valid for new users before the trigger runs
        // or if the trigger failed. We can set userProfile to null or a default object.
        console.log('Profile not found for user:', userId);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      await fetchUserProfile(currentUser.id);
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
        if (event === 'SIGNED_IN' && session?.user) {
             fetchUserProfile(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
            setUser(null);
            setUserProfile(null);
            setSession(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, fetchUserProfile]);

  const signUp = useCallback(async (credentials, options) => {
    // If credentials is an object with email/phone, handle accordingly
    // Assuming standard email/pass for now based on typical usage, 
    // but checking if it's an object with specific keys
    
    let signUpResponse;
    
    if (credentials.email) {
        signUpResponse = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: options,
        });
    } else if (credentials.phone) {
         signUpResponse = await supabase.auth.signUp({
            phone: credentials.phone,
            password: credentials.password,
            options: options,
        });
    } else {
         // Fallback/Legacy support if just passed as arguments (email, password)
         // This block might not be reachable if called correctly from Register.jsx
         // but kept for safety if interface varies
         signUpResponse = { error: { message: "Invalid credentials provided" } };
    }

    const { error } = signUpResponse;

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return signUpResponse;
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { data, error };
  }, [toast]);

  const signInWithPhone = useCallback(async (phone, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
        toast({
            variant: "destructive",
            title: "Sign in Failed",
            description: error.message || "Something went wrong",
        });
    }
    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }
    
    setUser(null);
    setUserProfile(null);
    setSession(null);

    return { error };
  }, [toast]);
  
  const sendPasswordResetEmail = useCallback(async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
        });
    }
    return { data, error };
  }, [toast]);

  const updateUserPassword = useCallback(async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
     if (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
        });
    }
    return { data, error };
  }, [toast]);

  const uploadAvatar = useCallback(async (file) => {
    if (!user) return { error: { message: 'Not authenticated' } };

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: uploadError.message });
      return { error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      toast({ variant: 'destructive', title: 'Update Failed', description: updateError.message });
      return { error: updateError };
    }

    setUserProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : prev);
    return { data: { avatar_url: avatarUrl } };
  }, [user, toast]);

  const value = useMemo(() => ({
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signInWithPhone,
    signOut,
    sendPasswordResetEmail,
    updateUserPassword,
    uploadAvatar,
  }), [user, userProfile, session, loading, signUp, signIn, signInWithPhone, signOut, sendPasswordResetEmail, updateUserPassword, uploadAvatar]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};