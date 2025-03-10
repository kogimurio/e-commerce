import ReactDom from  'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import NoPage from './pages/NoPage';
import CreateProduct from './pages/CreateProduct';
import DetailProduct from './pages/DetailsProduct';
import ProductEdit from './pages/EditProduct';
import Footer from './pages/Footer';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path='contact/' element={<Contact />}/>
          <Route path='create_product/' element={<CreateProduct />}/>
          <Route path='product_details/:id/' element={<DetailProduct />}/>
          <Route path='product_details/:id/edit/:id/' element={<ProductEdit />} />
          <Route path='footer/' element={<Footer />}/>
          <Route path='*' element={<NoPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDom.createRoot(document.getElementById('root'))
root.render(<App />)