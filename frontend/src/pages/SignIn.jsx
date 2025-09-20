import React from 'react'
import { useState } from 'react';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa'
import {FcGoogle} from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const SignIn = () => {
    const navigate = useNavigate()
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const secondaryColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "ddd";

    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);

    const [err,setErr] = useState("")

    const handleSignin = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`,{email,password},{withCredentials:true})
            dispatch(setUserData(result.data))
            setLoading(false)
            setErr("")
        } catch (error) {
            setLoading(false)
            setErr(error?.response?.data?.message)
        }
    }

    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth,provider)
        try {
            const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`,{email:result?.user?.email},{withCredentials:true})
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{backgroundColor: bgColor}}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md px-8 py-6 border-[1px]`} style={{border: `1px solid ${borderColor}`}}>
        <h1 className={`text-3xl font-bold mb-2`} style={{color:primaryColor}}>MealDrop</h1>
        <p className='text-gray-600 mb-4'>Sign in to your account to get started with delicious food deliveries</p>

        {/* Email */}
        <div className='mb-4'>
            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} required type="email" id='email' className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Email' style={{border: `1px solid ${borderColor}`}} />
        </div>
        {/* Password */}
        <div className='mb-4'>
            <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
            <div className='relative'>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type={showPassword ? "text" : "password"} id='password' className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Password' style={{border: `1px solid ${borderColor}`}} />
                <button onClick={()=>setShowPassword(prev=>!prev)} required className='absolute cursor-pointer right-3 top-[14px] text-gray-500'>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
            </div>
        </div>
        <div onClick={()=>navigate('/forgot-password')} className='text-right text-[#ff4d2d] mb-4 cursor-pointer'>Forgot Password</div>
        <button onClick={handleSignin} className={`w-full mt-4 flex items-center justify-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Sign In"}</button>
        {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}

        <div className='flex items-center mt-4 gap-2'>
                <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center'>or continue</div>
                <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            </div>

        <button onClick={handleGoogleAuth} className='w-full mt-4 flex items-center justify-center gap-2 cursor-pointer border border-gray-400 rounded-lg px-4 py-2 transition duration-200 hover:bg-gray-100'>
            <FcGoogle size={20} />
            <span>Sign in with Google</span>
        </button>
        <p className='text-center mt-4'>Don't have an account? <Link to={'/signup'} className='text-[#ff4d2d]'>Sign Up</Link></p>
      </div>
    </div>
  )
}

export default SignIn
