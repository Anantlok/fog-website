import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// The logo is now imported from the 'src' folder directly.
import logo from './logo.png';
// UPDATE: Changed the banner import to use a .jpg extension.
import shopBanner from './assets/shop-banner.jpg';
import imgSyltherine from './assets/syltherine.png';
import imgLeviosa from './assets/leviosa.png';
import imgLolito from './assets/lolito.png';
import imgRespira from './assets/respira.jpg';

// --- Initial Mock Data ---
const initialProducts = [
    { id: 1, name: 'Syltherine', brand: 'Syltherine', category: 'Chair', desc: 'Stylish cafe chair', price: 2500000, oldPrice: 3500000, tag: '-30%', tagColor: 'bg-red-500', img: imgSyltherine },
    { id: 2, name: 'Leviosa', brand: 'Leviosa', category: 'Chair', desc: 'Stylish cafe chair', price: 2500000, oldPrice: null, tag: '', tagColor: '', img: imgLeviosa },
    { id: 3, name: 'Lolito', brand: 'Lolito', category: 'Sofa', desc: 'Luxury big sofa', price: 7000000, oldPrice: 14000000, tag: '-50%', tagColor: 'bg-red-500', img: imgLolito },
    { id: 4, name: 'Respira', brand: 'Respira', category: 'Stool', desc: 'Outdoor bar table and stool', price: 500000, oldPrice: null, tag: 'New', tagColor: 'bg-green-500', img: imgRespira },
    { id: 5, name: 'Grifo', brand: 'Syltherine', category: 'Chair', desc: 'Night lamp', price: 1500000, oldPrice: null, tag: '', tagColor: '', img: imgSyltherine },
    { id: 6, name: 'Muggo', brand: 'Leviosa', category: 'Chair', desc: 'Small mug', price: 150000, oldPrice: null, tag: 'New', tagColor: 'bg-green-500', img: imgLeviosa },
    { id: 7, name: 'Pingky', brand: 'Lolito', category: 'Sofa', desc: 'Cute bed set', price: 7000000, oldPrice: 14000000, tag: '-50%', tagColor: 'bg-red-500', img: imgLolito },
    { id: 8, name: 'Potty', brand: 'Respira', category: 'Stool', desc: 'Minimalist flower pot', price: 500000, oldPrice: null, tag: 'New', tagColor: 'bg-green-500', img: imgRespira },
    { id: 9, name: 'Syltherine II', brand: 'Syltherine', category: 'Chair', desc: 'Stylish cafe chair', price: 2800000, oldPrice: 3800000, tag: '-30%', tagColor: 'bg-red-500', img: imgSyltherine },
    { id: 10, name: 'Leviosa Classic', brand: 'Leviosa', category: 'Chair', desc: 'Stylish cafe chair', price: 2200000, oldPrice: null, tag: '', tagColor: '', img: imgLeviosa },
    { id: 11, name: 'Lolito Modern', brand: 'Lolito', category: 'Sofa', desc: 'Luxury big sofa', price: 8000000, oldPrice: 15000000, tag: '-50%', tagColor: 'bg-red-500', img: imgLolito },
    { id: 12, name: 'Respira Wood', brand: 'Respira', category: 'Stool', desc: 'Outdoor bar table and stool', price: 600000, oldPrice: null, tag: 'New', tagColor: 'bg-green-500', img: imgRespira },
    { id: 13, name: 'Syltherine Comfort', brand: 'Syltherine', category: 'Chair', desc: 'Stylish cafe chair', price: 3500000, oldPrice: 4500000, tag: '-30%', tagColor: 'bg-red-500', img: imgSyltherine },
    { id: 14, name: 'Leviosa II', brand: 'Leviosa', category: 'Chair', desc: 'Stylish cafe chair', price: 2900000, oldPrice: null, tag: '', tagColor: '', img: imgLeviosa },
    { id: 15, name: 'Lolito Grande', brand: 'Lolito', category: 'Sofa', desc: 'Luxury big sofa', price: 9000000, oldPrice: 18000000, tag: '-50%', tagColor: 'bg-red-500', img: imgLolito },
    { id: 16, name: 'Respira Metal', brand: 'Respira', category: 'Table', desc: 'Minimalist coffee table', price: 1200000, oldPrice: null, tag: 'New', tagColor: 'bg-green-500', img: imgRespira },
    { id: 17, name: 'Asgaard', brand: 'Syltherine', category: 'Sofa', desc: 'Scandinavian sofa', price: 12000000, oldPrice: null, tag: 'New', tagColor: 'bg-green-500', img: imgLolito },
];

// --- API Simulation ---
const fetchProductsAPI = (params, allProducts) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let data = [...allProducts];

            // Filtering
            if (params.filters.brand && params.filters.brand !== 'all') {
                data = data.filter(p => p.brand === params.filters.brand);
            }
            if (params.filters.category && params.filters.category !== 'all') {
                data = data.filter(p => p.category === params.filters.category);
            }
            if (params.filters.minPrice) {
                data = data.filter(p => p.price >= params.filters.minPrice);
            }
            if (params.filters.maxPrice) {
                data = data.filter(p => p.price <= params.filters.maxPrice);
            }

            // Sorting
            switch (params.sort) {
                case 'price-asc': data.sort((a, b) => a.price - b.price); break;
                case 'price-desc': data.sort((a, b) => b.price - a.price); break;
                case 'name-asc': data.sort((a, b) => a.name.localeCompare(b.name)); break;
                case 'name-desc': data.sort((a, b) => b.name.localeCompare(a.name)); break;
                default: break;
            }
            
            const totalItems = data.length;
            
            // Pagination
            const start = (params.pagination.currentPage - 1) * params.pagination.itemsPerPage;
            const end = start + params.pagination.itemsPerPage;
            const paginatedData = data.slice(start, end);

            resolve({ products: paginatedData, totalItems });
        }, 500); // 500ms delay to simulate network
    });
};

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// --- Reusable Product Form Component ---
const ProductForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded" required />
            <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="w-full p-2 border rounded" required />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" required />
            <input name="desc" value={formData.desc} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#B88E2F] text-white rounded">Save</button>
            </div>
        </form>
    );
};


function App() {
    // State management
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [allProducts, setAllProducts] = useState(initialProducts); // Master list of products
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // CRUD Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const newProductInitialData = { name: '', brand: '', category: '', desc: '', price: '' };

    // Server-side state
    const [filters, setFilters] = useState({ brand: 'all', category: 'all', minPrice: '', maxPrice: '' });
    const [sort, setSort] = useState('default');
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 8, totalItems: 0 });

    const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

    // Data fetching logic
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        const response = await fetchProductsAPI({ filters, sort, pagination }, allProducts);
        setDisplayedProducts(response.products);
        setPagination(prev => ({ ...prev, totalItems: response.totalItems }));
        setIsLoading(false);
    }, [filters, sort, pagination.currentPage, pagination.itemsPerPage, allProducts]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Icon rendering
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [isMenuOpen, isLoading, isAddModalOpen, isUpdateModalOpen]);

    // Favicon and Title
    useEffect(() => {
        document.title = "Furniro - Shop";
        const favicon = document.querySelector("link[rel~='icon']");
        if (favicon) favicon.href = logo;
    }, []);

    // --- CRUD Handlers ---
    const handleAddProduct = (productData) => {
        const newProduct = {
            ...productData,
            id: Date.now(), // Simple unique ID
            price: parseInt(productData.price, 10),
            oldPrice: null,
            img: imgLeviosa, // Use a static image for new products
        };
        setAllProducts(prev => [newProduct, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleUpdateProduct = (productData) => {
        setAllProducts(prev => prev.map(p => p.id === productData.id ? { ...p, ...productData, price: parseInt(productData.price, 10) } : p));
        setIsUpdateModalOpen(false);
        setCurrentProduct(null);
    };

    const handleDeleteProduct = (productId) => {
        // A confirmation dialog would be ideal here in a real app
        setAllProducts(prev => prev.filter(p => p.id !== productId));
    };

    const openUpdateModal = (product) => {
        setCurrentProduct(product);
        setIsUpdateModalOpen(true);
    };

    // Other Event Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPagination(prev => ({...prev, currentPage: 1}));
    };
    
    const handleItemsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setPagination(prev => ({ ...prev, itemsPerPage: value, currentPage: 1 }));
        }
    };
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };
    
    const breadcrumbStyle = {
        backgroundImage: `url(${shopBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="bg-white text-gray-800">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 shadow-md">
               <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="Furniro Logo" className="h-8" />
                        <a href="#" className="text-2xl font-bold text-gray-800">Furniro</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-800 font-medium hover:text-[#B88E2F]">Home</a>
                        <a href="#" className="text-gray-800 font-medium hover:text-[#B88E2F]">Shop</a>
                        <a href="#" className="text-gray-800 font-medium hover:text-[#B88E2F]">About</a>
                        <a href="#" className="text-gray-800 font-medium hover:text-[#B88E2F]">Contact</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-800 hover:text-[#B88E2F]"><i data-lucide="user"></i></a>
                        <a href="#" className="text-gray-800 hover:text-[#B88E2F]"><i data-lucide="search"></i></a>
                        <a href="#" className="text-gray-800 hover:text-[#B88E2F]"><i data-lucide="heart"></i></a>
                        <a href="#" className="text-gray-800 hover:text-[#B88E2F]"><i data-lucide="shopping-cart"></i></a>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu"><i data-lucide="menu"></i></button>
                    </div>
                </nav>
                {isMenuOpen && (
                    <div className="md:hidden fixed inset-0 bg-white z-50 p-4">
                        <div className="flex justify-end"><button onClick={() => setIsMenuOpen(false)} aria-label="Close menu"><i data-lucide="x"></i></button></div>
                        <nav className="flex flex-col items-center space-y-8 mt-16 text-xl">
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Home</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Shop</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)}>About</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Contact</a>
                            <div className="flex space-x-8 pt-8">
                                <a href="#" className="text-gray-800"><i data-lucide="user"></i></a>
                                <a href="#" className="text-gray-800"><i data-lucide="search"></i></a>
                                <a href="#" className="text-gray-800"><i data-lucide="heart"></i></a>
                                <a href="#" className="text-gray-800"><i data-lucide="shopping-cart"></i></a>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <main>
                <section style={breadcrumbStyle} className="h-48 md:h-64 flex items-center justify-center text-center">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white bg-opacity-50">
                        <h1 className="text-3xl md:text-5xl font-medium text-gray-800">Shop</h1>
                        <div className="mt-2 text-sm"><a href="#" className="font-bold text-gray-800">Home</a> &gt; <span>Shop</span></div>
                    </div>
                </section>

                {/* Filter Bar */}
                <section className="bg-[#F9F1E7] py-4">
                    <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                         <div className="flex flex-wrap items-center gap-4">
                            <button onClick={() => setIsAddModalOpen(true)} className="px-3 py-1 bg-[#B88E2F] text-white rounded-md text-sm">Add Product</button>
                            <select name="brand" value={filters.brand} onChange={handleFilterChange} className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm">
                                <option value="all">All Brands</option>
                                {[...new Set(allProducts.map(p => p.brand))].sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
                            </select>
                            <select name="category" value={filters.category} onChange={handleFilterChange} className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm">
                                <option value="all">All Categories</option>
                                {[...new Set(allProducts.map(p => p.category))].sort().map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                             <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} className="w-24 px-3 py-1 border border-gray-300 rounded-md bg-white text-sm" />
                             <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} className="w-24 px-3 py-1 border border-gray-300 rounded-md bg-white text-sm" />
                        </div>
                        <div className="flex items-center space-x-4">
                             <p className="text-gray-500 text-sm">Showing {displayedProducts.length} of {pagination.totalItems} results</p>
                            <select value={sort} onChange={handleSortChange} className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm">
                                <option value="default">Default</option>
                                <option value="name-asc">Name: A-Z</option>
                                <option value="name-desc">Name: Z-A</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                             <input type="number" value={pagination.itemsPerPage} onChange={handleItemsPerPageChange} className="w-16 px-3 py-1 border border-gray-300 rounded-md bg-white text-sm" />
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="py-8 md:py-12">
                    <div className="container mx-auto px-4 sm:px-6">
                        {isLoading ? (
                            <div className="text-center">Loading products...</div>
                        ) : (
                            <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {displayedProducts.map((product) => (
                                    <div key={product.id} className="group relative overflow-hidden">
                                        <img src={product.img} alt={product.name} className="w-full h-72 object-cover" />
                                        {product.tag && (<div className={`absolute top-4 right-4 ${product.tagColor} text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold`}>{product.tag}</div>)}
                                        <div className="bg-[#F4F5F7] p-4">
                                            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                            <p className="text-gray-500 mt-1">{product.desc}</p>
                                            <div className="mt-2 flex items-baseline space-x-2">
                                                <p className="text-lg font-semibold text-gray-800">Rp {product.price.toLocaleString()}</p>
                                                {product.oldPrice && (<p className="text-sm text-gray-400 line-through">Rp {product.oldPrice.toLocaleString()}</p>)}
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {/* CRUD Icons on Hover */}
                                            <div className="flex space-x-4">
                                                <button onClick={() => openUpdateModal(product)} className="text-white hover:text-[#B88E2F]"><i data-lucide="edit"></i></button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-white hover:text-red-500"><i data-lucide="trash-2"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Pagination */}
                <section className="pb-8 md:pb-12">
                    <div className="container mx-auto px-4 sm:px-6 flex justify-center items-center space-x-4">
                        <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-4 py-2 bg-[#F9F1E7] text-gray-700 rounded-md disabled:opacity-50">Prev</button>
                        {[...Array(totalPages).keys()].map(num => (
                            <button key={num + 1} onClick={() => handlePageChange(num + 1)} className={`px-4 py-2 rounded-md ${pagination.currentPage === num + 1 ? 'bg-[#B88E2F] text-white' : 'bg-[#F9F1E7] text-gray-700'}`}>{num + 1}</button>
                        ))}
                        <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === totalPages} className="px-4 py-2 bg-[#F9F1E7] text-gray-700 rounded-md disabled:opacity-50">Next</button>
                    </div>
                </section>
                
                {/* Features Bar */}
                <section className="bg-[#FAF3EA] py-12">
                     <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex items-center justify-center md:justify-start space-x-3"><i data-lucide="award" className="w-10 h-10 text-gray-700"></i><div><h4 className="font-semibold">High Quality</h4><p className="text-sm text-gray-500">crafted from top materials</p></div></div>
                        <div className="flex items-center justify-center md:justify-start space-x-3"><i data-lucide="shield-check" className="w-10 h-10 text-gray-700"></i><div><h4 className="font-semibold">Warranty Protection</h4><p className="text-sm text-gray-500">Over 2 years</p></div></div>
                        <div className="flex items-center justify-center md:justify-start space-x-3"><i data-lucide="truck" className="w-10 h-10 text-gray-700"></i><div><h4 className="font-semibold">Free Shipping</h4><p className="text-sm text-gray-500">Order over 150 $</p></div></div>
                        <div className="flex items-center justify-center md:justify-start space-x-3"><i data-lucide="headset" className="w-10 h-10 text-gray-700"></i><div><h4 className="font-semibold">24 / 7 Support</h4><p className="text-sm text-gray-500">Dedicated support</p></div></div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t">
                 <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div><h3 className="text-2xl font-bold">Funiro.</h3><p className="text-gray-500 mt-4">400 University Drive Suite 200 Coral Gables, FL 33134 USA</p></div>
                        <div><h4 className="text-gray-400 font-medium">Links</h4><ul className="mt-4 space-y-2"><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">Home</a></li><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">Shop</a></li><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">About</a></li><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">Contact</a></li></ul></div>
                        <div><h4 className="text-gray-400 font-medium">Help</h4><ul className="mt-4 space-y-2"><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">Payment Options</a></li><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">Returns</a></li><li><a href="#" className="text-gray-800 font-semibold hover:text-[#B88E2F]">Privacy Policies</a></li></ul></div>
                        <div><h4 className="text-gray-400 font-medium">Newsletter</h4><form className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"><input type="email" placeholder="Enter Your Email Address" className="border-b-2 outline-none focus:border-black flex-grow" /><button type="submit" className="border-b-2 border-black font-semibold">SUBSCRIBE</button></form></div>
                    </div>
                    <div className="border-t mt-8 pt-8"><p>2023 furino. All rights reserved</p></div>
                </div>
            </footer>

            {/* --- Modals for CRUD --- */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
                <ProductForm initialData={newProductInitialData} onSubmit={handleAddProduct} onCancel={() => setIsAddModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Product">
                {currentProduct && (
                    <ProductForm initialData={currentProduct} onSubmit={handleUpdateProduct} onCancel={() => setIsUpdateModalOpen(false)} />
                )}
            </Modal>
        </div>
    );
}

export default App;

