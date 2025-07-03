/** @format */

'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { archivo, manrope, ubuntu } from '@/styles/font';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons';
import ReactECharts from 'echarts-for-react';
import Select from 'react-select';
import { useFormik } from 'formik';
import Image from 'next/image';
import dummyImage from '@/svgs/dummyImage.svg';

export default function AnalysisOverview() {
  return (
    <motion.div className='mt-6 rounded-md bg-transparent w-full lg:max-w-[1128px] mr-2 overflow-hidden md:overflow-x-auto flex flex-col gap-[30px]'>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className='w-full md:h-[299px] grid lg:grid-cols-3 lg:grid-rows-2 gap-[20px] lg:gap-x-[30px] lg:gap-y-[20px]'>
        <TransactionCloseCard
          title={'Transaction close'}
          amount={30000900000.3}
          transactionClose={340}
          percentage={5.7}
          isPositive={true}
        />
        <RegularCard title='Total Briefs' amount={10000} />
        <TotalVisitorsAgentCard
          data={[
            { title: 'Total Visitors', amount: '1.5 Million' },
            { title: 'Total Agent', amount: '30,000k' },
          ]}
        />
        <PendingTransactionCard
          title='Pending  transaction'
          amount={300}
          percentage={3.7}
          isPositive={false}
        />
        <RegularCard title='Total Preference' amount={300} />
      </motion.div>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className='w-full flex gap-[30px] md:flex-row flex-col'>
        {/**Growth Trend */}
        <GrowthTrendChart />
        {/**Top Performance */}
        <TopPerformance />
      </motion.div>
      {/* <h1>Analysis Overview</h1> */}
    </motion.div>
  );
}

interface TransactionCloseProps {
  title: string;
  amount: number;
  percentage?: number;
  isPositive: boolean;
  transactionClose?: number;
}

const TransactionCloseCard = ({
  title,
  amount,
  percentage,
  transactionClose,
  isPositive,
}: TransactionCloseProps) => {
  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className='w-full border-[1px] border-[#0B423D] p-[20px] rounded-[4px] bg-[#F1FFF7] flex flex-col justify-between'>
      <div className='flex justify-between items-center border-b-[1px] border-[#E4DFDF] pb-[10px]'>
        <span
          className={`text-[#0B423D] text-base ${archivo.className} font-medium`}>
          {title}
        </span>
        <h2
          className={`text-[#181336] text-[30px] leading-[24px] tracking-[0.25px] font-semibold ${archivo.className}`}>
          {transactionClose}
        </h2>
      </div>
      <div className='flex items-end justify-between pt-[5px]'>
        <div className='flex flex-col'>
          <h4 className={`${archivo.className} text-sm text-[#181336]`}>
            Total Amount
          </h4>
          <h2
            className={`text-[#181336] font-semibold text-xl ${archivo.className}`}>
            {'N' + Number(amount).toLocaleString()}
          </h2>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon
              icon={isPositive ? faArrowUp : faArrowDown}
              className={`transform rotate-[60deg] transition-all duration-300`}
              size='xs'
              color={isPositive ? '#8DDB90' : '#DA1010'}
            />
            <span className={`text-[#2E2C34] text-sm ${manrope.className}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface PendingTransactionCardProps {
  title: string;
  amount: number;
  percentage?: number;
  isPositive: boolean;
}

const PendingTransactionCard = ({
  title,
  amount,
  isPositive,
  percentage,
}: PendingTransactionCardProps) => {
  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className='w-full border-[1px] border-[#F49209] p-[20px] rounded-[4px] bg-[#FFF4DB] flex flex-col justify-between'>
      <div className='flex justify-between items-center border-b-[1px] border-[#E4DFDF] pb-[10px]'>
        <span
          className={`text-[#F49209] text-base ${archivo.className} font-medium`}>
          {title}
        </span>
      </div>
      <div className='flex items-end justify-between pt-[5px]'>
        <div className='flex'>
          <h2
            className={`text-[#181336] font-semibold text-xl ${archivo.className}`}>
            {Number(amount).toLocaleString()}
          </h2>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon
              icon={isPositive ? faArrowUp : faArrowDown}
              className='transform rotate-[60deg] transition-all duration-300'
              size='xs'
              color='#DA1010'
            />
            <span className={`text-[#2E2C34] text-sm ${manrope.className}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface RegularCardProps {
  title: string;
  amount: number;
  titleColor?: string; // Optional prop for title color
}

export const RegularCard = ({ title, amount, titleColor }: RegularCardProps) => {
  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className='w-full flex flex-col justify-between gap-[35px] py-[23px] px-[25px] rounded-[4px] bg-[#FFFFFF] border-[1px] boorder-[#E4DFDF]'>
      <h4
        className={`text-base ${archivo.className}`}
        style={{ color: titleColor || '#181336' }}>
        {title}
      </h4>
      <h2
        className={`text-[#181336] text-[30px] leading-[24px] font-semibold ${archivo.className} tracking-[0.25px]`}>
        {Number(amount).toLocaleString()}
      </h2>
    </motion.div>
  );
};

interface TotalVisitorsAgentCardProps {
  data: { title: string; amount: string }[];
}

const TotalVisitorsAgentCard = ({ data }: TotalVisitorsAgentCardProps) => {
  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className='w-full bg-[#FFFFFF] border-[1px] border-[#E4DFDF] rounded-[4px] py-[23px] px-[25px] flex gap-[10px]'>
      {data?.map((item: { title: string; amount: string }, idx: number) => (
        <div
          key={idx}
          className='w-1/2 h-full bg-[#F7F7F8] rounded-[5px] flex flex-col py-[20px] px-[15px] gap-[5px]'>
          <h3
            className={`text-sm text-[#181336] ${archivo.className} font-normal`}>
            {item.title}
          </h3>
          <h2
            className={`text-[#181336] text[20px] leading-[24px] tracking-[0.25px] font-semibold`}>
            {item.amount}
          </h2>
        </div>
      ))}
    </motion.div>
  );
};

//interface GrowthTrendChartProps {}

interface DataProps {
  month: string;
  brief: number;
  preference: number;
  open: number;
}

const GrowthTrendChart = () => {
  const [data, setData] = useState<DataProps[]>([]);
  const [graphDetails, setGraphDetails] = useState([
    { title: 'brief submitted', color: '#5542F6', amount: 200605 },
    {
      title: 'preference submitted',
      color: '#00A5FF',
      amount: 600,
    },
    {
      title: 'open transaction',
      color: '#FA699D',
      amount: 30,
    },
  ]);

  const formik = useFormik({
    initialValues: {
      selectedStat: {
        value: '1',
        label: 'Days',
      },
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    // Generate fake monthly data for the past year
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const generatedData = months.map((month) => ({
      month,
      brief: Math.floor(Math.random() * 5000) + 100000, // Simulating "brief submitted" data
      preference: Math.floor(Math.random() * 2000) + 70000, // Simulating "preference submitted" data
      open: Math.floor(Math.random() * 100) + 120000, // Simulating "open transaction" data
    }));

    setData(generatedData);
    setGraphDetails([
      {
        title: 'brief submitted',
        color: '#5542F6',
        amount: generatedData.reduce((acc, curr) => acc + curr.brief, 0),
      },
      {
        title: 'preference submitted',
        color: '#00A5FF',
        amount: generatedData.reduce((acc, curr) => acc + curr.preference, 0),
      },
      {
        title: 'open transaction',
        color: '#FA699D',
        amount: generatedData.reduce((acc, curr) => acc + curr.open, 0),
      },
    ]);
  }, []);

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month), // Show months on x-axis
      axisLabel: {
        rotate: 0, // Keep horizontal for better visibility
      },
    },
    yAxis: {
      type: 'value',
    },
    // grid: {
    //   // left: '10%',
    //   // right: '10%',
    //   // bottom: '10%',
    //   // top: '15%',
    //   containLabel: true, // Prevents compression of labels
    // },
    series: [
      {
        name: 'Brief Submitted',
        data: data.map((d) => d.brief),
        type: 'line',
        smooth: true,
        itemStyle: { color: '#5542F6' }, // Blue color
      },
      {
        name: 'Preference Submitted',
        data: data.map((d) => d.preference),
        type: 'line',
        smooth: true,
        itemStyle: { color: '#00A5FF' }, // Light Blue color
      },
      {
        name: 'Open Transaction',
        data: data.map((d) => d.open),
        type: 'line',
        smooth: true,
        itemStyle: { color: '#FA699D' }, // Pink color
      },
    ],
  };

  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className='lg:w-[746px] w-full h-full bg-[#FFFFFF] border-[1px] border-[#E4DFDF] rounded-[4px] flex flex-col gap-[20px] p-[20px]'>
      <div className='w-full h-[55px] flex md:flex-row flex-col gap-[10px] justify-between'>
        <div className='flex flex-col gap-[4px]'>
          <h2
            className={`${manrope.className} font-semibold text-base text-[#2E2C34]`}>
            Growth trends
          </h2>
          <p
            className={`text-[12px] leading-[18px] text-[#84818A] font-medium ${manrope.className}`}>
            Audience to which the users lorem ipsum dolor sit amet
          </p>
        </div>
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
              width: '124px',
              //options background color
              // '&:hover': {
              //   borderColor: '#D6DDEB',
              //   backgroundColor: '#F9FAFB',
              // },
            }),
            // indicatorSeparator: (styles) => ({ display: 'none' }),
          }}
          options={statsOptions}
          defaultValue={statsOptions}
          value={formik.values.selectedStat}
          onChange={(options) => {
            formik.setFieldValue('selectedStat', options);
          }}
        />
      </div>
      <div className='flex flex-col md:gap-[10px]'>
        <div
          style={{
            width: '100%',
          }}
          className='h-[300px] md:h-[320px]'>
          <ReactECharts
            option={option}
            className='w-full'
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className='flex flex-wrap gap-[20px]'>
          {[
            graphDetails.map(
              (item: { title: string; color: string; amount: number }, idx) => (
                <div key={idx} className='flex items-start justify-start gap-1'>
                  <FontAwesomeIcon
                    icon={faDotCircle}
                    width={15}
                    height={15}
                    className='w-[10px] h-[10px]'
                    color={item.color}
                  />
                  <div className='flex flex-col'>
                    <h3
                      className={`text-[#84818A] text-[12px] leading-[16px] tracking-[0.15px] ${manrope.className}`}>
                      {item.title}
                    </h3>
                    <h2 className='text-[#2E2C34] text-base font-bold'>
                      {Number(item.amount).toLocaleString()}
                    </h2>
                  </div>
                </div>
              )
            ),
          ]}
        </div>
      </div>
    </motion.div>
  );
};

const TopPerformance = () => {
  const formik = useFormik({
    initialValues: {
      selectedTopPerformance: {
        value: '1',
        label: 'Days',
      },
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      className={`lg:w-[352px] w-full border-[E4DFDF] border-[1px] h-fit bg-[#FFFFFF] p-[20px] flex flex-col gap-[20px] rounded-[4px]`}>
      <div className='flex justify-between items-center'>
        <h2
          className={`${manrope.className} font-semibold text-sm text-[#2E2C34]`}>
          Top performance
        </h2>
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
              width: '124px',
              //options background color
              // '&:hover': {
              //   borderColor: '#D6DDEB',
              //   backgroundColor: '#F9FAFB',
              // },
            }),
            // indicatorSeparator: (styles) => ({ display: 'none' }),
          }}
          options={topPerformanceOptions}
          defaultValue={topPerformanceOptions}
          value={formik.values.selectedTopPerformance}
          onChange={(options) => {
            formik.setFieldValue('selectedTopPerformance', options);
          }}
        />
      </div>
      <div className='w-full flex flex-col gap-[20px]'>
        <div className='flex justify-between pb-[10px] border-b-[1px] border-[#EBEAED]'>
          {['Agent', 'Brief', 'Transaction'].map((item: string, idx) => (
            <span
              key={idx}
              className={`${manrope.className} text-[12px] leading-[18px] font-semibold text-[#84818A]`}>
              {item}
            </span>
          ))}
        </div>
        <div className='flex flex-col gap-[12px]'>
          {topPerformanceData.map((item, idx) => (
            <div key={idx} className='flex justify-between'>
              <div className='flex items-center gap-1'>
                <Image
                  src={dummyImage}
                  width={16}
                  height={16}
                  alt=''
                  className='w-[16px] h-[16px]'
                />
                <h2 className={`${ubuntu.className} text-xs text-[#000000]`}>
                  {item.agent}
                </h2>
              </div>
              <h3
                className={`text-[#2E2C34] text-xs font-medium ${ubuntu.className}`}>
                {Number(item.brief).toLocaleString()}
              </h3>
              <h3
                className={`text-[#2E2C34] ${ubuntu.className} text-xs font-medium`}>
                N{Number(item.transaction).toLocaleString()}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const statsOptions = [
  { value: '1', label: 'Days' },
  { value: '2', label: 'Weeks' },
  { value: '3', label: 'Months' },
  { value: '4', label: 'Years' },
];

const topPerformanceOptions = [
  { value: '1', label: 'Deals Close' },
  { value: '2', label: 'Revenue' },
  { value: '3', label: 'Conversion Rate' },
  { value: '4', label: 'Profit' },
];

const topPerformanceData = [
  {
    agent: 'Wale Tunde',
    brief: 12202,
    transaction: 1000000000,
  },
  {
    agent: 'Bola Akin',
    brief: 8765,
    transaction: 30000000034,
  },
  {
    agent: 'Chinwe Okafor',
    brief: 9876,
    transaction: 9500000000,
  },
  {
    agent: 'Emeka Ibrahim',
    brief: 11234,
    transaction: 10200000000,
  },
];
