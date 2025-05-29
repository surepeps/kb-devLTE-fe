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

export interface User {
  accountApproved: boolean;
  _id?: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  selectedRegion?: string[];
  userType?: string;
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
    const url = URLS.BASE + URLS.user + URLS.userProfile;
    await GET_REQUEST(url, Cookies.get('token'))
      .then((response) => {
        if (response?._id) {
          //console.log('User data:', response);
          setUser(response);
        } else {
          if (
            typeof response?.message === 'string' &&
            (response.message.toLowerCase().includes('unauthorized') ||
              response.message.toLowerCase().includes('jwt') ||
              response.message.toLowerCase().includes('expired') ||
              response.message.toLowerCase().includes('malformed'))
          ) {
            Cookies.remove('token');
            toast.error('Session expired, please login again');
            if (pathName.includes('/auth')) {
              if (!pathName.includes('/auth')) router.push('/auth/login');
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
    router.push('/auth/login');
    if (callback) callback();
  };

  useEffect(() => {
    if (Cookies.get('token')) {
      getAgent();
    } else {
      if (pathName.includes('/auth')) {
        if (!pathName.includes('/auth')) router.push('/auth/login');
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
