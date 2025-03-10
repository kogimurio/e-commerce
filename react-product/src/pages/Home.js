import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './home.module.css';


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
                setProducts(response.data);
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
                    <Link to={`product_details/${product.id}/`} className={styles.linkContainer}>
                        <div key={product.id} className={styles.cardDetail}>
                            <div className={styles.imageContainer}>
                                {product.images.length > 0 && (
                                    <img
                                        src={product.images[0].image_url}
                                        alt={product.name}
                                        style={{width: '200px'}}
                                        className={styles.productImage}
                                    />
                                )}
                                
                            </div>
                            {product.isNew && <span classname={styles.newBadge}>New</span>}
                            {product.isDiscouted && <span classname={styles.discouted}>-{product.discount}%</span>}
                            <div className={styles.cardContent}>
                                <p className={styles.productTitle}>{product.name}</p>
                                <div className={styles.priceContainer}>
                                    {product.isDiscouted ? (
                                        <>
                                            <span className={styles.oldPrice}>Ksh {product.originalPrice}</span>
                                            <span className={styles.newPrice}>Ksh {product.price}</span>
                                        </>
                                    ) : (
                                        <span className={styles.oldPrice}>Ksh {product.price}</span>
                                    )}
                                </div>
                                <p className={styles.inStock}>{product.stock} in stock</p>
                            </div>
                        
                        </div>
                    </Link>
                ))}
                
                
            </div>
        </div>
    )
}

export default Home;