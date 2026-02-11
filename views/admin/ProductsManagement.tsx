
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUpDown, 
  X,
  Download,
  Package
} from '../../components/common/Icons';
import Toast, { ToastType } from '../../components/common/Toast';

type SortConfig = {
  key: keyof Product;
  direction: 'asc' | 'desc';
} | null;

const ProductsManagement: React.FC = () => {
  const { products, setProducts, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Form State
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || '',
    subcategory: '',
    price: '',
    stock: '',
    discount: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (subcategoryFilter !== 'All') {
      result = result.filter(p => p.subcategory === subcategoryFilter);
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, searchTerm, categoryFilter, subcategoryFilter, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedProducts.map(p => p.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.size} items?`)) {
      setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      showToast('Items deleted');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      discount: (product.discount || 0).toString(),
      description: product.description,
      status: product.status
    });
    setPreviewImages(product.images);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Look up category id from current categories list based on form name
    const catId = categories.find(c => c.name === formData.category)?.id || 'unknown';
    
    const productData = {
      name: formData.name,
      category: formData.category,
      category_id: catId, // Fixed: include category_id
      subcategory: formData.subcategory,
      price: parseFloat(formData.price),
      originalPrice: formData.discount ? parseFloat(formData.price) * (1 + parseFloat(formData.discount) / 100) : undefined,
      image: previewImages[0] || 'https://picsum.photos/seed/placeholder/400/400',
      images: previewImages.length > 0 ? previewImages : ['https://picsum.photos/seed/placeholder/400/400'],
      description: formData.description,
      stock: parseInt(formData.stock),
      discount: formData.discount ? parseInt(formData.discount) : undefined,
      status: formData.status
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id ? { ...p, ...productData } : p
      ));
      showToast('Product updated');
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        ...productData,
        rating: 0,
        reviews: 0
      };
      setProducts(prev => [newProduct, ...prev]);
      showToast('Product added');
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', category: categories[0]?.name || '', subcategory: '', price: '', stock: '', discount: '', description: '', status: 'active' });
    setPreviewImages([]);
  };

  const activeCategoryForForm = categories.find(c => c.name === formData.category);
  const activeCategoryForFilter = categories.find(c => c.name === categoryFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1e1e2d] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-10">
          <div className="flex items-center gap-3 pr-8 border-r border-gray-700">
            <span className="bg-[#f85606] text-white text-xs font-bold px-2.5 py-1 rounded-full">{selectedIds.size}</span>
            <span className="text-sm font-semibold tracking-wide">Selected</span>
          </div>
          <button onClick={handleBulkDelete} className="text-sm font-bold hover:text-red-400 transition-colors">Delete Selected</button>
          <button onClick={() => setSelectedIds(new Set())} className="p-2 hover:bg-white/10 rounded-full ml-4"><X size={20} /></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Products Management</h1>
          <p className="text-sm text-gray-500 mt-1">Total {products.length} items. Prices are in BDT (৳).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#f85606] text-white rounded-xl shadow-lg hover:bg-[#d04a05] font-bold text-sm"
        >
          <Plus size={20} /> ADD PRODUCT
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-12 pr-4 py-2 border rounded-xl outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="px-4 py-2 border rounded-xl text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 text-sm font-semibold text-gray-700">
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b">
              <tr>
                <th className="px-6 py-5 w-12 text-center">
                  <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.size === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0} />
                </th>
                <th className="px-6 py-5">Product Info</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price (BDT)</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAndSortedProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelectOne(product.id)} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-10 h-10 rounded-lg object-cover border" />
                      <div>
                        <p className="font-bold text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-50 text-[#f85606] px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">৳{product.price.toLocaleString('en-BD')}</td>
                  <td className="px-6 py-4 font-medium">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleEdit(product)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 text-[#f85606] rounded-xl flex items-center justify-center"><Package size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-xs text-gray-500">Prices are automatically saved in BDT.</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-gray-400" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-gray-50 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select required className="w-full px-4 py-3 bg-gray-50 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subcategory: ''})}>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Price (BDT ৳)</label>
                      <input type="number" required className="w-full px-4 py-3 bg-gray-50 border rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Stock</label><input type="number" required className="w-full px-4 py-3 bg-gray-50 border rounded-xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-2">Discount %</label><input type="number" className="w-full px-4 py-3 bg-gray-50 border rounded-xl" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} /></div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <select 
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none cursor-pointer"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                  </div>

                  <div><label className="block text-sm font-bold text-gray-700 mb-2">Description</label><textarea rows={3} className="w-full px-4 py-3 bg-gray-50 border rounded-xl resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-4">Product Images (Paste URLs or upload simulation)</label>
                   <div className="grid grid-cols-2 gap-4">
                      {previewImages.map((src, idx) => (
                         <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                            <img src={src} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12} /></button>
                         </div>
                      ))}
                      <button type="button" onClick={() => {
                        const url = prompt("Enter Image URL");
                        if (url) setPreviewImages(prev => [...prev, url]);
                      }} className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 hover:border-[#f85606] hover:text-[#f85606]"><Plus size={24} /></button>
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-8 py-3 font-bold text-gray-500">CANCEL</button>
                <button type="submit" className="px-12 py-3 bg-[#f85606] text-white rounded-xl font-bold shadow-lg">SAVE PRODUCT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
