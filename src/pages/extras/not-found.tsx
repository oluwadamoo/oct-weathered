import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate()
    return (
        <div className='not-found'>
            <h3>404</h3>
            <p>Sorry, we were unable to find that page</p>

            <button
                onClick={() => navigate('/')}
                className='btn'
            ><FaArrowLeft /> Go home</button>
        </div>
    )
}

export default NotFound