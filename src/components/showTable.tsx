/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */
import { ShowTableProps } from '@/types/show_table';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/tables.css';
import { useState } from 'react';
import Modal from './Modal';

const ShowTable: React.FC<ShowTableProps> = ({
  data,
  heading,
  headerData,
  setShowFullDetails,
  setDetailsToCheck,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);

  const handleIconClick = (event: React.MouseEvent, item: any) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setDetailsToCheck(item);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  return (
    <div className='w-full border-[1px] border-[#E4DFDF] min-h-fit rounded-[4px] py-[32px] px-[30px] flex flex-col gap-[30px] bg-[#FFFFFF]'>
      <h1 className='text-[18px] leading-[18px] text-[#000000] font-semibold font-archivo'>
        {heading}
      </h1>
      <table className='w-full flex flex-col gap-[15px]'>
        <thead className='min-h-[54px] p-[16px] bg-[#FAFAFA]'>
          {''}
          <tr className='w-full flex'>
            {headerData?.map((item: string, idx: number) => (
              <td
                key={idx}
                className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493] flex justify-center items-center'>
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody className='space-y-6 flex flex-col justify-start overflow-y-scroll hide-scrollbar px-[8px] '>
          {data.map((item, idx: number) => (
            <tr className='w-full flex' key={idx}>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336] flex justify-center items-center'>
                {item.date.split('T')[0]}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336] flex justify-center items-center'>
                {item.propertyType}
              </td>
              <td className='text-[14px] text-left leading-[22.4px] font-normal font-archivo text-[#181336] flex justify-center items-center'>
                {item.actualLocation?.state},
                {item.actualLocation?.localGovernment}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336] flex justify-center items-center'>
                N {Number(item.propertyPrice).toLocaleString()}
              </td>
              {item.document?.length !== 0 ? (
                // <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                //   {item.document.split('').splice(0, 14).join('') + '...'}
                // </td>
                <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  {item?.docOnProperty !== undefined &&
                    item.docOnProperty[0].docName
                      .split('')
                      .splice(0, 14)
                      .join('')}
                  {'...'}
                </td>
              ) : null}
              {/* {item.amountSold ? (
                <td className='text-[14px] text-[#14B01A] leading-[22.4px] font-normal font-archivo'>
                  N {Number(item.amountSold).toLocaleString()}
                </td>
              ) : null} */}
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336] flex justify-center items-center'>
                <FontAwesomeIcon
                  onClick={(e) => handleIconClick(e, item)}
                  icon={faEllipsis}
                  width={24}
                  height={24}
                  title={'See full details'}
                  className='w-[24px] h-[24px] cursor-pointer'
                  color={'#181336'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        visible={modalVisible}
        position={modalPosition}
        onClose={closeModal}
        onViewBrief={() => setShowFullDetails(true)}
        onEditBrief={() => console.log('Edit Brief clicked')}
        onDeleteBrief={() => console.log('Delete Brief clicked')}
      />
    </div>
  );
};

export default ShowTable;
