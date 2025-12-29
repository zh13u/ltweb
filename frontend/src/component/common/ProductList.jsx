import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import ApiService from "../../service/ApiService";

const ProductList = ({products}) => {
    const {cart, dispatch} = useCart();
    const isAdmin = ApiService.isAdmin();

    const addToCart = (product) => {
        dispatch({type: 'ADD_ITEM', payload: product});
    }

    const incrementItem = (product) => {
        dispatch({type: 'INCREMENT_ITEM', payload: product});
    }

    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({type: 'DECREMENT_ITEM', payload: product}); 
        }else{
            dispatch({type: 'REMOVE_ITEM', payload: product}); 
        }
    }

    return(
        <div className="products-grid">
            {products.map((product, index) => {
                const cartItem = cart.find(item => item.id === product.id);
                return (
                    <div className="product-card" key={index}>
                        <div className="product-image">
                            <Link to={`/product/${product.id}`}>
                                <img src={product.imageUrl} alt={product.name} />
                            </Link>
                        </div>
                        <div className="product-info">
                            <h3>
                                <Link to={`/product/${product.id}`}>{product.name}</Link>
                            </h3>
                            <p className="product-description">{product.description}</p>
                            <div className="product-price">
                                <span className="current-price">{formatCurrency(product.price)}</span>
                            </div>
                            {!isAdmin && (
                                cartItem ? (
                                    <div className="quantity-controls">
                                        <button onClick={()=> decrementItem(product)}> - </button>
                                        <span>{cartItem.quantity}</span>
                                        <button onClick={()=> incrementItem(product)}> + </button>
                                    </div>
                                ):(
                                    <button className="btn btn-primary" onClick={()=> addToCart(product)}>
                                        Thêm vào giỏ hàng
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

export default ProductList;