import axios from 'axios';
import React from 'react'
import { serverUrl } from '../App';
import { setShopData } from '../Redux/owner.slice';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const OwnerItemcard = ({ data }) => {
 const navigate = useNavigate()
const dispatch = useDispatch()
const handleDelete = async () => {
    try {
        const result = await axios.delete(`${serverUrl}/api/item/delete-item/${data._id}`,
            { withCredentials: true })
        dispatch(setShopData(result.data))
    } catch (error) {
        console.log(error)
    }
}

    return (
        <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl'>
            
            {/* Image Section */}
            <div className='w-36 h-full flex-shrink-0 bg-gray-50'>
                <img src={data.image} alt={data.name} className='w-full h-full object-cover'/>
            </div>
            
            {/* Details and Actions Section */}
            <div className='flex flex-col justify-between p-3 flex-1'>
                
                {/* Top Details (Name, Category, Food Type) */}
                <div>
                    <h2 className='text-base font-semibold text-[#ff4d2d]'>{data.name}</h2>
                    <p>Category: <span className='font-medium text-gray-70'>{data.category}</span></p>
                    <p>Food Type: <span className='font-medium text-gray-70'>{data.foodType}</span></p>
                </div>
                
                {/* Bottom Section (Price and Action Buttons) */}
                <div className='flex items-center justify-between'>
                    
                    
                    <div className='text-[#ff4d2d] font-bold'>{data.price}</div>
                    
                   
                    <div className='flex items-center gap-2'>
                        
                        {/* Edit Button */}
                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]' onClick={() => navigate(`/edititem/${data._id}`)}>
                            <FaPen size={16}/>
                        </div>
                        
                        {/* Delete Button */}
                        <div  className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                            {/* FaTrashAlt is assumed to be an imported icon component */}
                            <FaTrashAlt size={16} onClick={handleDelete}/>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerItemcard;
