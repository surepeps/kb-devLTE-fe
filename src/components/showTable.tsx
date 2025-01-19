/** @format */
import { ShowTableProps } from '@/types/show_table';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ShowTable: React.FC<ShowTableProps> = ({
  data,
  heading,
  setShowFullDetails,
  setDetailsToCheck,
}) => {
  return (
    <div className='w-full border-[1px] border-[#E4DFDF] min-h-[558px] rounded-[4px] py-[32px] px-[30px] flex flex-col gap-[30px] bg-[#FFFFFF]'>
      <h1 className='text-[18px] leading-[18px] text-[#000000] font-semibold font-archivo'>
        {heading}
      </h1>
      <table className='w-full h-[446px] flex flex-col gap-[15px]'>
        <thead className='min-h-[54px] p-[16px] bg-[#FAFAFA]'>
          {''}
          <tr className='w-full flex space-x-12 justify-evenly'>
            <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
              Date
            </td>
            <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
              Property Type
            </td>
            <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
              Location
            </td>
            <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
              Property price
            </td>
            <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
              Document
            </td>
            <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#7C8493]'>
              Full details
            </td>
          </tr>
        </thead>
        <tbody className='space-y-6 flex flex-col overflow-y-scroll hide-scrollbar'>
          {data.map((item, idx: number) => (
            <tr className='w-full flex space-x-8 justify-evenly' key={idx}>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.date}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.propertyType}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.location}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.propertyPrice}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                {item.document}
              </td>
              <td className='text-[14px] leading-[22.4px] font-normal font-archivo text-[#181336]'>
                <FontAwesomeIcon
                  onClick={() => {
                    console.log(idx);
                    setShowFullDetails(true);
                    setDetailsToCheck(item);
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
    </div>
  );
};

export default ShowTable;
