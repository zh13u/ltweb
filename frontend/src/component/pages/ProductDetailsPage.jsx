import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import { formatCurrency } from "../../utils/formatCurrency";
import Loading from "../common/Loading";

const ProductDetailsPage = () => {
    const {productId} = useParams();
    const {cart, dispatch} = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAdmin = ApiService.isAdmin();

    useEffect(()=>{
        fetchProduct();
    }, [productId])

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getProductById(productId);
            setProduct(response.product);
        } catch (error) {
            console.log(error.message || error)
        } finally {
            setLoading(false);
        }
    }

    const addToCart = () => {
        if (product) {
            dispatch({type: 'ADD_ITEM', payload: product});   
        }
    }

    const incrementItem = () => {
        if(product){
            dispatch({type: 'INCREMENT_ITEM', payload: product});
        }
    }

    const decrementItem = () => {
        if (product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({type: 'DECREMENT_ITEM', payload: product}); 
            }else{
                dispatch({type: 'REMOVE_ITEM', payload: product}); 
            }
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 0' }}>
                <Loading message="Đang tải thông tin sản phẩm..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <p>Không tìm thấy sản phẩm</p>
            </div>
        );
    }

    const cartItem = cart.find(item => item.id === product.id);

    return(
        <div className="product-detail">
            <div className="container">
                <div className="product-detail-container">
                    <div className="product-images">
                        <img src={product?.imageUrl} alt={product?.name} />
                    </div>
                    <div className="product-info">
                        <h1>{product?.name}</h1>
                        <div className="product-price">
                            <span className="current-price">{formatCurrency(product.price)}</span>
                        </div>
                        <p className="product-description">{product?.description}</p>
                        {!isAdmin && (
                            <div className="product-actions">
                                {cartItem ? (
                                    <div className="quantity-controls">
                                        <button onClick={decrementItem}>-</button>
                                        <span>{cartItem.quantity}</span>
                                        <button onClick={incrementItem}>+</button>
                                    </div>
                                ):(
                                    <button className="btn btn-primary" onClick={addToCart}>
                                        <i className="fas fa-shopping-cart"></i>
                                        Thêm vào giỏ hàng
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage;