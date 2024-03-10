import React, { useCallback, useEffect, useState } from 'react'
import { RTE, Button, Input, Select, Loader } from "../index"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {

    const { register, handleSubmit, watch, setValue, getValues, control } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const [loading, setLoading] = useState(false)

    const submit = async (data) => {
        setLoading(true)
        if (post) {
            const blogData = await fetch("https://blogify-sz1l.onrender.com/blogs/" + post._id, {
                method: "PATCH",
                body: JSON.stringify({
                    content: data.content,
                    accessToken: localStorage.getItem("accessToken"),
                    refreshToken: localStorage.getItem("refreshToken")
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            const blog = await blogData.json()
            console.log(blog)
            if (blog) {
                navigate(`/post/${blog.data._id}`)
                setLoading(false)
            }
        } else {
            
            const formData = new FormData()
            formData.append("image", data.image[0])
            const image = await fetch("https://blogify-sz1l.onrender.com/images/upload-image", {
                method: "POST",
                body: formData
            })
            const imageURL = await image.json()
            const blogData = await fetch("https://blogify-sz1l.onrender.com/blogs/", {
                method: "POST",
                body: JSON.stringify({
                    title: data.title,
                    content: data.content,
                    imageId: imageURL.data._id,
                    accessToken: localStorage.getItem("accessToken"),
                    refreshToken: localStorage.getItem("refreshToken")
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            const blog = await blogData.json()
            console.log(blog)
            if (blog) {
                navigate(`/post/${blog.data._id}`)
                setLoading(false)
            }

        }
    }
    
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";

    }, [])

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-full lg:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={post.imageURL}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                {loading? 
                    <div className='w-full grid place-items-center'> <Loader></Loader></div>
                    :
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className= {` ${post? "  hover:shadow-green-500 " : " hover:shadow-[#5ce1e6] cyan-button"} text-black shadow-sm hover:cursor-pointer duration-200 hover:drop-shadow-2xl rounded-lg w-full`} >
                    {post ? "Update" : "Submit"}
                </Button>}
            </div>
        </form>
    )
}

export default PostForm