/** @format */

'use client';
import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  regionOfOperation?: string;
  address?: {
    localGovtArea: string;
    city: string;
    state: string;
    street: string;
  };
  agentType?: string;
  doc?: string;
  individualAgent?: {
    idNumber: string;
    typeOfId: string;
  };
  companyAgent?: {
    companyName: string;
    companyRegNumber: string;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: (callback?: () => void) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const pathName = usePathname();
  const router = useRouter();

  const getAgent = async () => {
    const url = URLS.BASE + URLS.agentProfile;
    await GET_REQUEST(url, Cookies.get('token'))
      .then((response) => {
        if (response?.data?.id) {
          setUser(response.data);
        } else {
          if (
            response.message.toLowerCase().includes('unauthorized') ||
            response.message.toLowerCase().includes('jwt') ||
            response.message.toLowerCase().includes('expired') ||
            response.message.toLowerCase().includes('valid') ||
            response.message.toLowerCase().includes('not') ||
            response.message.toLowerCase().includes('malformed')
          ) {
            Cookies.remove('token');
            toast.error('Session expired, please login again');
            if (pathName.includes('/agent')) {
              if (!pathName.includes('/auth')) router.push('/agent/auth/login');
            }
          }
        }
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  const logout = (callback?: () => void) => {
    Cookies.remove('token');
    setUser(null);
    router.push('/agent/auth/login');
    if (callback) callback();
  };

  useEffect(() => {
    if (Cookies.get('token')) {
      getAgent();
    } else {
      if (pathName.includes('/agent')) {
        if (!pathName.includes('/auth')) router.push('/agent/auth/login');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
