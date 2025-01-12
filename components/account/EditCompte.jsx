'use client'
import React, { useState } from 'react';
import UpdateAdresse from './UpdateAdresse';
import Updatepassword from './Updatepassword';

const EditCompte = () => {


  return (
    <div className="w-full flex md:flex-row flex-col gap-5">
      <UpdateAdresse />
      <Updatepassword />

    </div>
  );
};

export default EditCompte;