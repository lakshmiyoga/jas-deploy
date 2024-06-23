import React, { useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'

const Search = ({keyword, setKeyword}) => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const searchHandler = (e) => {
        e.preventDefault();
        // navigate(`/search/${keyword}`)

    }

    const clearKeyword = () =>{
        setKeyword("")
    }

    useEffect(()=>{
        if(location.pathname === '/') {
            clearKeyword();
        }
    },[location])

    return (
        <form onSubmit={searchHandler} className="search-form">
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    onChange={(e) => { setKeyword(e.target.value) }}
                    value={keyword}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>

            </div>
        </form>
        
    )
}

export default Search
