import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity, setShopsInMyCity } from '../redux/userSlice'

const useGetItemsByCity = () => {
    const dispatch = useDispatch()
    const {currentCity,itemsInMyCity} = useSelector(state=>state.user)
  useEffect(() => {
    const fetchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
            dispatch(setItemsInMyCity(result.data.items))
        } catch (error) {
            console.log(error);
        }
    }
    fetchItems()
  },[currentCity])
}

export default useGetItemsByCity
