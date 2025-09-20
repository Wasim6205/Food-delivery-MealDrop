import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity } from '../redux/userSlice'

const useGetShopByCity = () => {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state=>state.user)
    // console.log("gomoh",currentCity);
    
  useEffect(() => {
    const fetchShops = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
            dispatch(setShopsInMyCity(result.data))
        } catch (error) {
            console.log(error);
        }
    }
    fetchShops()
  },[currentCity])
}

export default useGetShopByCity
