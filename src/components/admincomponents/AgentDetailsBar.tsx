/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Loading from '@/components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { downloadImage } from '@/utils/downloadImage';

export default function AgentDetailsBar({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const closeModal = () => {
    setSelectedImage(null);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('User details' + user);
  }, [user]);

  const onSubmit = async (status?: boolean) => {
    console.log('User details' + user);
    try {
      const isBrief = !!user?.legalName; // Determine if it's a brief based on legalName
      const url = isBrief
        ? URLS.BASE + URLS.approveBrief // Use approveBrief URL for briefs
        : URLS.BASE + URLS.agentApproval; // Use agentApproval URL for agents

      const payload = isBrief
        ? {
            propertyId: user?.propertyId || '',
            propertyType: user?.briefType || '', // Use propertyType for briefs
            status,
          } // Payload for briefs
        : {
            agentId: user?.id || '',
            approved: true,
          };

      console.log('payload', payload);
      console.log('url', url);

      await toast.promise(
        POST_REQUEST(url, payload).then((response) => {
          if ((response as any).success) {
            toast.success(
              isBrief
                ? status
                  ? 'Brief approved successfully'
                  : 'Brief rejected successfully'
                : 'Agent approved successfully'
            );
            console.log('Approval successful:', response);
            window.location.href = '/admin'; // Redirect to /admin after success
            return isBrief
              ? status
                ? 'Brief approved successfully'
                : 'Brief rejected successfully'
              : 'Agent approved successfully';
          } else {
            const errorMessage = (response as any).error || 'Approval failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
          }
        }),
        {
          loading: isBrief
            ? status
              ? 'Approving brief...'
              : 'Rejecting brief...'
            : 'Submitting approval...',
        }
      );
    } catch (error) {
      console.error(error);
      toast.error('An error occurred, please try again');
    }
  };

  const handleImageClick = (docImg: string, docName: string) => {
    setIsLoading(true);
    setSelectedImage({
      image: docImg,
      name: docName,
    });
  };

  return (
    <div className='fixed top-0 right-0 h-full w-[35%] bg-white shadow-lg z-50'>
      {isLoading && <Loading />}
      {selectedImage && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='relative bg-white p-4 rounded-lg w-[60%] h-[50%] overflow-auto my-auto hide-scrollbar'>
            <button
              type='button'
              onClick={closeModal}
              className='absolute top-2 right-2 text-black hover:bg-gray-300 p-2 rounded-full'>
              <FaTimes size={20} />
              {''}
            </button>
            <img
              src={selectedImage.image}
              alt='Document'
              className='max-w-[80%] h-[90%] max-h-screen mx-auto my-auto'
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                toast.error('Failed to load image');
              }}
            />
            <div className='flex items-center mb-[20px]'>
              <button
                title='Download'
                type='button'
                onClick={() => {
                  downloadImage(selectedImage.image, selectedImage.name);
                }}
                className='flex items-center gap-2 rounded-[5px] bg-gray-100 hover:bg-gray-200 px-2 py-[2px] border-[1px] border-gray-200'>
                <span>Download</span>
                <FontAwesomeIcon icon={faDownload} size='sm' />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='h-full flex flex-col'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 left-4 text-black hover:bg-gray-300 p-2 rounded-full'>
          <FaTimes size={25} />
          {''}
        </button>

        <div className='h-full overflow-y-auto py-14 px-10'>
          <div className='bg-[#FAFAFA] p-6 flex flex-col items-center justify-center gap-4'>
            <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white'>
              {user?.legalName
                ? user.legalName
                    .split(' ')
                    .map((name: string) => name[0])
                    .join('')
                    .toUpperCase()
                : user?.firstName && user?.lastName
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((name: string) => name[0])
                    .join('')
                    .toUpperCase()
                : 'N/A'}
            </div>
            <div className='text-center'>
              <p className='text-2xl font-semibold'>
                {user?.legalName
                  ? user.legalName
                  : user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.fullName || 'N/A'}
              </p>
              <p
                className={`text-lg font-semibold ${
                  user?.agentType === 'individual'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}>
                {user?.agentType || 'N/A'}
              </p>
              <p className='text-sm text-gray-600'>{user?.email || 'N/A'}</p>
            </div>
          </div>

          <div className='h-4'></div>

          <div className='bg-[#FAFAFA] p-5'>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='font-normal'>Date:</span>
                <span>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Email:</span>
                <span>{user?.email || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Address:</span>
                <span>
                  {user?.address?.street &&
                  user?.address?.localGovtArea &&
                  user?.address?.state
                    ? `${user.address.street}, ${user.address.localGovtArea}, ${user.address.state}`
                    : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Areas of Operation:</span>
                <span>{user?.regionOfOperation?.join(', ') || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Referral:</span>
                <span>{user?.referral || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-normal'>Type of Agent:</span>
                <span>{user?.agentType || 'N/A'}</span>
              </div>
              {user?.agentType?.toLowerCase() === 'incorporated' && (
                <>
                  <div className='flex justify-between'>
                    <span className='font-normal'>Company Name:</span>
                    <span>{user?.companyName || 'N/A'}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='font-normal'>Registration Number:</span>
                    <span>{user?.registrationNumber || 'N/A'}</span>
                  </div>
                </>
              )}
              <div className='flex justify-between'>
                <span className='font-normal'>Documents:</span>
                <span className='space-x-2'>
                  {user?.meansOfId?.length > 0
                    ? user.meansOfId.map((doc: any, index: number) => (
                        <a
                          key={index}
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageClick(
                              doc?.docImg?.[0] || '',
                              doc?.name || ''
                            );
                          }}
                          className='text-blue-500 underline'>
                          {doc?.name || 'N/A'}
                        </a>
                      ))
                    : 'N/A'}
                </span>
              </div>
            </div>
            <hr className='my-4' />
          </div>

          <div className='mt-14'>
            {user?.legalName ? (
              <div className='flex gap-4'>
                <button
                  onClick={() => onSubmit(true)} // Pass true for brief approval
                  disabled={user?.isApproved} // Disable if user is already approved
                  className={`w-full py-4 transition duration-300 ${
                    user?.isApproved
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#8DDB90] text-white hover:bg-green-900'
                  }`}>
                  Approve Brief
                </button>
                <button
                  onClick={() => onSubmit(false)} // Pass false for brief rejection
                  disabled={!user?.isApproved} // Disable if user is not approved
                  className={`w-full py-4 transition duration-300 ${
                    !user?.isApproved
                      ? 'border-gray-300 text-gray-500 cursor-not-allowed'
                      : 'border-[#F6513B] text-[#F6513B] hover:bg-[#F6513B] hover:text-white'
                  }`}>
                  Reject Brief
                </button>
              </div>
            ) : (
              <button
                onClick={!user?.accountApproved ? () => onSubmit() : undefined} // No status for agent approval
                disabled={false}
                className={`w-full bg-white border ${
                  user?.accountApproved
                    ? 'border-gray-500 text-gray-500'
                    : 'border-green-500 text-green-500'
                } py-4 rounded-md ${
                  user?.accountApproved
                    ? 'cursor-not-allowed'
                    : 'hover:bg-green-500 hover:text-white'
                } transition duration-300`}>
                {user?.accountApproved ? 'Agent Approved' : 'Approve Agent'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
