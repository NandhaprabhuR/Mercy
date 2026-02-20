import { useState, useEffect } from 'react';
import type { Product } from '../../models/Product';
import { Link } from 'react-router-dom';
import './AdminProductList.css';

export default function AdminProductList() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="admin-products">
            <div className="admin-header-actions">
                <h2>Product Catalog</h2>
                <Link to="/admin/products/add" className="add-new-btn">+ Add Product</Link>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <img src={p.imageUrl} alt={p.name} className="table-img" />
                                </td>
                                <td className="font-medium">{p.name}</td>
                                <td>${p.price.toFixed(2)}</td>
                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="action-btn edit">Edit</button>
                                    <button className="action-btn delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
