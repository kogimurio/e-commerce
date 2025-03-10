import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const ProductEdit = ()=> {

    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
    })
    const [productImage, setProductImage] = useState(null)
    const [existingImages, setExistingImages] = useState([])

    useEffect(() => {
        const fetchProduct = async() => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get_product/${id}/`)
                const { name, price, description, stock, images } = response.data
                setFormData({name, price, description, stock})
                setExistingImages(images)
            } catch (error) {
                console.log("Error in fetching product", error.message)
                setError("Error in fetching product")
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleChange = (e)=> {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleFilechange = (e) => {
        setProductImage(e.target.files[0])
    }

    const handleSubmit = async (e)=> {
        e.preventDefault()

        const form = new FormData()
        form.append('name', formData.name)
        form.append('price', formData.price)
        form.append('description', formData.description)
        form.append('stock', formData.stock)

        if (productImage) {
            form.append('uploaded_images', productImage)
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/update_product/${id}/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log("Submit Updated form data", response.data)
            navigate('/')
        } catch(error) {
            console.log('Error in updating the product', error.message)
            setError('An Error has occured')
        }

    }

    if(loading) return <p>Loading.....</p>

    return (
        <div>
            <h1>Edit Product</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>
                    Name:
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Current product image
                    {existingImages.length > 0 && existingImages.map((image) => (
                        <img key={image.id} src={image.image_url} alt='product' style={{width: '200px'}} />
                    ))}
                </label>
                <label>
                    Upload New image
                    <input 
                        type="file"
                        onChange={handleFilechange}
                        accept="image/*"
                    />
                </label>
                <button>Update</button>
            </form>
        </div>
    )
}

export default ProductEdit;












