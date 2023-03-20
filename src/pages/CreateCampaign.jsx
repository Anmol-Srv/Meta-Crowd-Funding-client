import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

//====================================================================================================================================
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, Formfield, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const {createCampaign} = useStateContext(); 

    const [form, setForm] = useState({
      name:'',
      title:'',
      description:'',
      target:0,
      deadline:0,
      image:''
    });
    
    const handleFormField = (fieldName, e) => {
      setForm({ ...form, [fieldName]: e.target.value })
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      checkIfImage(form.image, async (exists) => {
        if (exists) {
          setIsLoading(true);
    
          // Convert the deadline date to a Unix timestamp in seconds
          // const deadline = Math.floor(new Date(form.deadline).getTime() / 1000);
          const deadline = Math.floor(Date.parse(form.deadline));
    
          // Convert the target amount to a BigNumber in wei
          const target = ethers.utils.parseEther(form.target);
    
          await createCampaign({ ...form, target, deadline });
          setIsLoading(false);
          Navigate('/');
        } else {
          alert("Please provide a valid Url ");
          setForm({...form, image:''})
        }
      });
    };
    
  
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader/>}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] ">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <Formfield
            LabelName="Your Full Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormField('name', e)}
          />
          <Formfield
            LabelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormField('title', e)}
          />
        </div>

        <Formfield
          LabelName="Story *"
          placeholder="Write your story "
          isTextArea
          inputType="text"
          value={form.description}
          handleChange={(e) => handleFormField('description', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white m1-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <Formfield
            LabelName="Goal *"
            placeholder="ETH 0.50"
            inputType="number"
            value={form.target}
            handleChange={(e) => handleFormField('target', e)}
          />
          <Formfield
            LabelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            // value={stringdeadline}
            handleChange={(e) => handleFormField('deadline', e)}
          />
        </div>

        <Formfield
          LabelName="Campaign Banner *"
          placeholder="Place Image Url for your campaign banner"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormField('image', e)}
        />

        <div className="flex justify-center items-center mt=[40px]">
          <CustomButton
            btnType="submit"
            title="Submit New Campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign