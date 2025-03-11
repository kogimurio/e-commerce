import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './home.module.css';
import { Star, ShoppingCart, Heart } from 'lucide-react';


const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate()


    useEffect(() => {
        const fetchProduct = async ()=> {
            try {
                const response = await axios.get('http://localhost:8000/api/list_products/')
                console.log("API Response", response.data)
                setProducts(response.data.results);
            } catch (error) {
                console.log("Error in retriving data", error)
                setError(`Error retriving data: ${error.message}`)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, []);

    const handleCreateProduct =()=> {
        navigate('create_product/')
    }


    if (loading) return <p style={{textAlign: 'center', color: 'green', fontSize: '20px'}}>Loading....</p>
    return (
        <div className={styles.container}>
            <button onClick={handleCreateProduct} className={styles.createButton}>Add Product</button>
            <h1>Welcome to Our Online Shop</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.cardContainer}>
                {products.map((product) => (
                        <div key={product.id} className={styles.cardDetail}>
                            <Link to={`product_details/${product.id}/`} className={styles.linkContainer}>
                                <div className={styles.imageContainer}>
                                    {product.images?.length > 0 && (
                                        <img
                                            src={product.images[0].image_url}
                                            alt={product.title}
                                            style={{width: '200px'}}
                                            className={styles.productImage}
                                        />
                                    )}
                                    {product.is_new && <span className={styles.newBadge}>New</span>}
                                    {product.is_discounted && <span className={styles.discouted}>-{product.discount}%</span>}
                                </div>
                            </Link>
                            <div className={styles.cardContent}>
                                <p className={styles.productTitle}>{product.title}</p>
                                <div className={styles.ratingContainer}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={i < Math.round(product.average_rating) ? styles.starFiled : styles.starEmpty} />
                                    ))}
                                    <span className={styles.reviewText}>({product.review_count} reviews)</span>
                                </div>
                                <div className={styles.priceContainer}>
                                    {product.is_discounted ? (
                                        <>
                                            <span className={styles.oldPrice}>Ksh {Number(product.original_price).toLocaleString()}</span>
                                            <span className={styles.newPrice}>Ksh {Number(product.price).toLocaleString()}</span>
                                        </>
                                    ) : (
                                        <span className={styles.oldPrice}>Ksh {Number(product.price).toLocaleString()}</span>
                                    )}
                                </div>
                                <div className={styles.actionButtons}>
                                    <button className={styles.iconButton}>
                                        <Heart size={18} />
                                    </button>
                                    <button className={styles.addToCartButton}>
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                </div>
                                <p>{product.stock} in stock</p>
                            </div>
                        
                        </div>
                ))}
                
                
            </div>
        </div>
    )
}

export default Home;