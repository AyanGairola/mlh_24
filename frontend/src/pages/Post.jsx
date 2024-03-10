import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../Components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData._id : false;

    useEffect(() => {
        if (slug) {
            (async () => {
                const data = await fetch("http://localhost:8000/blogs/" + slug, {
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
    }, [slug, navigate]);

    const deletePost = async () => {
        const data = await fetch("http://localhost:8000/blogs/" + post._id, {
            method: "DELETE",
            body:JSON.stringify({
                refreshToken:localStorage.getItem("refreshToken"),
                accessToken: localStorage.getItem("accessToken")
                }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        })
        navigate("/")
    };

    return post ? (
        <div className="py-8 flex justify-center">
            <div className="max-w-[57rem]">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl max-h-80">
                    <img
                        src={post.imageURL}
                        alt={post.title}
                        className="rounded-xl object-cover"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Button bgColor="bg-red-500" className="rounded-lg" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css text-justify leading-relaxed">
                    {parse(String(post.content))}
                    </div>
            </Container>
            </div>
        </div>
    ) : null;
}