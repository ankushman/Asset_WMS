import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockUser, INITIAL_USERS } from '@/lib/mock-data';
import { UserRole } from '@/lib/rbac';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { formatAuthError } from '@/lib/auth-errors';
import Cookies from 'js-cookie';

interface AuthState {
  user: MockUser | null;
  originalRole: UserRole;
  impersonatedRole: UserRole | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  impersonateRole: (role: UserRole) => boolean;
  exitImpersonation: () => void;
  signUpWithSupabase: (params: {
    email: string;
    password: string;
    name: string;
    companyName: string;
    role: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  signInWithSupabase: (params: {
    email: string;
    password: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USERS[0],
      originalRole: 'SUPER_ADMIN',
      impersonatedRole: null,
      isAuthenticated: true,
      token: 'mock-jwt-token-ennea-sangkaj-2026',

      login: (email: string, role?: UserRole) => {
        const foundUser = INITIAL_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        const assignedRole = role || foundUser?.role || 'SUPER_ADMIN';

        if (foundUser) {
          const userWithRole = { ...foundUser, role: assignedRole };
          Cookies.set('token', 'mock-jwt-token-ennea-sangkaj-2026', { expires: 7 });
          set({
            user: userWithRole,
            originalRole: assignedRole,
            impersonatedRole: null,
            isAuthenticated: true,
            token: 'mock-jwt-token-ennea-sangkaj-2026',
          });
          return true;
        }

        const demoUser: MockUser = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0] || 'Enterprise User',
          email,
          phone: '+91 98765 00000',
          role: assignedRole,
          companyId: 'comp-001',
          status: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString(),
        };
        Cookies.set('token', 'mock-jwt-token-ennea-sangkaj-2026', { expires: 7 });
        set({
          user: demoUser,
          originalRole: assignedRole,
          impersonatedRole: null,
          isAuthenticated: true,
          token: 'mock-jwt-token-ennea-sangkaj-2026',
        });
        return true;
      },

      logout: async () => {
        if (isSupabaseConfigured) {
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.error('Supabase signout error:', e);
          }
        }
        Cookies.remove('token');
        set({ user: null, originalRole: 'VIEWER', impersonatedRole: null, isAuthenticated: false, token: null });
      },

      impersonateRole: (targetRole: UserRole) => {
        const { originalRole } = get();
        if (originalRole !== 'SUPER_ADMIN') {
          console.warn('Security Enforcement: Role impersonation denied. User is not a Super Admin.');
          return false;
        }

        const isResettingToSelf = targetRole === 'SUPER_ADMIN';
        set((state) => ({
          impersonatedRole: isResettingToSelf ? null : targetRole,
          user: state.user ? { ...state.user, role: targetRole } : null,
        }));
        return true;
      },

      exitImpersonation: () => {
        const { originalRole } = get();
        set((state) => ({
          impersonatedRole: null,
          user: state.user ? { ...state.user, role: originalRole } : null,
        }));
      },

      signUpWithSupabase: async ({ email, password, name, companyName, role }) => {
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name,
                  companyName,
                  role,
                },
              },
            });

            if (error) {
              const friendly = formatAuthError(error.message);
              return { success: false, error: friendly.message };
            }

            const supabaseUser = data.user;
            const authToken = data.session?.access_token || 'supabase-session-token-active';

            const newProfile: MockUser = {
              id: supabaseUser?.id || `usr-sp-${Date.now()}`,
              name,
              email,
              phone: '+91 98765 00000',
              role,
              companyId: 'comp-001',
              status: true,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              createdAt: new Date().toISOString(),
            };

            Cookies.set('token', authToken, { expires: 7 });
            set({
              user: newProfile,
              originalRole: role,
              impersonatedRole: null,
              isAuthenticated: true,
              token: authToken,
            });

            return { success: true };
          } catch (e: any) {
            const friendly = formatAuthError(e.message || 'Supabase authentication failed');
            return { success: false, error: friendly.message };
          }
        }

        // Offline / Standalone Sign Up Fallback
        const newProfile: MockUser = {
          id: `usr-sp-${Date.now()}`,
          name,
          email,
          phone: '+91 98765 00000',
          role,
          companyId: 'comp-001',
          status: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          createdAt: new Date().toISOString(),
        };

        Cookies.set('token', 'mock-jwt-token-ennea-sangkaj-2026', { expires: 7 });
        set({
          user: newProfile,
          originalRole: role,
          impersonatedRole: null,
          isAuthenticated: true,
          token: 'mock-jwt-token-ennea-sangkaj-2026',
        });

        return { success: true };
      },

      signInWithSupabase: async ({ email, password, role }) => {
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              const friendly = formatAuthError(error.message);
              return { success: false, error: friendly.message };
            }

            const supabaseUser = data.user;
            const userMeta = supabaseUser?.user_metadata || {};
            const assignedRole: UserRole = role || (userMeta.role as UserRole) || 'SUPER_ADMIN';
            const authToken = data.session?.access_token || 'supabase-session-token-active';

            const userProfile: MockUser = {
              id: supabaseUser?.id || `usr-sp-${Date.now()}`,
              name: userMeta.name || email.split('@')[0],
              email,
              phone: '+91 98765 00000',
              role: assignedRole,
              companyId: 'comp-001',
              status: true,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              createdAt: new Date().toISOString(),
            };

            Cookies.set('token', authToken, { expires: 7 });
            set({
              user: userProfile,
              originalRole: assignedRole,
              impersonatedRole: null,
              isAuthenticated: true,
              token: authToken,
            });

            return { success: true };
          } catch (e: any) {
            const friendly = formatAuthError(e.message || 'Supabase authentication failed');
            return { success: false, error: friendly.message };
          }
        }

        // Fallback local sign in
        const getLoginSuccess = get().login(email, role);
        return { success: getLoginSuccess };
      },
    }),
    {
      name: 'ennea-auth-storage',
    }
  )
);
