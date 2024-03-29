import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {Logo, Input, Button, Loader} from "./index"

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const create = async (data) => {
        setError("")
        setLoading(true)

        try {
            const formData = new FormData();
            formData.append("username", data.name)
            formData.append("password", data.password)
            formData.append("email", data.email)
            formData.append("dp", data.image[0])
            const userData = await fetch("https://blogify-sz1l.onrender.com/users/register", {
                method: "POST",
                body: formData
            })
            const user = await userData.json()
            if (user) {
                console.log(user)
                dispatch(login(user.data));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex items-center justify-center md:min-h-[80vh]">
            <div className={`mx-auto w-[85%] md:w-full md:max-w-[28rem]  rounded-xl p-5 md:p-10   border-2 border-[#33BBCF]`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-white/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-white/80 hover:text-white transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
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
                        <Input
                            label="Profile Picture"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: true })}
                        />
                        {loading? 
                        <div className='w-full grid place-items-center'> <Loader></Loader></div>
                        :
                        <Button type="submit"
                        className=" py-2 px-5 w-full text-black font-semibold button-custom rounded-xl shadow-lg   hover:cursor-pointer"
                        >
                            Create Account
                        </Button>}
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Signup