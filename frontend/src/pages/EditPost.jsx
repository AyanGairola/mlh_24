import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, PostForm } from '../Components'

function EditPost() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (slug) {
            (async () => {
                const data = await fetch("https://blogify-sz1l.onrender.com/blogs/" + slug, {
                    method: "POST",
                    body:JSON.stringify({
                        refreshToken:localStorage.getItem("refreshToken"),
                        accessToken: localStorage.getItem("accessToken")
                      }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }

                })
                const postData = await data.json()
                if (postData.data) {
                    setPost({ ...postData.data._doc})
                    console.log(postData)
                } else navigate("/")
            }) ()
        } else navigate("/");
    }, [slug, navigate])

    return post ? (
        <div className='py-8'>
            <div><h1 className=' text-[2rem] md:text-[2.5rem] text-center font-semibold' >Edit Post</h1></div>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost