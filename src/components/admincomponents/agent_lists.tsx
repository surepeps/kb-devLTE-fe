/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */
'use client';
import { Fragment, useEffect, useState } from 'react';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import filterIcon from '@/svgs/filterIcon.svg';
import Select from 'react-select';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import AgentSidebar from './AgentDetailsBar';
import { DELETE_REQUEST, GET_REQUEST, POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Loading from '@/components/loading';
import { calculateAgentCounts } from '@/utils/agentUtils';
import { truncateId } from '@/utils/stringUtils';
import EllipsisOptions from './ellipsisOptions';
import ApproveBriefs from './approveBriefs';
import DeleteBriefs from './deleteBriefs';
import RejectBriefs from './rejectBriefs';
import { string } from 'yup';
import OnboardAgentBar from './OnboardAgentbar';
interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  address: {
    street: string;
    state: string;
    localGovtArea: string;
  };
  agentType: string;
  accountStatus: string;
  isAccountVerified: boolean;
  createdAt: string;
  updatedAt: string;
  meansOfId: {
    docImg: string[];
    name: string;
  }[];
  regionOfOperation: string[];
  isInActive: boolean;
  isFlagged: boolean;
  isDeleted: boolean;
  accountApproved: boolean;
  profile_picture: string;
}

type AgentManagementTabsProps = {
  setDetails?: (details: any) => void;
};

export default function AgentLists({ setDetails }: AgentManagementTabsProps) {
  const [active, setActive] = useState('All Agents');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState({
    isLoading: false,
    message: '',
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [agentToApprove, setAgentToApprove] = useState<any>(null);
  const [agentToReject, setAgentToReject] = useState<any>(null);
  const [agentToDelete, setAgentToDelete] = useState<any>(null);

  const getAgentsData = async () => {
    setIsLoadingDetails({
      isLoading: true,
      message: 'Loading...',
    });
    try {
      const response = await GET_REQUEST(
        URLS.BASE + URLS.getAllAgents,
        Cookies.get('token')
      );

      if (response?.success === false) {
        toast.error('Failed to get data');
        return setIsLoadingDetails({
          isLoading: false,
          message: 'Failed to get data',
        });
      }
      const data = response.agents.data;
      // console.log(data);
      setIsLoadingDetails({
        isLoading: false,
        message: 'Data Loaded',
      });
      setAgents(data);
      setDetails?.({
        totalAgents: data.length,
        activeAgents: data.filter(
          (agent: { isInActive: boolean }) => agent.isInActive
        ).length,
        bannedAgents: 0,
        flaggedAgents: 0,
      });
      // console.log(data);
    } catch (error: any) {
      setIsLoadingDetails({
        isLoading: false,
        message: 'Failed to get data',
      });
    } finally {
      setIsLoadingDetails({
        isLoading: false,
        message: '',
      });
    }
  };

  const confirmApproveAgent = async (agentId: string) => {
    try {
      const response = await POST_REQUEST(`${URLS.BASE + URLS.agentApproval}`, {
        agentId,
        approved: true,
      });
      if (response?.success) {
        toast.success('Agent approved successfully');
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === agentId ? { ...agent, accountApproved: true } : agent
          )
        );
      } else {
        toast.error('Failed to approve agent');
      }
    } catch (error) {
      toast.error('An error occurred while approving the agent');
    } finally {
      setAgentToApprove(null);
    }
  };

  const handleDeleteAgent = async (agentId: string, reason: string) => {
    try {
      const response = await DELETE_REQUEST(
        `${URLS.BASE}/admin/delete-agent/${agentId}`,
        reason
      );
      if (response?.success) {
        toast.success('Agent deleted successfully');
        setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
      } else {
        toast.error('Failed to delete agent');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the agent');
    } finally {
      setAgentToDelete(null);
    }
  };

  const handleRejectAgent = async (agentId: string) => {
    try {
      const response = await POST_REQUEST(`${URLS.BASE + URLS.agentApproval}`, {
        agentId,
        approved: false,
      });
      if (response?.success) {
        toast.success('Brief rejected successfully');
        setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
      } else {
        toast.error('Failed to reject brief');
      }
    } catch (error) {
      toast.error('An error occurred while rejecting the brief');
    } finally {
      setAgentToReject(null);
    }
  };

  useEffect(() => {
    getAgentsData();

    const handleFocus = () => {
      getAgentsData();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const filteredAgents = agents.filter((agent) => {
    if (active === 'Onboarding Agents') {
      return !agent.accountApproved;
    }
    if (active === 'Active Agents') {
      return agent.accountStatus.toLowerCase() === 'active';
    }
    if (active === 'All Agents') {
      return agent;
    }
    if (active === 'Inactive Agents') {
      return agent.accountStatus.toLowerCase() === 'inactive';
    }
    if (active === 'Banned Agents') {
      return false;
    }
    return true;
  });

  const handleActionClick = (user: any) => {
    setSelectedUser(user);
    console.log(user);
  };

  const closeSidebar = () => {
    setSelectedUser(null);
  };

  const renderDynamicComponent = () => {
    const tableContent = (
      <>
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className='mt-6 p-4 border rounded-md bg-white w-full lg:max-w-[1128px] px-8 mr-2 overflow-hidden md:overflow-x-auto'>
          <h3 className='text-[#2E2C34] text-xl font-semibold py-6'>
            {active}
          </h3>
          <div className='flex md:flex-row flex-col gap-2 justify-between'>
            <Select
              className='text-[#2E2C34] text-sm ml-1'
              styles={{
                control: (styles) => ({
                  ...styles,
                  boxShadow: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #D6DDEB',
                  minWidth: '160px',
                }),
              }}
              options={statsOptions}
              defaultValue={statsOptions}
              value={formik.values.selectedStat}
              onChange={(options) => {
                formik.setFieldValue('selectedStat', options);
              }}
            />
            <div className='flex md:w-[initial] w-fit gap-3 cursor-pointer border px-3 justify-center items-center rounded-md h-[40px] md:h-[initial]'>
              <Image
                src={filterIcon}
                alt='filter icon'
                width={24}
                height={24}
                className='w-[24px] h-[24px]'
              />
              <span className='text-[#2E2C34]'>Filter</span>
            </div>
          </div>
          <div className='w-full overflow-x-auto md:overflow-clip mt-6'>
            <table className='min-w-[900px] md:w-full border-collapse'>
              <thead className='bg-[#fafafa] text-left text-sm font-medium text-gray-600'>
                <tr className='border-b'>
                  <th className='p-3'>
                    <input title='checkbox' type='checkbox' />
                  </th>
                  <th className='p-3'>ID</th>
                  <th className='p-3'>Legal Name</th>
                  <th className='p-3'>Email</th>
                  <th className='p-3'>Agent Type</th>
                  <th className='p-3'>Address</th>
                  <th className='p-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((item, index) => (
                  <tr
                    key={index}
                    className='border-b text-sm text-gray-700 hover:bg-gray-50'>
                    <td className='p-3'>
                      <input title='checkbox' type='checkbox' />
                    </td>
                    <td className='p-3'>{truncateId(item.id)}</td>
                    <td className='p-3'>
                      {item.firstName && item.lastName
                        ? `${item.firstName} ${item.lastName}`
                        : item.fullName}
                    </td>
                    <td className='p-3'>{item.email}</td>
                    <td
                      className={`p-3 font-semibold ${
                        item.agentType?.toLowerCase() === 'individual'
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}>
                      {item.agentType || 'N/A'}
                    </td>
                    <td className='p-3'>
                      {item.address
                        ? `${item.address.street}, ${item.address.localGovtArea}, ${item.address.state}`
                        : 'N/A'}
                    </td>
                    <td className='p-3 cursor-pointer text-2xl'>
                      <FontAwesomeIcon
                        onClick={() => {
                          if (active === 'Onboarding Agents') {
                            setSelectedUser(item); // Set the selected user for OnboardAgentBar
                          } else {
                            handleActionClick(item);
                          }
                        }}
                        icon={faEllipsis}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {agentToApprove && (
          <ApproveBriefs
            brief={agentToApprove}
            onConfirm={() => confirmApproveAgent(agentToApprove.id)}
            onCancel={() => setAgentToApprove(null)}
            isAgentApproval={true}
          />
        )}

        {agentToReject && (
          <RejectBriefs
            brief={agentToReject}
            onConfirm={() => handleRejectAgent(agentToReject.id)}
            onCancel={() => setAgentToReject(null)}
            isAgentApproval={true}
          />
        )}

        {agentToDelete && (
          <DeleteBriefs
            brief={agentToDelete}
            onConfirm={(reason) =>
              handleDeleteAgent(
                agentToDelete.id,
                reason || 'No reason provided'
              )
            }
            onCancel={() => setAgentToDelete(null)}
            isAgentApproval={true}
          />
        )}
      </>
    );

    return tableContent;
  };

  const formik = useFormik({
    initialValues: {
      selectedStat: {
        value: '1',
        label: 'Type',
      },
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Fragment>
      {isLoadingDetails.isLoading && <Loading />} {/* Show loading component */}
      <div>
        <div className='flex overflow-x-auto hide-scrollbar text-lg w-full gap-4 md:gap-8 mt-6'>
          {tabs.map((item, index) => (
            <TabButton
              key={index}
              text={item.text}
              onClick={() => setActive(item.text)}
              active={active}
            />
          ))}
        </div>
        <div className='w-full'>{renderDynamicComponent()}</div>
      </div>
      {selectedUser && active === 'Onboarding Agents' && (
        <OnboardAgentBar
          user={selectedUser}
          onClose={closeSidebar}
          onApprove={() => setAgentToApprove(selectedUser)} // Trigger ApproveBriefs
          onReject={() => setAgentToReject(selectedUser)} // Trigger RejectBriefs
          onDelete={() => setAgentToDelete(selectedUser)} // Trigger DeleteBriefs
        />
      )}
      {selectedUser && active !== 'Onboarding Agents' && (
        <AgentSidebar user={selectedUser} onClose={closeSidebar} />
      )}
      {agentToApprove && (
        <ApproveBriefs
          brief={agentToApprove}
          onConfirm={() => confirmApproveAgent(agentToApprove.id)}
          onCancel={() => setAgentToApprove(null)}
          isAgentApproval={true}
        />
      )}
      {agentToReject && (
        <RejectBriefs
          brief={agentToReject}
          onConfirm={() => handleRejectAgent(agentToReject.id)}
          onCancel={() => setAgentToReject(null)}
          isAgentApproval={true}
        />
      )}
      {agentToDelete && (
        <DeleteBriefs
          brief={agentToDelete}
          onConfirm={(reason) =>
            handleDeleteAgent(
              agentToDelete.id,
              reason || 'No reason provided'
            )
          }
          onCancel={() => setAgentToDelete(null)}
          isAgentApproval={true}
        />
      )}
    </Fragment>
  );
}

const TabButton = ({
  text,
  onClick,
  active,
}: {
  text: string;
  onClick: () => void;
  active: string;
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`relative rounded-sm shrink-0  ${
        active === text
          ? 'border-b-4 border-[#8DDB90]  text-[#181336] font-semibold'
          : 'text-[#515B6F]'
      }`}>
      {text}
    </button>
  );
};

const tabs = [
  { text: 'Onboarding Agents' },
  { text: 'All Agents' },
  { text: 'Active Agents' },
  { text: 'Inactive Agents' },
  { text: 'Banned Agents' },
];

const statsOptions = [
  { value: '1', label: 'Individual' },
  { value: '2', label: 'Incoporated' },
];
