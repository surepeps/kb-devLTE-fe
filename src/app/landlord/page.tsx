'use client';

import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import { useUserContext } from '@/context/user-context';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LandlordPage() {
  const router = useRouter();
  const { setUser } = useUserContext();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse: any) => {
      const url = URLS.BASE + URLS.user + URLS.googleSignup;

      await POST_REQUEST(url, { code: codeResponse.code, userType: 'Landowners' }).then(async (response) => {
        if ((response as any).id) {
          Cookies.set('token', (response as any).token);
          setUser((response as any).user);
          localStorage.setItem('email', (response as any).user?.email || '');
          toast.success('Registration successful');
          router.push('/my_listing');
        }
        if (response.error) {
          toast.error(response.error);
        }
      });
    },
    onError: (errorResponse: any) => toast.error(errorResponse.message),
  });

  return (
    <section className="min-h-[500px] overflow-hidden bg-[#EEF1F1] flex justify-center items-center w-full transition-all duration-500 my-10">
      <div className="container slide-from-right min-h-[400px] lg:w-[603px] w-full flex flex-col justify-center gap-[40px] items-center px-[20px]">
        <div className="text-center">
          <h2 className="text-[#09391C] text-[24px] leading-[38.4px] font-semibold font-display">
            Register with us
          </h2>
          <p className="text-[#5A5D63] text-[16px] mt-4">
            Are you a <span className="font-semibold">landowner</span> looking to sell, rent, or explore joint ventures?
          </p>
          <p className="text-[#5A5D63] text-[16px] mt-2">
            Register with us today and start closing deals!
          </p>
        </div>

        <div className="min-h-[147px] flex flex-col gap-[22px] w-full">
          <div className="flex flex-col gap-[15px] w-full">
            <button
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-2 w-full h-[65px] border border-[#D6DDEB] bg-white py-[12px] px-[24px] text-[16px] leading-[25.6px] font-bold text-[#141A16] hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with google
            </button>
            <button
              className="flex items-center justify-center gap-2 w-full h-[65px] border border-[#D6DDEB] bg-white py-[12px] px-[24px] text-[16px] leading-[25.6px] font-bold text-[#141A16] hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>
          <Link
            href="/auth/register?type=Landowners"
            className="bg-[#8DDB90] h-[65px] w-full py-[12px] px-[24px] text-[16px] leading-[25.6px] font-bold text-[#FAFAFA] flex items-center justify-center hover:bg-[#7dc982]"
          >
            Register Via E-mails
          </Link>
        </div>

        <div className="text-center">
          <p className="text-base leading-[25.6px] font-normal">
            Already have an account?{' '}
            <Link className="font-semibold text-[#09391C]" href="/auth/login">
              Sign
            </Link>
          </p>
          <p className="text-base text-center leading-[25.6px] font-normal mt-2">
            By Continuing you agree to the Khabi-Teq realty{' '}
            <Link className="font-semibold text-[#09391C]" href="/policies_page">
              policy and Rules
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
} 