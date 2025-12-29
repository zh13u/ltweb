import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import Loading from "../common/Loading";
import ApiService from "../../service/ApiService";

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(()=> {
        // Redirect admin to admin page
        if (ApiService.isAdmin()) {
            navigate("/admin");
            return;
        }

        const fetchProducts = async () => {
            try{
                setLoading(true);
                let allProducts = [];
                const queryparams = new URLSearchParams(location.search);
                const searchItem = queryparams.get('search')

                if (searchItem) {
                    const response = await ApiService.searchProducts(searchItem);
                    allProducts = response.productList || [];
                }else{
                    const response = await ApiService.getAllProducts();
                    allProducts = response.productList || [];
                }

                setTotalPages(Math.ceil(allProducts.length/itemsPerPage));
                setProducts(allProducts.slice((currentPage -1) * itemsPerPage, currentPage * itemsPerPage));
               
            }catch(error){
                setError(error.response?.data?.message || error.message || 'unable to fetch products')
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    },[location.search, currentPage, navigate])

    return(
        <>
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">PhoneStore - Website bán điện thoại</h1>
                    <p className="hero-description">
                        Khám phá bộ sưu tập điện thoại mới nhất với công nghệ tiên tiến và giá cả hợp lý.
                    </p>
                </div>
            </section>

            <section className="products">
                <div className="container">
                    <h2 className="section-title">Sản phẩm nổi bật</h2>
                    {loading ? (
                        <Loading message="Đang tải sản phẩm..." />
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ):(
                        <>
                            <ProductList products={products}/>
                            <Pagination  
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page)=> setCurrentPage(page)}
                            />
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default Home;