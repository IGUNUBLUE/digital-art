/*eslint-disable*/
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';
import { Link } from "react-router-dom";
import { deleteUserWhislist } from '../../../redux/actions/actionWishlist'
import "../../../scss/components/_userLibrary.scss";
import "../../../scss/components/_userWishlist.scss";


export default function Wishlist() {

    const dispatch = useDispatch();

    const wishlistUser = useSelector((store) => store.reducerWishlist.wishlist); 

    const openPreview = (e, image) => {
        e.preventDefault()
        setPreview(image)

    }

    const deleteProduct = e => {

        let body ={
            userId: wishlistUser.userId,
            productId: e,
        }
        
        if(body.userId && body.productId){
            dispatch( deleteUserWhislist( body) )
        }
    }

    return (
        <>
        <div className="profile-body-wishlist ">
            <div className="title">
                <h1>My Wishlist</h1>
            </div>
            <hr className="divisor" />
            <div className="tableheader tableheader-wishlist">
                <div className="libraryPreviewTitle-wishlist previewTitle-wishlist"><h4>Preview</h4></div>
                <div className="libraryPreviewTitle-wishlist nameTitle-wishlist"><h4>Name</h4></div>
                <div className="libraryPreviewTitle-wishlist price-wishlist"><h4>Price</h4></div>
                <div className="libraryPreviewTitle-wishlist toBuy-wishlist"><h4>To Buy / Detail</h4></div>                 
            </div>
            <div className="myProductsResults">
                {wishlistUser.length !== 0 &&
                    wishlistUser.products.map((product) => (
                        <>
                            <div className="libraryPreview-wishlist" >
                                <div className="divImage-wishlist">
                                    <img className="myProductsImage" src={product.preview} alt="" onClick={(e) => openPreview(e, product.preview)}/>                                    
                                </div>                               
                                <div className="libraryProductName-wishlist">
                                    <h4> {product.name}</h4>
                                </div>
                                <div className="libraryProductPrice-wishlist">
                                    <h4> ${product.price}</h4>
                                </div>
                                <div className=" libraryDownload-wishlist">
                                    <button
                                        className=" button-wishlist"
                                        type="button"
                                        key={product.id}
                                        onClick={()=>deleteProduct(product.id)}
                                    >
                                        <GiIcons.GiHeartMinus />
                                    </button> 
                                   
                                    <Link to={`/product/${product.id}`}>
                                        <AiIcons.AiFillEye />
                                    </Link>
                                </div>
                            </div>                            
                        </>
                    ))}
            </div>
        </div>
        </>
    )
}