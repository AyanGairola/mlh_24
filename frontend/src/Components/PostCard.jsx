import React from 'react'
import { Link } from 'react-router-dom'


function PostCard({
    _id,
    title,
    image,
    imageURL
}) {
  return (
    <Link to={`/post/${_id}`}>
        <div className='w-full card-hover rounded-xl p-4 h-full '>
            <div className='w-full justify-center mb-4 h-[80%] '>
                <img src={imageURL} alt={title} className='rounded-xl h-full object-cover' />
            </div>
            <h2 className='text-xl font-bold' >{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard