import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from "../store/authSlice"
import { Logo, Button, Input } from "./index"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {Loader} from './index'


function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setLoading(true)
        setError("")
        try {
            const userData = await fetch("https://blogify-sz1l.onrender.com/users/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            const user = await userData.json()
            // Store the refresh token in local storage
            localStorage.setItem('refreshToken', user.data.refreshToken);

            // Store the access token in local storage
            localStorage.setItem('accessToken', user.data.accessToken);
            console.log(user);
            if (user) {
                console.log(user)
                dispatch(authLogin(user.data.user))
                navigate("/all-posts")

            }

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div
            className='flex items-center justify-center md:min-h-[80vh]'
        >
    <div className={`mx-auto w-[85%] md:w-full md:max-w-[28rem]  rounded-xl p-5 md:p-10   border-2 border-[#33BBCF]`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-white/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-white/80 hover:text-white transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        {loading? 
                        <div className='w-full grid place-items-center'> <Loader></Loader></div>
                        :
                        <Button
                            type="submit"
                            className=" my-4 py-2 px-5 w-full text-black font-semibold button-custom rounded-xl shadow-lg   hover:cursor-pointer"
                        >Sign in</Button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login