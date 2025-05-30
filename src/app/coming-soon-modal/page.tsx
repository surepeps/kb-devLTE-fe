/** @format */
'use client';
import PopUpModal from '@/components/pop-up-modal-reusability';
import React from 'react';

function getNextSunday4pmTimestamp() {
  const now = new Date();

  const today = now.getDay();
  const isBefore4pmToday = today === 0 && now.getHours() < 16;

  const daysUntilSunday = isBefore4pmToday ? 0 : (7 - today) % 7;

  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(16, 0, 0, 0);

  return target.getTime();
}

const formatTime = (ms: number) => {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    const targetTimestamp = getNextSunday4pmTimestamp();

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = targetTimestamp - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const time = formatTime(timeLeft);
  return (
    <PopUpModal>
      <div className='w-full lg:w-[724px] py-[39px] px-[36px] bg-[#FFFFFF]'>
        <div className='w-full flex flex-col gap-[17px] items-center justify-center'>
          <h2 className='font-bold font-display text-xl md:text-2xl text-[#09391C] text-center'>
            WE ARE{' '}
            <span className='font-bold font-display text-xl md:text-2xl text-[#8DDB90]'>
              COMING SOON
            </span>
          </h2>
          <div className='flex gap-[7px] md:gap-[14px] min-h-[70px] md:min-h-[101px]'>
            {/**Day */}
            <Timer value={time.days} text={time.days === 1 ? 'Day' : 'Days'} />
            {/**Hour */}
            <Timer
              value={time.hours}
              text={time.hours === 1 ? 'Hour' : 'Hours'}
            />
            {/**Minute */}
            <Timer
              value={time.minutes}
              text={time.minutes === 1 ? 'Minute' : 'Minutes'}
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h3 className='font-display text-[#000000] font-semibold text-sm md:text-base text-center'>
              Launching June 1, 2025
            </h3>
            <p className='text-[#000000] text-sm md:text-base text-center'>
              {' '}
              Built for real estate agents, landlords, tenants and investors for
              control and transparency.
            </p>
          </div>
        </div>
      </div>
    </PopUpModal>
  );
};

const Timer = ({
  value,
  text,
}: {
  value?: number;
  text?: 'Days' | 'Hours' | 'Minutes' | 'Day' | 'Hour' | 'Minute';
}) => {
  return (
    <div className='h-full w-[70px] flex flex-col gap-[6px]'>
      <div className='bg-[#EDFDED] flex items-center justify-center h-[55px] md:h-[73px] border-[1px] border-[#EEF1F1]'>
        <h4 className='font-display text-black font-semibold text-2xl'>
          {value}
        </h4>
      </div>
      <span className='text-sm text-[#1E1E1E] text-center'>{text}</span>
    </div>
  );
};

export default Countdown;
