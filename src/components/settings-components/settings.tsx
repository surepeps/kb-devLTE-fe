/** @format */

import React from 'react';
import Sidebar from './sidebar';
import Mainbar from './main-bar';

const Settings = () => {
  return (
    <section className='w-full flex justify-center flex-col'>
      <div className='container lg:w-[1180px] mt-[40px] flex justify-between overflow-hidden'>
        <Sidebar />
        <Mainbar />
      </div>
    </section>
  );
};

export default Settings;
