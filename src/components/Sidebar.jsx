import React, {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
// ===================================
import {logo,sun} from '../assets';
import {navlinks} from '../constants';

// ===================================


//Icon takes various props which are passed to it from the navlinks in the constants folder.It then defines CSS properties to it like if the button is active and the current button that is active is same as this one it gives it a background and if it is not disabled it has a cursor pointer
const Icon =({styles,name,imgUrl,isActive,disabled,handleClick}) =>(
<div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive===name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
  {!isActive ? ( //this will be read as "if !isActive is false then do ... else do .... (basically if the button is active then do ... else ....)"
    <img src={imgUrl} alt="fund_Logo" className="w-1/2 h-1/2"/> //if the button is active the img of logo will load with colour
  ):(
    <img src={imgUrl} alt="fund_Logo" className={`w-1/2 h-1/2 ${isActive !==name && 'grayscale'}`}/>//if the button is not active then it will turn grayscale
  )}

</div>
)


const Sidebar = () => {
  
  const Navigate = useNavigate();
  const [isActive, setIsActive]=useState('dashboard');
  
  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]"> 
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo}/> 
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-y-3">
          {navlinks.map((Link)=>(
            <Icon //.map() function to iterate over an array of objects called navlinks. For each object in the array, it is rendering an <Icon /> component with several props being passed down as spread attributes.
            key={Link.name} //key is the unique identifier of each object which in this case is the name of the object  in navlinks
            {...Link} //all the properties of the Link object as props to the <Icon /> component.
            isActive={isActive} //isActive is passed to the Icon component as parameter
            handleClick={()=>{ //On the Link object being clicked if the button is not disabled it is set as the new isActive button and navigate function takes us to the link of 'Link' object
              if(!Link.disabled){
                setIsActive(Link.name);
                Navigate(Link.link);
              } 
            }}
            />
          ))}
        </div>
        
        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} handleClick={()=>{
          alert("I'm still working on the theme feature 😅");
        }}/> 
        
      </div>
    </div>
  )
}

export default Sidebar