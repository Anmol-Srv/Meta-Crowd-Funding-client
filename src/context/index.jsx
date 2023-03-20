import React, { useContext, createContext,useEffect } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite, useDisconnect } from '@thirdweb-dev/react'; // import hooks for interacting with ThirdWeb
import { ethers } from 'ethers'; // import ethers.js library
import { createCampaign } from '../assets'; // import function to create new campaign
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk'; // import schema for campaign data

// create context to manage the state of the contract
const StateContext = createContext();

// component that wraps the app and provides the context to all its children
export const StateContextProvider = ({ children }) => {
  // useContract hook to connect to the deployed contract
  const { contract } = useContract('0x1D0673C5Aa0B437F5aa4eB7C4028bA4b53E70742');

  // useContractWrite hook to create a function that writes to the contract
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  // useAddress hook to get the address of the connected wallet
  const address = useAddress();

  // useMetamask hook to interact with the MetaMask wallet
  const connect = useMetamask();
  const disconnect = useDisconnect();

  // function that publishes a new campaign on the blockchain
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // address of the campaign owner
        form.title, // title of the campaign
        form.description, // description of the campaign
        form.target, // fundraising target for the campaign
        form.deadline, // deadline for the campaign
        form.image, // image for the campaign
      ]);

      console.log('Contract call Success', data);
    } catch (error) {
      console.log('Contract Call failure', error);
    }
  };

  // function that fetches all the campaigns published on the contract
  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    // format the result into a presentable format
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pid: i,
    }));

    // console.log(parsedCampaigns);
    return parsedCampaigns;
  };
  const userCampaigns = async () => {
    const campaigns = await getCampaigns();
    const usercampaigns=campaigns.filter((campaign)=>campaign.owner === address)
    // console.log(usercampaigns);
    return usercampaigns;
  };

  const donate =async(pid,amount)=>{
    const data=await contract.call('donateToCampaign',pid,{value:ethers.utils.parseEther(amount)});
    return data;
  }

  const getDonation=async(pid)=>{
    const donations=await contract.call('getDonators',pid);
    const numberOfDonation = donations[0].length;

    const parsedDonation=[];

    for(let i=0;i<numberOfDonation;i++)
    {
      parsedDonation.push({
        donator:donations[0][i],
        donation:ethers.utils.formatEther(donations[1][i].toString())
      })
    }
    return parsedDonation;
  }


  const deleteCampaign = async (pid) => {
    try {
      const data = await contract.call('deleteCampaign', pid);
      console.log('Campaign deleted', data);
    } catch (error) {
      console.log('Campaign deletion failed', error);
    }
  };

  // function that checks if any campaigns' deadlines have passed and deletes them if necessary
  const checkCampaignDeadlines = async () => {
    const campaigns = await getCampaigns();

    campaigns.forEach(async (campaign) => {
      if (campaign.deadline < Date.now() / 1000) {
        await deleteCampaign(campaign.pid);
      }
    });
  };

  useEffect(() => {
    const intervalId = setInterval(checkCampaignDeadlines, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // provide the context to all children components
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        createCampaign: publishCampaign,
        getCampaigns,
        userCampaigns,
        donate,
        getDonation
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// custom hook to access the context in any component
export const useStateContext = () => useContext(StateContext);
