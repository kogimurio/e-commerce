import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const CreateProduct = () => {

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
    })
    const [productImage, setProductImage] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleFileChange = (e)=> {
        setProductImage([...e.target.files])
    }

    const handleSubmit = async (e)=> {
        e.preventDefault()

        const form = new FormData();
        form.append('name', formData.name);
        form.append('price', formData.price);
        form.append('description', formData.description);
        form.append('stock', formData.stock);

        productImage.forEach((image) => form.append('uploaded_images', image))

        try {
            const response = await axios.post('http://localhost:8000/api/create_product/', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Submit created form data:', response.data)
            navigate('/')
        } catch(error) {
            setError('An Error has occured, try again')
            console.log('Error', error.message)
        }

    }

    return (
        <div>
            <h1>Create Product</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                    />
                </label>
                <label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Product Price"
                    />
                </label>
                <label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Product Description"
                    />
                </label>
                <label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Remaining Stock"
                    />
                </label>
                <label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                </label>
                <button type="submit">Add Product</button>
            </form>
        </div>
    )
}

export default CreateProduct;







