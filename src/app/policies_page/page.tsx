/** @format */
'use client';
import Button from '@/components/general-components/button';
import Loading from '@/components/loading-component/loading';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import React, { FC, Fragment, useState } from 'react';
import { motion } from 'framer-motion';

const Policies = () => {
  const { isContactUsClicked, isModalOpened } = usePageContext();
  const isLoading = useLoading();
  const [policiesButton, setPoliciesButton] = useState({
    clientEngagementPolicyButton: true,
    agentEngagementPolicyButton: false,
    dataProductionPolicyButton: false,
  });

  if (isLoading) return <Loading />;
  return (
    <section
      className={`min-h-[600px] bg-[#EEF1F1] w-full flex justify-center ${
        (isContactUsClicked || isModalOpened) && 'filter brightness-[30%]'
      } transition-all duration-500`}>
      <div className='container flex flex-col gap-[30px] my-[60px] px-[20px]'>
        <h2 className='text-[#09391C] lg:text-[40px] lg:leading-[64px] font-semibold font-display text-center text-[30px] leading-[41px]'>
          Our&nbsp;
          <span className='text-[#8DDB90] font-display'>Policies</span>
        </h2>
        <div className='w-full flex lg:flex-row flex-col gap-[15px] min-h-[38px] lg:min-w-[623px] justify-center items-center'>
          {buttons.map((item: string, idx: number) => (
            <Button
              onClick={() => {
                if (item === buttons[0]) {
                  setPoliciesButton({
                    clientEngagementPolicyButton: true,
                    agentEngagementPolicyButton: false,
                    dataProductionPolicyButton: false,
                  });
                }
                if (item === buttons[1]) {
                  setPoliciesButton({
                    clientEngagementPolicyButton: false,
                    agentEngagementPolicyButton: true,
                    dataProductionPolicyButton: false,
                  });
                }
                if (item === buttons[2]) {
                  setPoliciesButton({
                    clientEngagementPolicyButton: false,
                    agentEngagementPolicyButton: false,
                    dataProductionPolicyButton: true,
                  });
                }
              }}
              className={`min-h-[38px] lg:w-[217px] w-full border-[1px] py-[12px] px-[24px] border-[#D6DDEB] text-[#5A5D63] text-[14px] font-medium leading-[22.4px] hover:bg-[#8DDB90] hover:text-[#FFFFFF] ${
                item === buttons[0] &&
                policiesButton.clientEngagementPolicyButton &&
                'bg-[#8DDB90] text-[#FFFFFF]'
              } ${
                item === buttons[1] &&
                policiesButton.agentEngagementPolicyButton &&
                'bg-[#8DDB90] text-[#FFFFFF]'
              } ${
                item === buttons[2] &&
                policiesButton.dataProductionPolicyButton &&
                'bg-[#8DDB90] text-[#FFFFFF]'
              }`}
              key={idx}
              value={item}
            />
          ))}
        </div>
        <div className='container'>
          {policiesButton.dataProductionPolicyButton && DataProtectionPolicy()}
          {policiesButton.clientEngagementPolicyButton &&
            ClientEngagementPolicy()}
          {policiesButton.agentEngagementPolicyButton &&
            AgentEngagementPolicy()}
        </div>
      </div>
    </section>
  );
};

const buttons: string[] = [
  'Client Engagement Policy',
  'Agent Engagement Policy',
  'Data Protection Policy',
];

const DataProtectionPolicy = () => {
  return (
    <Fragment>
      <div className='container min-h-[800px] flex flex-col gap-[30px] '>
        <div className='w-full min-h-[200px] flex flex-col justify-center items-center gap-[20px]'>
          <motion.h2
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className='text-[40px] leading-[64px] text-center font-semibold text-[#09391C] font-display'>
            <span className='text-[#8DDB90] font-display'>Khabi-Teq</span> Data
            Protection Policy
          </motion.h2>
          <motion.span
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className='text-[20px] leading-[32px] text-center text-[#5A5D63]'>
            At Khabi-Teq, we prioritize the privacy and security of all personal
            data entrusted to us by agents, tenants, landlords, buyers, and
            sellers. This policy explains how we collect, store, use, and
            protect personal data across all interactions.
          </motion.span>
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='lg:w-[1100px] flex justify-center items-center'>
            <div className='lg:w-[870px] flex flex-col gap-[39px]'>
              {/**What is a Joint Venture (JV)? */}
              <div className='w-full flex flex-col gap-[15px]'>
                <ListingFormat data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const ClientEngagementPolicy = () => {
  return (
    <Fragment>
      <div className='container min-h-[800px] flex flex-col gap-[30px] '>
        <div className='w-full min-h-[200px] flex flex-col justify-center items-center gap-[20px]'>
          <motion.h2
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className='text-[40px] leading-[64px] text-center font-semibold text-[#09391C] font-display'>
            <span className='text-[#8DDB90] font-display'>Khabi-Teq</span>{' '}
            Client Engagement Policy
          </motion.h2>
          <motion.span
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className='text-[20px] leading-[32px] text-center text-[#5A5D63]'>
                          At Khabiteq Realty, we are committed to providing exceptional
            service to our clients. This Client Engagement Policy outlines our
            approach to building and maintaining strong relationships with our
            clients.
 
          </motion.span>
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='lg:w-[1100px] flex justify-center items-center'>
            <div className='lg:w-[870px] flex flex-col gap-[39px]'>
              {/**What is a Joint Venture (JV)? */}
              <div className='w-full flex flex-col gap-[15px]'>
                <ListingFormat data={clientData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const AgentEngagementPolicy = () => {
  return (
    <Fragment>
      <div className='container min-h-[800px] flex flex-col gap-[30px] '>
        <div className='w-full min-h-[200px] flex flex-col justify-center items-center gap-[20px]'>
          <motion.h2
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className='text-[40px] leading-[64px] text-center font-semibold text-[#09391C] font-display'>
            <span className='text-[#8DDB90] font-display'>Khabi-Teq</span> Agent
            Engagement Policy
          </motion.h2>
          <motion.span
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className='text-[20px] leading-[32px] text-center text-[#5A5D63]'>
            At Khabiteq Realty, we are committed to providing exceptional
            service to our agents. This Agent Engagement Policy outlines our
            approach to building and maintaining strong relationships with our
            agents.
          </motion.span>
        </div>
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='lg:w-[1100px] flex justify-center items-center'>
            <div className='lg:w-[870px] flex flex-col gap-[39px]'>
              {/**What is a Joint Venture (JV)? */}
              <div className='w-full flex flex-col gap-[15px]'>
                <ListingFormat data={agentData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

type SubData = {
  subListing: {
    title: string;
    details: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
  }[];
  paragraph: string;
};

type Data = {
  heading: string;
  subData: SubData[];
};
interface ListingFormatProps {
  data: Data[];
}

const ListingFormat: FC<ListingFormatProps> = ({ data }) => {
  return (
    <motion.div className='w-full'>
      <motion.ol className='list-decimal list-outside space-y-5'>
        {data.map((item: Data, idx: number) => (
          <motion.li
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            key={idx}
            className='space-y-3 text-[22px]'>
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className='text-[22px] leading-[25.78px] tracking-[0%] font-bold text-[#09391C]'>
              {item.heading}
            </motion.h2>
            {item.subData.map((subItem: SubData, idx: number) => {
              return (
                <motion.div className='flex flex-col gap-4' key={idx}>
                  <motion.p
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className='text-[20px] font-bold text-black leading-[37.4px] tracking-[2%]'>
                    {subItem.paragraph}
                  </motion.p>
                  <motion.ul className='list-disc list-inside'>
                    {subItem.subListing.map(
                      (
                        list: {
                          title: string;
                          details: string;
                          paragraph1?: string;
                          paragraph2?: string;
                          paragraph3?: string;
                        },
                        idx: number
                      ) => (
                        <motion.li
                          initial={{ y: 40, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          viewport={{ once: true }}
                          key={idx}
                          className='text-[#5A5D63] text-[20px] leading-[37.4px] tracking-[2%]'>
                          <span className='text-black font-bold'>
                            {' '}
                            {list.title}&nbsp;
                          </span>
                          {list.details}
                          {list.paragraph1 && (
                            <>
                              <ul className='text-black font-medium ml-10'>
                                {list.paragraph1}
                              </ul>
                              <ul className='text-black font-medium ml-10'>
                                {list.paragraph2}
                              </ul>
                              <ul className='text-black font-medium ml-10'>
                                {list.paragraph3}
                              </ul>
                            </>
                          )}
                        </motion.li>
                      )
                    )}
                  </motion.ul>
                </motion.div>
              );
            })}
          </motion.li>
        ))}
      </motion.ol>
    </motion.div>
  );
};

const data: Data[] = [
  {
    heading: `Personal Data Collection`,
    subData: [
      {
        subListing: [
          {
            title: 'Contact Information:',
            details: 'Names, email addresses, phone numbers.',
          },
          {
            title: 'Property Preferences and Transactions:',
            details: `Search preferences (location, type,
budget), property details, agreements, and payment information.
`,
          },
          {
            title: `Business Information:`,
            details: `Certifications and addresses for agents and landlords.`,
          },
        ],
        paragraph:
          'We collect data necessary for delivering real estate services, including:',
      },
      {
        subListing: [
          {
            title: '',
            details:
              'Through online forms, website interactions, emails, and phone communications.',
          },
          {
            title: ``,
            details: `During onboarding processes for agents and clients`,
          },
        ],
        paragraph: 'How We Collect Data:',
      },
    ],
  },

  {
    heading: `Data Storage and Security`,
    subData: [
      {
        subListing: [
          {
            title: 'Digital Storage:',
            details: 'Personal data is encrypted during storage and transit.',
          },
          {
            title: 'Physical Records:',
            details: `Hard copies, if any, are stored in secure, restricted-access
locations.`,
          },
          {
            title: `Backups:`,
            details: `Regular backups are performed to safeguard against data loss`,
          },
          {
            title: `System Security:`,
            details: `Continuous updates and security patches are applied to
protect against vulnerabilities.`,
          },
        ],
        paragraph: 'We implement strict measures to ensure data protection:',
      },
    ],
  },

  {
    heading: `Data Access`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details:
              'Access is restricted to authorized personnel based on their roles.',
          },
          {
            title: '',
            details: `Third-party providers, such as payment processors, are given access only when
necessary and under strict confidentiality agreements.
`,
          },
          {
            title: ``,
            details: `All access is monitored to ensure compliance with data protection protocols.`,
          },
        ],
        paragraph: 'We ensure limited and responsible access to data:',
      },
    ],
  },

  {
    heading: `Data Usage`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details: `Providing services, such as property matching, rent collection, and transaction
facilitation.`,
          },
          {
            title: '',
            details: `Communicating updates related to listings, inspections, or transactions.
`,
          },
          {
            title: ``,
            details: `Marketing, but only with explicit consent from data owners.`,
          },
        ],
        paragraph: 'Data is utilized solely for:',
      },
      {
        subListing: [
          {
            title: ``,
            details: `Data is never sold or shared with unauthorized third parties`,
          },
        ],
        paragraph: 'Prohibited Uses:',
      },
    ],
  },

  {
    heading: `Data Sharing`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details: `Data is shared only with trusted third parties under confidentiality agreements
(e.g., payment processors or legal service providers).`,
          },
          {
            title: '',
            details: `When possible, data is anonymized before sharing to safeguard privacy.`,
          },
        ],
        paragraph: '',
      },
    ],
  },

  {
    heading: `Data Retention and Disposal`,
    subData: [
      {
        subListing: [
          {
            title: 'Retention Period:',
            details: `Personal and transactional data is kept for up to five years or
as required by law.`,
          },
          {
            title: 'Secure Disposal:',
            details: `Digital data is deleted using certified data-wiping software and Physical records are securely shredded before disposal`,
          },
        ],
        paragraph: '',
      },
    ],
  },

  {
    heading: `Breach Management`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details: `All affected parties will be notified within 72 hours`,
          },
          {
            title: '',
            details: `Authorities will be informed as required by law`,
          },
          {
            title: '',
            details: `An internal review will be conducted, and measures will be implemented to prevent future breaches.`,
          },
        ],
        paragraph: 'In the event of a data breach:',
      },
    ],
  },

  {
    heading: `Data Owner Rights`,
    subData: [
      {
        subListing: [
          {
            title: 'Access:',
            details: `Request access to their personal data.`,
          },
          {
            title: 'Correction:',
            details: `Request corrections or updates to inaccurate data.`,
          },
          {
            title: 'Erasure:',
            details: `Request the deletion of personal data, subject to legal or contractual obligations.`,
          },
          {
            title: 'Restriction:',
            details: `Restrict how their data is processed.`,
          },
          {
            title: 'Objection:',
            details: `Object to specific types of data processing.`,
          },
          {
            title: 'Portability:',
            details: `Request a copy of their data in a machine-readable format.`,
          },
        ],
        paragraph:
          'All individuals whose data we process have the following rights:',
      },
    ],
  },

  {
    heading: `Monitoring and Compliance`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details: `Regular audits ensure adherence to this policy and compliance with data
protection regulations.`,
          },
          {
            title: '',
            details: `Non-compliance by employees or third-party providers will result in corrective
actions, including termination of agreements if necessary.`,
          },
        ],
        paragraph: 'In the event of a data breach:',
      },
    ],
  },

  {
    heading: `Policy Updates`,
    subData: [
      {
        subListing: [],
        paragraph: `This policy is reviewed regularly to reflect changes in regulations or company practices.
Updates will be posted on our website and will take effect immediately`,
      },
    ],
  },
];

const clientData: Data[] = [
  {
    heading: `Purpose`,
    subData: [
      {
        subListing: [],
        paragraph:
          'The purpose of this policy is to ensure that our clients receive the highest level of service, professionalism, and expertise from our team.',
      },
    ],
  },
  {
    heading: `Scope`,
    subData: [
      {
        subListing: [],
        paragraph:
          'This policy applies to all clients of Khabiteq Realty, including buyers, sellers, landlords, and tenants',
      },
    ],
  },

  {
    heading: `Client Engagement Principles`,
    subData: [
      {
        subListing: [
          {
            title: 'Professionalism:',
            details:
              'We will maintain the highest level of professionalism in all our interactions with clients.',
          },
          {
            title: 'Communication:',
            details: `We will communicate clearly, concisely, and regularly with clients, keeping them informed about the progress of their transactions.`,
          },
          {
            title: `Transparency:`,
            details: `: We will be transparent in all our dealings with clients, providing them with accurate and timely information about their transactions.`,
          },
          {
            title: `Respect:`,
            details: `We will treat all clients with respect and dignity, regardless of
their background, culture, or circumstances.`,
          },
          {
            title: `Confidentiality:`,
            details: ` We will maintain the confidentiality of all client information
and transactions`,
          },
        ],
        paragraph:
          'We are committed to the following client engagement principles:',
      },
    ],
  },

  {
    heading: `Client Engagement Process`,
    subData: [
      {
        subListing: [
          {
            title: 'Initial Consultation',
            details:
              'We will conduct an initial consultation with clients to understand their needs, goals, and expectations.',
          },
          {
            title: 'Needs Assessment',
            details: `Third-party providers, such as payment processors, are given access only when necessary and under strict confidentiality agreements.`,
          },
          {
            title: `Transaction Management`,
            details: `All access is monitored to ensure compliance with data protection protocols.`,
          },
          {
            title: `Communication`,
            details: `We will maintain regular communication with clients throughout the transaction process.`,
          },
          {
            title: `Post-Transaction Follow-up*`,
            details: `We will follow up with clients after the transaction is complete to ensure that they are satisfied with the service they received.`,
          },
        ],
        paragraph:
          'Our client engagement process includes the following steps:',
      },
    ],
  },

  {
    heading: `Client Feedback and Complaints`,
    subData: [
      {
        subListing: [],
        paragraph:
          'We value client feedback and complaints, and we will use them to improve our services and client engagement process. Clients can provide feedback and complaints through our website, email, or phone.',
      },
    ],
  },

  {
    heading: `Amendments to this Policy`,
    subData: [
      {
        subListing: [],
        paragraph:
          'We reserve the right to amend this policy at any time. Any changes will be posted on our website and will take effect immediately.',
      },
    ],
  },

  {
    heading: `Acceptance of this Policy`,
    subData: [
      {
        subListing: [],
        paragraph:
          'By engaging our services, clients acknowledge that they have read, understood, and accepted this Client Engagement Policy.',
      },
    ],
  },

  {
    heading: `Contact Us`,
    subData: [
      {
        subListing: [],
        paragraph:
          'If you have any questions or concerns about this policy, please contact us via email or call on our telephone lines',
      },
    ],
  },
];

const agentData: Data[] = [
  {
    heading: `Onboarding`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details:
              'All new agents must attend a comprehensive onboarding session, which will cover company policies, procedures, and expectations.',
          },
          {
            title: '',
            details:
              'New agents must complete all required training modules within the first 30 days of joining the company',
          },
        ],
        paragraph: '',
      },
    ],
  },
  {
    heading: `Licensing and Compliance`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details:
              'Agents must disclose any past or pending disciplinary actions against their license.',
          },
        ],
        paragraph: '',
      },
    ],
  },

  {
    heading: `Commission Structure`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details:
              'Khabiteq Realty will provide a clear and transparent commission structure to all agents.',
          },
          {
            title: '',
            details: `Agents will be entitled to a certain percentage of the commission earned on each transaction.`,
          },
          {
            title: `SALES`,
            details: ``,
            paragraph1: '- 5% of property value below 200 million.',
            paragraph2: '- 3% of property value above 200 million.',
            paragraph3:
              '- The commission is split equally between the agency (Khabiteq) and agent.',
          },
          {
            title: `JOINT VENTURES`,
            details: ``,
            paragraph1: '- 2.5% of the property value.',
          },
          {
            title: ``,
            details: `Commission payments will be made upon closing of transaction.`,
          },
        ],
        paragraph: '',
      },
    ],
  },

  {
    heading: `Client Relationships`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details:
              'Agents are expected to maintain professional relationships with clients and provide exceptional customer service.',
          },
          {
            title: '',
            details: `Agents must disclose any potential conflicts of interest or dual agency relationships to clients.`,
          },
          {
            title: ``,
            details: `Agents must comply with the company's client communication policies and procedures.`,
          },
        ],
        paragraph: '',
      },
    ],
  },

  {
    heading: `Code of Conduct`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details: `Agents must adhere to the company's code of conduct, which includes principles such as honesty, integrity, and respect for clients and colleagues.`,
          },
          {
            title: '',
            details: `Agents must report any violations of the code of conduct to the company's management.`,
          },
          {
            title: ``,
            details: `Agents who violate the code of conduct may be subject to disciplinary action, up to and including termination.`,
          },
        ],
        paragraph: '',
      },
    ],
  },

  {
    heading: `Termination`,
    subData: [
      {
        subListing: [
          {
            title: '',
            details: `Khabiteq Realty reserves the right to terminate an agent's contract at any time, with or without cause.`,
          },
          {
            title: '',
            details: `Agents who wish to terminate their contract must provide written notice to the company.`,
          },
          {
            title: ``,
            details: `Upon termination, agents must return all company property, includingmarketing materials and client lists.`,
          },
        ],
        paragraph: '',
      },
    ],
  },
];

export default Policies;
