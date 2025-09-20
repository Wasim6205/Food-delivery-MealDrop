import axios from 'axios'
import React, { useState } from 'react'
import {IoIosArrowRoundBack} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../App'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [step,setStep] = useState(1)
    const [email,setEmail] = useState("")
    const [otp,setOtp] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [err,setErr] = useState("")

    const handleSendOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
            console.log(result.data)
            setLoading(false)
            setErr("")
            setStep(2)
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }
    }
    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
            console.log(result.data)
            setLoading(false)
            setErr("")
            setStep(3)
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }
    }
    const handleResetPassword = async () => {
        setLoading(true)
        if(newPassword !== confirmPassword){
            return setErr("Password and Confirm Password must be same")
        }
        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword},{withCredentials:true})
            console.log(result?.data)
            setLoading(false)
            setErr("")
            navigate('/signin')
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }
    }
    
  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center gap-4 mb-4'>
            <IoIosArrowRoundBack onClick={()=>navigate('/signin')} size={30} className='text-[#ff4d2d] cursor-pointer' />
            <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>

        {step==1 && <div className=''>
            <div className='mb-6'>
                <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} required type="email" id='email' className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Email' />
            </div>
            <button onClick={handleSendOtp} className={`w-full mt-4 flex items-center justify-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Send Otp"}</button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
        </div>}

        {step==2 && <div className=''>
            <div className='mb-6'>
                <label htmlFor="otp" className='block text-gray-700 font-medium mb-1'>OTP</label>
                <input onChange={(e)=>setOtp(e.target.value)} value={otp} required type="text" id='otp' className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter OTP' />
            </div>
            <button onClick={handleVerifyOtp} className={`w-full mt-4 flex items-center justify-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Verify"}</button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
        </div>}

        {step==3 && <div className=''>
            <div className='mb-6'>
                <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                <input onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} required type="text" id='newPassword' className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter New Password' />
            </div>
            <div className='mb-6'>
                <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                <input onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword} required type="text" id='confirmPassword' className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Confirm Password' />
            </div>
            <button onClick={handleResetPassword} className={`w-full mt-4 flex items-center justify-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Reset Password"}</button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
        </div>}
        
      </div>
    </div>
  )
}

export default ForgotPassword
