/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

'use client';
/** @format */
import { ShowTableProps } from '@/types/show_table';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/styles/tables.css';
import { useState } from 'react';
import Modal from './Modal';
import { usePageContext } from '@/context/page-context';
import { useCreateBriefContext } from '@/context/create-brief-context';
import { AgentNavData } from '@/enums';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import toast from 'react-hot-toast';

const ShowTable: React.FC<ShowTableProps> = ({
  data,
  heading,
  headerData,
  setShowFullDetails,
  setDetailsToCheck,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editBriefDetails, setEditBriefDetails] = useState<any>({});
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const { setSelectedNav } = usePageContext();
  const { createBrief, setCreateBrief } = useCreateBriefContext();

  const handleIconClick = (event: React.MouseEvent, item: any) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setDetailsToCheck({
      ...item,
      propertyPrice: item.price,
      propertyFeatures: item.propertyFeatures,
      pictures: item.pictures.length !== 0 ? item.pictures : [],
    });
    setModalVisible(true);
    console.log(data);
  };
  const [briefID, setBriefID] = useState<string | undefined>(undefined);

  /**
   * @handleDeleteBrief : delete brief
   * @param id : id of the brief | string
   */
  const handleDeleteBrief = async (id: string | undefined) => {
    const url = URLS.BASE + URLS.deleteSellBrief + id;
    console.log(url);
    try {
      const response = await axios.delete(url);
      console.log(response);
      toast.success('Brief deleted');
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => setModalVisible(false);

  return (
    <div className='w-full border-[1px] border-[#E4DFDF] min-h-fit rounded-[4px] py-[32px] px-[30px] flex flex-col gap-[30px] bg-[#FFFFFF]'>
      <h1 className='text-[18px] leading-[18px] text-[#000000] font-semibold font-archivo'>
        {heading}
      </h1>
      <table cellPadding={6} className='w-full flex flex-col gap-[15px]'>
        <thead className='min-h-[54px] px-[8px] py-[6px] bg-[#FAFAFA]'>
          {''}
          <tr className='w-full flex'>
            {headerData?.map((item: string, idx: number) => (
              <td
                key={idx}
                className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody className='space-y-2 overflow-y-scroll hide-scrollbar px-[8px] '>
          {data.map((item, idx: number) => (
            <tr
              className='w-full flex hover:bg-gray-100 rounded-[5px] transition duration-500 py-2 items-center'
              key={idx}>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.createdAt?.split('T')[0]}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.propertyType}
              </td>
              <td className='text-[14px] text-left leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.location?.state},{item.location?.localGovernment}
              </td>
              <td className='text-[14px] leading-[22.4px] font-semibold font-archivo text-[#181336]'>
                N {Number(item.price).toLocaleString()}
              </td>
              {item.docOnProperty?.length !== 0 ? (
                // <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                //   {item.document.split('').splice(0, 14).join('') + '...'}
                // </td>
                <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                  {item?.docOnProperty !== undefined &&
                    item.docOnProperty[0].docName}
                  {'...'}
                </td>
              ) : null}
              {/* {item.amountSold ? (
                <td className='text-[14px] text-[#14B01A] leading-[22.4px] font-normal font-archivo'>
                  N {Number(item.amountSold).toLocaleString()}
                </td>
              ) : null} */}
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                <FontAwesomeIcon
                  onClick={(e) => {
                    handleIconClick(e, item);
                    setEditBriefDetails(item);
                    setBriefID(item._id);
                  }}
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
        onEditBrief={() => {
          if (heading === 'Total Brief' || heading === 'Publish Brief') return;
          setCreateBrief({
            ...createBrief,
            propertyType: editBriefDetails.propertyType,
            additionalFeatures:
              editBriefDetails.propertyFeatures?.additionalFeatures,
            noOfBedroom: editBriefDetails.propertyFeatures?.noOfBedrooms,
            selectedState: {
              value:
                editBriefDetails.location?.state !== undefined
                  ? editBriefDetails.location.state
                  : '',
              label:
                editBriefDetails.location?.state !== undefined
                  ? editBriefDetails.location.state
                  : '',
            },
            selectedLGA: {
              value:
                editBriefDetails.location?.localGovernment !== undefined
                  ? editBriefDetails.location.localGovernment
                  : '',
              label:
                editBriefDetails.location?.localGovernment !== undefined
                  ? editBriefDetails.location.localGovernment
                  : '',
            },
            selectedCity:
              editBriefDetails.location?.area !== undefined
                ? editBriefDetails.location.area
                : '',
            documents:
              editBriefDetails.docOnProperty !== undefined
                ? editBriefDetails.docOnProperty.map(
                    ({ docName }: { docName: string }) => docName
                  )
                : [''],
            price:
              Number(editBriefDetails.price) ||
              Number(editBriefDetails.propertyPrice),
            fileUrl:
              editBriefDetails.pictures !== undefined
                ? editBriefDetails.pictures.map((item: string) => ({
                    id: item,
                    image: item,
                  }))
                : [],
          });
          setSelectedNav(AgentNavData.CREATE_BRIEF);
        }}
        onDeleteBrief={() => handleDeleteBrief(briefID)}
      />
    </div>
  );
};

export default ShowTable;
