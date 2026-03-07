import { useState, useEffect } from 'react';

export const useProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Construct query string
                const queryParams = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) queryParams.append(key, value);
                });

                const url = `http://localhost:5000/api/products?${queryParams.toString()}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                // Assuming API returns { products: [...] } or just an array
                setProducts(data.products || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [JSON.stringify(filters)]);

    return { products, loading, error };
};

export default useProducts;
