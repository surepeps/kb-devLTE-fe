/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';

export default function AgentDetailsBar({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const onSubmit = async () => {
    try {
      const url = URLS.BASE + URLS.agentApproval;
      const payload = {
        agentId: user.id,
      };

      await toast.promise(
        POST_REQUEST(url, payload).then((response) => {
          if ((response as any).success) {
            toast.success('Agent approved successfully');
            window.location.reload(); 
            return 'Agent approved successfully';
          } else {
            const errorMessage =
              (response as any).error || 'Approval failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
          }
        }),
        {
          loading: 'Submitting approval...',
        }
      );
    } catch (error) {
      console.error(error);
      toast.error('An error occurred, please try again');
    }
  };

  return (
    <div className='fixed top-0 right-0 h-full w-[35%] bg-white shadow-lg z-50'>
      <div className='h-full flex flex-col'>
        {/* Cancel Button */}
        <button
          onClick={onClose}
          className='absolute top-4 left-4 text-black hover:bg-gray-300 p-2 rounded-full'>
          <FaTimes size={25}/>
        </button>

        {/* Scrollable Content */}
        <div className='h-full overflow-y-auto py-14 px-10'>
          {/* Top Section */}
          <div className='bg-[#FAFAFA] p-6 flex flex-col items-center justify-center gap-4'>
            <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white'>
              {user.firstName.slice(0, 1).toUpperCase() + user.lastName.slice(0, 1).toUpperCase()}
            </div>
            <div className='text-center'>
              <p className='text-2xl font-semibold'>{`${user.firstName} ${user.lastName}`}</p>
              <p
                className={`text-lg font-semibold ${
                  user.agentType === 'individual' ? 'text-red-500' : 'text-green-500'
                }`}>
                {user.agentType}
              </p>
              <p className='text-sm text-gray-600'>{user.email}</p>
            </div>
          </div>

          <div className='h-4'></div>

          {/* Middle Section */}
          <div className='bg-[#FAFAFA] p-5'>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='font-normal'>Date:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Email:</span>
                <span>{user.email}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Address:</span>
                <span>{`${user.address.street}, ${user.address.localGovtArea}, ${user.address.state}`}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Areas of Operation:</span>
                <span>{user.regionOfOperation.join(', ')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Referral:</span>
                <span>{user.referral || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Type of Agent:</span>
                <span>{user.agentType}</span>
              </div>
              {user.agentType.toLowerCase() === 'incorporated' && (
                <>
                  <div className='flex justify-between'>
                    <span className='font-normal'>Company Name:</span>
                    <span>{user.companyName || 'N/A'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-normal'>Registration Number:</span>
                    <span>{user.registrationNumber || 'N/A'}</span>
                  </div>
                </>
              )}
              <div className='flex justify-between'>
                <span className='font-normal'>Documents:</span>
                <span>
                  {user.meansOfId.map((doc: any) => doc.name).join(', ') || 'N/A'}
                </span>
              </div>
            </div>
            <hr className='my-4' />
          </div>

          {/* Bottom Section */}
          <div className='mt-14'>
            <button
              onClick={!user.accountApproved ? onSubmit : undefined} // Call onSubmit when approving
              disabled={user.accountApproved}
              className={`w-full bg-white border ${
                user.accountApproved ? 'border-gray-500 text-gray-500' : 'border-green-500 text-green-500'
              } py-4 rounded-md ${
                user.accountApproved
                  ? 'cursor-not-allowed'
                  : 'hover:bg-green-500 hover:text-white'
              } transition duration-300`}>
              {user.accountApproved ? 'Agent Approved' : 'Approve Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
