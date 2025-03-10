import axios from "axios";
import { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import styles from './detailsProduct.module.css';


const DetailProduct = () => {

    const [product, setProduct] = useState(null)
    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/product_detail/${id}/`)
                console.log('Api Response', res.data)
                setProduct(res.data)
            } catch (error) {
                console.log('Error Fetching Product:', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const handleEdit = ()=> {
        navigate(`edit/${product.id}`)
    }

    const handleDelete = async ()=> {
        const confirmDelete = window.confirm("You are deleting a product")

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/api/delete_product/${id}/`)
                navigate('/')
            } catch(error) {
                console.log('Error in product deletion', error)
            }
        }
        
    }
    if (loading) return <p>Loading ....</p>
    
    return (
        <div>
            <h1>Product Detail</h1>
            <p>{product.name}</p>
            <p>{product.price}</p>
            <p>{product.description}</p>
            <p>{product.stock}</p>
            {product.images.map((image) => (
                <div key={image.id}>
                    <img
                        src={image.image_url}
                        alt={product.name}
                        style={{width: '200px'}}
                    />
                </div>
                
            ))}
            <div className={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < product.rating ? styles.starFiled : styles.starEmpty} />
                ))}
                <span className={styles.reviewText}>({product.reviews} reviews)</span>
            </div>
            <div className={styles.actionButtons}>
                <button className={styles.iconButton}>
                    <Heart size={18} />
                </button>
                <button className={styles.addToCartButton}>
                    <ShoppingCart size={18} /> Add to Cart
                </button>
            </div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default DetailProduct;