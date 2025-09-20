import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { FaUtensils } from 'react-icons/fa6'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { setMyShopData } from '../redux/ownerSlice'
import { ClipLoader } from 'react-spinners'

const EditItem = () => {
    const {itemId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [currentItem,setCurrentItem] = useState(null)
    
    const [name,setName] = useState("")
    const [price,setPrice] = useState(0)
    const [frontendImage,setFrontendImage] = useState(null)
    const [backendImage,setBackendImage] = useState(null)
    const [category,setCategory] = useState("")
    const [foodType,setFoodType] = useState("veg")
    const categories = ["Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others"]
    const [loading,setLoading] = useState(false)
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData
            formData.append("name",name)
            formData.append("category",category)
            formData.append("foodType",foodType)
            formData.append("price",price)
            if(backendImage){
                formData.append("image",backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`,formData,{withCredentials:true})
            dispatch(setMyShopData(result.data))
            setLoading(false)
            console.log(result.data)
        } catch (error) {
            setLoading(false)
            console.log(error.response.data)
        }
    }

    useEffect(()=>{
        const handleGetItemById = async ()=>{
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`,{withCredentials:true})
                setCurrentItem(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        handleGetItemById()
    },[itemId])

    useEffect(()=>{
        setName(currentItem?.name || "")
        setPrice(currentItem?.price || 0)
        setCategory(currentItem?.category || "")
        setFoodType(currentItem?.foodType || "veg")
        setFrontendImage(currentItem?.image || null)
    },[currentItem])
    
  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
      <div onClick={()=>navigate('/')} className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d] cursor-pointer' />
      </div>

      <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
        <div className='flex flex-col items-center mb-6'>
            <div className='bg-orange-100 p-4 rounded-full mb-4'>
                <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
            </div>
            <div className='text-3xl font-extrabold text-gray-900'>
                Edit Food
            </div>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' placeholder='Enter Shop Name' />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                <input onChange={handleImage} type="file" className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' accept='image/*'/>
                {frontendImage &&
                <div className='mt-4'>
                    <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg border' />
                </div>}
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                <input onChange={(e)=>setPrice(e.target.value)} value={price} type="number" className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500' placeholder='0' />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                <select onChange={(e)=>setCategory(e.target.value)} value={category} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'>
                    <option value="">Select Category</option>
                    {categories.map((cate,index)=>(
                        <option key={index} value={cate}>{cate}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type</label>
                <select onChange={(e)=>setFoodType(e.target.value)} value={foodType} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'>
                        <option value="veg">veg</option>
                        <option value="non veg">non veg</option>
                </select>
            </div>
            <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200' disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Save"}</button>
        </form>
      </div>

    </div>
  )
}

export default EditItem
