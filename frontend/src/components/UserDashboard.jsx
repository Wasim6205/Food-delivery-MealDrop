import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard'
import { useNavigate } from 'react-router-dom'

const UserDashboard = () => {
  const navigate = useNavigate()
  const {currentCity,shopsInMyCity,itemsInMyCity,searchItems} = useSelector(state=>state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const [showLeftCateButton,setShowLeftCateButton] = useState(false)
  const [showRightCateButton,setShowRightCateButton] = useState(false)
  const [showLeftShopButton,setShowLeftShopButton] = useState(false)
  const [showRightShopButton,setShowRightShopButton] = useState(false)
  const [updatedItemsList,setUpdatedItemsList] = useState([])

  const handleFilterByCategory = (category) => {
    console.log(category)
    if(category=="All"){
      setUpdatedItemsList(itemsInMyCity)
    }else{
      const filteredList = itemsInMyCity?.filter(i=>i.category===category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(()=>{
    setUpdatedItemsList(itemsInMyCity)
  },[itemsInMyCity])

  const updateButton = (ref,setLeftButton,setRightButton) => {
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRightButton(element.scrollLeft+element.clientWidth < element.scrollWidth)
    }
  }
  const scrollHandler = (ref,direction) => {
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior:"smooth"
      })
    }
  } 

  useEffect(()=>{
    if(cateScrollRef?.current){
      updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
      cateScrollRef?.current?.addEventListener('scroll',()=>{
        updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      })
      shopScrollRef?.current?.addEventListener('scroll',()=>{
        updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
      })
    }
    return ()=> {cateScrollRef?.current?.removeEventListener("scroll",()=>{
      updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
    })
    shopScrollRef?.current?.removeEventListener("scroll",()=>{
      updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)
    })}
  },[categories,shopsInMyCity])

  
  return (
    <div className='w-screen min-h-screen bg-[#fff9f6] flex flex-col gap-5 items-center overflow-y-auto'>
      <Nav />

      {searchItems && searchItems.length>0 && (
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
          <h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>Search Results</h1>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.map((item)=>(
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}
      
      {/* Categories */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order</h1>
        <div className='w-full relative'>
          {showLeftCateButton && <button onClick={()=>scrollHandler(cateScrollRef,"left")} className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'>
            <FaCircleChevronLeft />
          </button>}
          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
            {categories?.map((cate,index)=>(
            <CategoryCard onClick={()=>handleFilterByCategory(cate.category)} image={cate.image} name={cate.category} key={index} />
          ))}
          </div>
          {showRightCateButton && <button onClick={()=>scrollHandler(cateScrollRef,"right")} className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'>
            <FaCircleChevronRight />
          </button>}
        </div>
      </div>

      {/* Shops In My City */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
          <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
          <div className='w-full relative'>
          {showLeftShopButton && <button onClick={()=>scrollHandler(shopScrollRef,"left")} className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'>
            <FaCircleChevronLeft />
          </button>}
          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
            {shopsInMyCity?.map((shop,index)=>(
            <CategoryCard name={shop?.name} image={shop?.image} key={index} onClick={()=>navigate(`/shop/${shop._id}`)} />
          ))}
          </div>
          {showRightShopButton && <button onClick={()=>scrollHandler(shopScrollRef,"right")} className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10'>
            <FaCircleChevronRight />
          </button>}
        </div>
      </div>

      {/* Food Items */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Suggested Food Items</h1>
        <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
          {updatedItemsList?.map((item,index)=>(
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default UserDashboard
