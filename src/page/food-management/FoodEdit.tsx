import { useState, useEffect } from 'react';
import { FiPlus, FiUpload, FiX, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { useAllCategoryWithOutPaginationQuery } from '../../api/category/categoryApi';
import { useGetAllCollectionQuery } from '../../api/collection/collectionApi';
import type { CategoryType } from '../blog-management/BlogEditModal';
import { useGetFoodByIdQuery, useFoodUpdateMutation } from '../../api/food/foodApi';
import toast from 'react-hot-toast';
import { errorMessage } from '../../lib/msg/errorMsg';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type FormType = {
    name: string;
    category: string;
    price: string;
    stock: string;
    image: File | null;
    type: string;
    description: string;
    newGalleryImages: File[];
    collections: string[];
};

type ExistingGalleryImage = {
    id: number;
    image_path: string;
};

type OptionValueType = {
    id: string;
    val: string;
};

type OptionType = {
    id: string;
    name: string;
    values: OptionValueType[];
};

type VariantType = {
    id: string;
    title: string;
    price: string;
    stock: string;
    option1: string | null;
    option2: string | null;
    option3: string | null;
};

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'blockquote', 'list', 'bullet'
];

export default function FoodEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: categoryResponse } = useAllCategoryWithOutPaginationQuery({});
    const categoryData: CategoryType[] = categoryResponse?.data?.data || [];

    const { data: collectionResponse } = useGetAllCollectionQuery({});
    const collectionData = collectionResponse?.data || [];

    const { data: foodResponse, isLoading: isFetching } = useGetFoodByIdQuery(id, { skip: !id });
    const foodData = foodResponse?.data;

    const [form, setForm] = useState<FormType>({
        name: '',
        category: '',
        price: '',
        stock: '',
        type: '',
        description: '',
        image: null,
        newGalleryImages: [],
        collections: [],
    });

    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
    const [existingGalleryImages, setExistingGalleryImages] = useState<ExistingGalleryImage[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const [options, setOptions] = useState<OptionType[]>([]);
    const [variants, setVariants] = useState<VariantType[]>([]);

    const [updateFood, { isLoading }] = useFoodUpdateMutation();

    // Populate Data when fetched
    useEffect(() => {
        if (foodData) {
            setForm({
                name: foodData.name || foodData.title || '',
                category: String(foodData.category_id || ''),
                price: foodData.price !== undefined && foodData.price !== null ? String(foodData.price) : '',
                stock: foodData.stock !== undefined && foodData.stock !== null ? String(foodData.stock) : '',
                type: foodData.type || '',
                description: foodData.description || '',
                image: null, // file object
                newGalleryImages: [],
                collections: Array.isArray(foodData.collections) ? foodData.collections.map((c: any) => String(c.id)) : []
            });

            setExistingMainImage(foodData.image || null);
            setExistingGalleryImages(foodData.images || []);
            setDeletedImageIds([]);

            // Reconstruct Options
            if (foodData.options && Array.isArray(foodData.options)) {
                const rawOptions = foodData.options.map((opt: any, index: number) => {
                    return {
                        id: `opt_${Date.now()}_${index}`,
                        name: opt.name || '',
                        values: Array.isArray(opt.values) 
                            ? opt.values.map((val: string, vIdx: number) => ({ id: `val_${Date.now()}_${index}_${vIdx}`, val }))
                            : [{ id: `val_${Date.now()}_${index}_0`, val: '' }]
                    };
                });
                
                // Hide Shopify's default dummy option
                const loadedOptions = rawOptions.filter((opt: any) => 
                    !(opt.name === 'Title' && opt.values.length === 1 && opt.values[0].val === 'Default Title')
                );
                
                setOptions(loadedOptions);
            }

            // Reconstruct Variants
            if (foodData.variants && Array.isArray(foodData.variants)) {
                const rawVariants = foodData.variants.map((v: any) => ({
                    id: String(v.id || Date.now() + Math.random()),
                    title: v.title || '',
                    price: String(v.price || ''),
                    stock: String(v.stock || ''),
                    option1: v.option1 || null,
                    option2: v.option2 || null,
                    option3: v.option3 || null,
                }));
                
                // Hide Shopify's default dummy variant
                const loadedVariants = rawVariants.filter((v: any) => v.title !== 'Default Title');
                
                setVariants(loadedVariants);
            }
        }
    }, [foodData]);


    // Regenerate variants if options change (but only if options actively edited by user)
    // To prevent overwriting fetched variant prices, we match by title
    useEffect(() => {
        if (!foodData) return; // Only run after data is loaded
        if (options.length === 0) {
            return;
        }

        const parsedOptions = options.map(opt => ({
            name: opt.name,
            values: opt.values.map(v => v.val.trim()).filter(v => v !== '')
        })).filter(opt => opt.name.trim() !== '' && opt.values.length > 0);

        if (parsedOptions.length === 0) {
            return;
        }

        const generateCombinations = (arrays: string[][]): string[][] => {
            if (arrays.length === 0) return [[]];
            const result: string[][] = [];
            const rest = generateCombinations(arrays.slice(1));
            for (const item of arrays[0]) {
                for (const combination of rest) {
                    result.push([item, ...combination]);
                }
            }
            return result;
        };

        const valuesArrays = parsedOptions.map(opt => opt.values);
        const combinations = generateCombinations(valuesArrays);

        const newVariants: VariantType[] = combinations.map((combo, index) => {
            const title = combo.join(' / ');
            const existingVariant = variants.find(v => v.title === title);
            
            return {
                id: existingVariant?.id || `var_${index}_${Date.now()}`,
                title: title,
                price: existingVariant?.price || form.price || '0',
                stock: existingVariant?.stock || form.stock || '0',
                option1: combo[0] || null,
                option2: combo[1] || null,
                option3: combo[2] || null,
            };
        });

        // Only update if the combinations actually changed to avoid infinite loop
        if (JSON.stringify(newVariants.map(v => v.title)) !== JSON.stringify(variants.map(v => v.title))) {
            setVariants(newVariants);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (content: string, _delta: any, source: string) => {
        if (source === 'user') {
            setForm(prev => ({ ...prev, description: content }));
        }
    };

    // Main Image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setForm(prev => ({ ...prev, image: files[0] }));
        setExistingMainImage(null); // User uploaded new, hide old preview
    };

    const removeMainImage = () => {
        setForm(prev => ({ ...prev, image: null }));
        setExistingMainImage(null);
    };

    // New Gallery Images
    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setForm(prev => ({ ...prev, newGalleryImages: [...prev.newGalleryImages, ...files] }));
    };

    const removeNewGalleryImage = (indexToRemove: number) => {
        setForm(prev => ({
            ...prev,
            newGalleryImages: prev.newGalleryImages.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Existing Gallery Images
    const removeExistingGalleryImage = (idToRemove: number) => {
        setExistingGalleryImages(prev => prev.filter(img => img.id !== idToRemove));
        setDeletedImageIds(prev => [...prev, idToRemove]);
    };

    // --- Options Handlers ---
    const addOption = () => {
        if (options.length >= 3) {
            toast.error("Maximum 3 options allowed");
            return;
        }
        setOptions([...options, { id: `opt_${Date.now()}`, name: '', values: [{ id: `val_${Date.now()}`, val: '' }] }]);
    };

    const removeOption = (id: string) => setOptions(options.filter(opt => opt.id !== id));
    const updateOptionName = (id: string, newName: string) => setOptions(options.map(opt => opt.id === id ? { ...opt, name: newName } : opt));
    
    const updateOptionValue = (optId: string, valId: string, newVal: string) => {
        setOptions(options.map(opt => {
            if (opt.id === optId) {
                const newValues = opt.values.map(v => v.id === valId ? { ...v, val: newVal } : v);
                if (newValues[newValues.length - 1].val.trim() !== '') {
                    newValues.push({ id: `val_${Date.now()}_${Math.random()}`, val: '' });
                }
                return { ...opt, values: newValues };
            }
            return opt;
        }));
    };

    const removeOptionValue = (optId: string, valId: string) => {
        setOptions(options.map(opt => {
            if (opt.id === optId) {
                const filtered = opt.values.filter(v => v.id !== valId);
                if (filtered.length === 0 || filtered[filtered.length - 1].val.trim() !== '') {
                    filtered.push({ id: `val_${Date.now()}`, val: '' });
                }
                return { ...opt, values: filtered };
            }
            return opt;
        }));
    };

    const updateVariant = (id: string, field: 'price' | 'stock', value: string) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleUpdateFood = async () => {
        if (!form.name || !form.category || !form.price || !form.stock) {
            toast.error('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        // Since we are PUTting data using multipart/form-data, laravel requires method spoofing
        formData.append('_method', 'PUT');

        formData.append('name', form.name);
        formData.append('category_id', form.category);
        formData.append('description', form.description || '');
        formData.append('price', form.price);
        formData.append('stock', form.stock);
        formData.append('type', form.type);

        if (form.image) {
            formData.append('image', form.image);
        }

        form.newGalleryImages.forEach((img) => {
            formData.append('images[]', img);
        });

        deletedImageIds.forEach(delId => {
            formData.append('deleted_image_ids[]', String(delId));
        });

        form.collections.forEach(col => {
            formData.append('collections[]', col);
        });

        const cleanOptions = options.map(opt => ({
            name: opt.name.trim(),
            values: opt.values.map(v => v.val.trim()).filter(v => v !== '')
        })).filter(opt => opt.name !== '' && opt.values.length > 0);

        cleanOptions.forEach((opt, optIndex) => {
            formData.append(`options[${optIndex}][name]`, opt.name);
            opt.values.forEach((val, valIndex) => {
                formData.append(`options[${optIndex}][values][${valIndex}]`, val);
            });
            formData.append(`options[${optIndex}][position]`, String(optIndex + 1));
        });

        variants.forEach((variant, vIndex) => {
            // Append the ID if it's not a generated/temporary ID (we used var_ or random strings, let's just send it if it's an existing number id from DB)
            // Wait, we can just send it, backend will handle it.
            // Oh, wait! The frontend sets variant.id to: String(v.id || Date.now() + Math.random()) or `var_${index}_${Date.now()}`
            // If it starts with 'var_' or contains '.', it's a temp ID.
            if (!variant.id.startsWith('var_') && !variant.id.includes('.')) {
                formData.append(`variants[${vIndex}][id]`, variant.id);
            }
            formData.append(`variants[${vIndex}][title]`, variant.title);
            formData.append(`variants[${vIndex}][price]`, variant.price);
            formData.append(`variants[${vIndex}][stock]`, variant.stock);
            if (variant.option1) formData.append(`variants[${vIndex}][option1]`, variant.option1);
            if (variant.option2) formData.append(`variants[${vIndex}][option2]`, variant.option2);
            if (variant.option3) formData.append(`variants[${vIndex}][option3]`, variant.option3);
        });

        try {
            const res = await updateFood({ id, formData }).unwrap();
            toast.success(res?.message || 'Food updated successfully!');
            navigate('/admin-dashboard/food-management');
        } catch (error) {
            errorMessage(error);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="w-8 h-8 border-4 border-[#207F36] border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin-dashboard/food-management')}
                        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-inner border border-white/20 hover:bg-white/20 transition cursor-pointer"
                    >
                        <FiArrowLeft size={22} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Update Food</h2>
                        <p className="text-sm text-green-50/80 font-medium mt-0.5">Modify product details & variants</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin-dashboard/food-management')}
                        className="px-5 py-2.5 rounded-xl font-semibold text-white/90 hover:text-white hover:bg-white/10 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdateFood} 
                        disabled={isLoading} 
                        className="px-6 py-2.5 cursor-pointer bg-white text-[#207F36] hover:bg-gray-50 rounded-xl font-bold shadow-lg shadow-black/10 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#207F36] border-t-transparent rounded-full animate-spin"></span>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">Basic Information</h3>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-2">Food Name *</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 block mb-2">Description</label>
                            <div className="[&&_.ql-toolbar]:rounded-t-2xl [&&_.ql-toolbar]:border-gray-200 [&&_.ql-container]:rounded-b-2xl [&&_.ql-container]:border-gray-200 [&&_.ql-container]:min-h-[150px] [&&_.ql-editor]:text-base">
                                <ReactQuill theme="snow" value={form.description} onChange={handleDescriptionChange} modules={quillModules} formats={quillFormats} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Base Price ($) *</label>
                                <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Base Stock *</label>
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between border-b pb-3 mb-5">
                            <h3 className="text-lg font-semibold">Options & Variants</h3>
                        </div>
                        
                        <div className="space-y-6 mb-6">
                            {options.map((opt) => (
                                <div key={opt.id} className="flex flex-col gap-4 p-5 border border-gray-200 rounded-2xl bg-gray-50/30">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-gray-700 block">Option name</label>
                                        <button onClick={() => removeOption(opt.id)} className="text-sm text-red-500 hover:text-red-700 font-medium transition cursor-pointer">Remove</button>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={opt.name} 
                                        onChange={(e) => updateOptionName(opt.id, e.target.value)} 
                                        className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-white" 
                                    />
                                    
                                    <div className="space-y-2 mt-2">
                                        <label className="text-sm font-semibold text-gray-700 block mb-2">Option values</label>
                                        {opt.values.map((v, vIndex) => (
                                            <div key={v.id} className="flex items-center gap-3">
                                                <input 
                                                    type="text" 
                                                    value={v.val} 
                                                    onChange={(e) => updateOptionValue(opt.id, v.id, e.target.value)} 
                                                    placeholder={vIndex === opt.values.length - 1 ? "Add another value" : ""} 
                                                    className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-white" 
                                                />
                                                {opt.values.length > 1 && vIndex !== opt.values.length - 1 && (
                                                    <button onClick={() => removeOptionValue(opt.id, v.id)} className="p-2.5 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                )}
                                                {(opt.values.length === 1 || vIndex === opt.values.length - 1) && (
                                                    <div className="w-[38px]"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            {options.length < 3 && (
                                <button onClick={addOption} className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-2 px-2 py-1 cursor-pointer">
                                    <FiPlus /> Add another option
                                </button>
                            )}
                        </div>

                        {variants.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-md font-semibold mb-3">Generated Variants</h4>
                                <div className="overflow-x-auto border rounded-2xl">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Variant</th>
                                                <th className="px-4 py-3 font-medium w-32">Price ($)</th>
                                                <th className="px-4 py-3 font-medium w-32">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {variants.map(variant => (
                                                <tr key={variant.id} className="hover:bg-gray-50/50">
                                                    <td className="px-4 py-3 text-gray-700 font-medium">
                                                        <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs">{variant.title}</span>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input type="number" value={variant.price} onChange={(e) => updateVariant(variant.id, 'price', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-green-500" />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input type="number" value={variant.stock} onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-green-500" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">Media</h3>
                        
                        {!existingMainImage && !form.image ? (
                            <label className="border-2 border-dashed border-gray-300 rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50">
                                <FiUpload className="text-4xl text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-600">Click to upload new image</p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative h-56 w-full rounded-2xl overflow-hidden border">
                                <img src={form.image ? URL.createObjectURL(form.image) : (existingMainImage || '')} alt="preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={removeMainImage} className="absolute top-3 right-3 cursor-pointer bg-red-500 text-white rounded-full p-1.5 shadow hover:bg-red-600 transition">
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}
                        
                        <div className="mt-6 border-t pt-5">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Gallery Images</h4>
                            
                            {(existingGalleryImages.length > 0 || form.newGalleryImages.length > 0) && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {existingGalleryImages.map((img) => (
                                        <div key={img.id} className="relative h-28 w-full rounded-xl overflow-hidden border">
                                            <img src={img.image_path} alt={`gallery-${img.id}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeExistingGalleryImage(img.id)} className="absolute top-1.5 right-1.5 cursor-pointer bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {form.newGalleryImages.map((img, index) => (
                                        <div key={`new-${index}`} className="relative h-28 w-full rounded-xl overflow-hidden border border-green-300">
                                            <img src={URL.createObjectURL(img)} alt={`new-gallery-${index}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewGalleryImage(index)} className="absolute top-1.5 right-1.5 cursor-pointer bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <label className="border-2 border-dashed border-gray-300 rounded-xl py-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50/50">
                                <FiPlus className="text-2xl text-gray-400 mb-1" />
                                <span className="text-xs font-medium text-gray-500">Upload More</span>
                                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">Organization</h3>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Category *</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="">Select Category</option>
                            {categoryData.map((category: any) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>

                        <div className="mt-5">
                            <label className="text-sm font-medium text-gray-600 block mb-2">Collections</label>
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                                {collectionData.map((collection: any) => (
                                    <label key={collection.id} className="flex items-center gap-3 cursor-pointer p-1">
                                        <input 
                                            type="checkbox" 
                                            value={collection.id}
                                            checked={form.collections.includes(String(collection.id))}
                                            onChange={(e) => {
                                                const val = String(collection.id);
                                                if (e.target.checked) {
                                                    setForm(prev => ({ ...prev, collections: [...prev.collections, val] }));
                                                } else {
                                                    setForm(prev => ({ ...prev, collections: prev.collections.filter(c => c !== val) }));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 font-medium select-none">{collection.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
