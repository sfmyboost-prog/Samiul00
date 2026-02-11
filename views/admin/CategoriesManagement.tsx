
import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  TrendingUp,
  Package,
  Filter,
  CheckCircle2,
  XCircle
} from '../../components/common/Icons';
import Toast, { ToastType } from '../../components/common/Toast';
import { Category } from '../../types';

const CategoriesManagement: React.FC = () => {
  const { categories, setCategories, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [popularFilter, setPopularFilter] = useState<'all' | 'popular' | 'non-popular'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'active' as 'active' | 'inactive',
    icon: '📦',
    thumbnail: '',
    is_popular: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    setFormData({ ...formData, name, slug });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPopular = popularFilter === 'all' || (popularFilter === 'popular' ? c.is_popular : !c.is_popular);
      return matchesSearch && matchesStatus && matchesPopular;
    });
  }, [categories, searchTerm, statusFilter, popularFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(prev => prev.map(c => 
        c.id === editingCategory.id ? { ...c, ...formData, updated_at: new Date().toISOString() } : c
      ));
      showToast('Category updated');
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCategory]);
      showToast('Category created');
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', status: 'active', icon: '📦', thumbnail: '', is_popular: false });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name, 
      slug: category.slug,
      status: category.status, 
      icon: category.icon, 
      thumbnail: category.thumbnail || '', 
      is_popular: !!category.is_popular 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const cat = categories.find(c => c.id === id);
    const hasProducts = products.some(p => p.category_id === id || p.category === cat?.name);
    
    if (hasProducts) {
      showToast('Cannot delete category with active products', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast('Category deleted');
    }
  };

  const togglePopular = (category: Category) => {
    const newVal = !category.is_popular;
    setCategories(prev => prev.map(c => 
      c.id === category.id ? { ...c, is_popular: newVal } : c
    ));
    showToast(newVal ? 'Marked as Popular' : 'Removed from Popular');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Category Management</h1>
          <p className="text-sm text-gray-500 mt-1">Total {categories.length} categories. (Popular: {categories.filter(c => c.is_popular).length})</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#f85606] text-white rounded-xl shadow-lg hover:bg-[#d04a05] transition-all transform active:scale-95 font-bold text-sm"
        >
          <Plus size={20} />
          ADD CATEGORY
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#f85606] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#f85606]/10 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select 
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold uppercase tracking-wider text-gray-500 focus:ring-2 focus:ring-[#f85606]/10"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <select 
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold uppercase tracking-wider text-gray-500 focus:ring-2 focus:ring-[#f85606]/10"
              value={popularFilter}
              onChange={(e) => setPopularFilter(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="popular">Popular Only</option>
              <option value="non-popular">Standard Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fcfcfd] text-gray-400 text-[10px] font-black uppercase tracking-[0.1em] border-b">
              <tr>
                <th className="px-8 py-5">Info</th>
                <th className="px-8 py-5">Category Name</th>
                <th className="px-8 py-5">Popular</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCategories.length > 0 ? filteredCategories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                      {category.thumbnail ? (
                        <img src={category.thumbnail} className="w-full h-full object-cover" alt={category.name} />
                      ) : (
                        <span className="text-xl">{category.icon}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-[15px]">{category.name}</span>
                      <span className="text-[11px] text-gray-400 font-medium tracking-wide mt-0.5">{category.slug}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => togglePopular(category)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        category.is_popular 
                        ? 'bg-orange-50 text-[#f85606] shadow-sm' 
                        : 'bg-gray-50 text-gray-200 hover:text-gray-400'
                      }`}
                      title={category.is_popular ? 'Mark as standard' : 'Mark as popular'}
                    >
                      <TrendingUp size={20} strokeWidth={2.5} />
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      category.status === 'active' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${category.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleEdit(category)} 
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)} 
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <Package size={64} strokeWidth={1} />
                      <p className="text-sm font-bold uppercase tracking-[0.2em]">No categories found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 text-[#f85606] rounded-2xl flex items-center justify-center shadow-inner">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 tracking-tight">{editingCategory ? 'Edit Category' : 'Create Category'}</h2>
                  <p className="text-xs text-gray-400 font-medium">Configure category visibility and branding.</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-full transition-colors text-gray-300 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Category Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter category name"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-bold text-gray-800"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Slug (Auto-generated)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="category-slug"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-medium text-gray-400 italic"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Thumbnail URL</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-medium text-gray-800"
                    value={formData.thumbnail}
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Icon (Emoji)</label>
                    <input 
                      type="text" 
                      placeholder="📦"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-center text-2xl"
                      value={formData.icon}
                      onChange={e => setFormData({...formData, icon: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Initial Status</label>
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, status: 'active'})}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'active' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        Active
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, status: 'inactive'})}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'inactive' ? 'bg-white text-gray-500 shadow-sm' : 'text-gray-400'}`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-orange-50/50 rounded-3xl border border-orange-100 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#f85606] shadow-sm">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Popular Category</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Highlight on the homepage</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.is_popular}
                      onChange={e => setFormData({...formData, is_popular: e.target.checked})}
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f85606]"></div>
                  </label>
                </div>
              </div>

              <div className="pt-8 border-t flex justify-end gap-6 bg-white sticky bottom-0">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-12 py-4 bg-[#f85606] text-white rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-[#d04a05] transition-all transform active:scale-95 font-black uppercase tracking-widest text-[11px]"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
