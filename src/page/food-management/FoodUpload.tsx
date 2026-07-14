import { useState, useEffect } from 'react';
import { FiPlus, FiUpload, FiX, FiTrash2 } from 'react-icons/fi';
import { useAllCategoryWithOutPaginationQuery } from '../../api/category/categoryApi';
import type { CategoryType } from '../blog-management/BlogEditModal';
import { useUploadFoodMutation } from '../../api/food/foodApi';
import toast from 'react-hot-toast';
import { errorMessage } from '../../lib/msg/errorMsg';

// Standard React imports for the WYSIWYG Editor
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
    galleryImages: File[];
};

type OptionValueType = {
    id: string;
    val: string;
};

type OptionType = {
    id: string;
    name: string;
    values: OptionValueType[]; // dynamic array of value objects
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

// Configuration toolbar options for the HTML editor
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet'
];

export default function FoodUpload() {
    const { data } = useAllCategoryWithOutPaginationQuery({});
    const categoryData: CategoryType[] = data?.data?.data;

    const [form, setForm] = useState<FormType>({
        name: '',
        category: '',
        price: '',
        stock: '',
        type: '',
        description: '',
        description: '',
        image: null,
        galleryImages: [],
    });

    const [options, setOptions] = useState<OptionType[]>([]);
    const [variants, setVariants] = useState<VariantType[]>([]);

    const [uploadFood, { isLoading }] = useUploadFoodMutation();

    // Generate cartesian product for variants based on options
    useEffect(() => {
        if (options.length === 0) {
            setVariants([]);
            return;
        }

        // Parse options into arrays of values
        const parsedOptions = options.map(opt => ({
            name: opt.name,
            values: opt.values.map(v => v.val.trim()).filter(v => v !== '')
        })).filter(opt => opt.name.trim() !== '' && opt.values.length > 0);

        if (parsedOptions.length === 0) {
            setVariants([]);
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
            // Try to keep existing variant data if title matches
            const existingVariant = variants.find(v => v.title === title);
            
            return {
                id: `var_${index}_${Date.now()}`,
                title: title,
                price: existingVariant?.price || form.price || '0',
                stock: existingVariant?.stock || form.stock || '0',
                option1: combo[0] || null,
                option2: combo[1] || null,
                option3: combo[2] || null,
            };
        });

        setVariants(newVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]); // Intentionally omitting variants to avoid infinite loops, we only regenerate on options change

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (content: string) => {
        setForm({ ...form, description: content });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setForm(prev => ({ ...prev, image: files[0] }));
    };

    const removeImage = () => {
        setForm(prev => ({ ...prev, image: null }));
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...files] }));
    };

    const removeGalleryImage = (indexToRemove: number) => {
        setForm(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, index) => index !== indexToRemove)
        }));
    };

    // --- Options Handlers ---
    const addOption = () => {
        if (options.length >= 3) {
            toast.error("Maximum 3 options allowed (e.g. Size, Color, Material)");
            return;
        }
        setOptions([...options, { 
            id: `opt_${Date.now()}`, 
            name: '', 
            values: [{ id: `val_${Date.now()}`, val: '' }] 
        }]);
    };

    const removeOption = (id: string) => {
        setOptions(options.filter(opt => opt.id !== id));
    };

    const updateOptionName = (id: string, newName: string) => {
        setOptions(options.map(opt => opt.id === id ? { ...opt, name: newName } : opt));
    };

    const updateOptionValue = (optId: string, valId: string, newVal: string) => {
        setOptions(options.map(opt => {
            if (opt.id === optId) {
                const newValues = opt.values.map(v => v.id === valId ? { ...v, val: newVal } : v);
                
                // Auto-add an empty row if the last one is being typed in
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
                // Ensure there's always at least one empty input
                if (filtered.length === 0 || filtered[filtered.length - 1].val.trim() !== '') {
                    filtered.push({ id: `val_${Date.now()}`, val: '' });
                }
                return { ...opt, values: filtered };
            }
            return opt;
        }));
    };

    // --- Variants Handlers ---
    const updateVariant = (id: string, field: 'price' | 'stock', value: string) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };


    const handleAddFood = async () => {
        if (!form.name || !form.category || !form.price || !form.stock) {
            toast.error('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('category_id', form.category);
        formData.append('description', form.description || '');
        formData.append('price', form.price);
        formData.append('stock', form.stock);
        formData.append('type', form.type);

        if (form.image) {
            formData.append('image', form.image);
        }

        form.galleryImages.forEach((img) => {
            formData.append('images[]', img);
        });

        // Append Options correctly to FormData
        // options[0][name]=Size, options[0][values][0]=Small, options[0][values][1]=Large
        const cleanOptions = options.map(opt => ({
            name: opt.name.trim(),
            values: opt.values.map(v => v.val.trim()).filter(v => v !== '')
        })).filter(opt => opt.name !== '' && opt.values.length > 0);

        cleanOptions.forEach((opt, optIndex) => {
            formData.append(`options[${optIndex}][name]`, opt.name);
            opt.values.forEach((val, valIndex) => {
                formData.append(`options[${optIndex}][values][${valIndex}]`, val);
            });
            // Also append position
            formData.append(`options[${optIndex}][position]`, String(optIndex + 1));
        });

        // Append Variants correctly to FormData
        variants.forEach((variant, vIndex) => {
            formData.append(`variants[${vIndex}][title]`, variant.title);
            formData.append(`variants[${vIndex}][price]`, variant.price);
            formData.append(`variants[${vIndex}][stock]`, variant.stock);
            if (variant.option1) formData.append(`variants[${vIndex}][option1]`, variant.option1);
            if (variant.option2) formData.append(`variants[${vIndex}][option2]`, variant.option2);
            if (variant.option3) formData.append(`variants[${vIndex}][option3]`, variant.option3);
        });

        try {
            const res = await uploadFood(formData).unwrap();
            
            // RESET FORM
            setForm({
                name: '', category: '', price: '', stock: '', image: null, type: '', description: '', galleryImages: []
            });
            setOptions([]);
            setVariants([]);

            toast.success(res?.message || 'Food uploaded successfully!');
        } catch (error) {
            errorMessage(error);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* HEADER WITH SAVE BUTTON */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-inner border border-white/20">
                        <FiPlus size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Upload Food</h2>
                        <p className="text-sm text-green-50/80 font-medium mt-0.5">Create a new product with options & variants</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            setForm({ name: '', category: '', price: '', stock: '', image: null, type: '', description: '', galleryImages: [] });
                            setOptions([]); setVariants([]);
                        }}
                        className="px-5 py-2.5 rounded-xl font-semibold text-white/90 hover:text-white hover:bg-white/10 transition"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleAddFood} 
                        disabled={isLoading} 
                        className="px-6 py-2.5 cursor-pointer bg-white text-[#207F36] hover:bg-gray-50 rounded-xl font-bold shadow-lg shadow-black/10 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#207F36] border-t-transparent rounded-full animate-spin"></span>
                                Saving...
                            </>
                        ) : 'Save Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">Basic Information</h3>
                        
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-2">Food Name *</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. 3 Egg Omelette" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 block mb-2">Description</label>
                            <div className="[&&_.ql-toolbar]:rounded-t-2xl [&&_.ql-toolbar]:border-gray-200 [&&_.ql-container]:rounded-b-2xl [&&_.ql-container]:border-gray-200 [&&_.ql-container]:min-h-[150px] [&&_.ql-editor]:text-base">
                                <ReactQuill theme="snow" value={form.description} onChange={handleDescriptionChange} modules={quillModules} formats={quillFormats} placeholder="Enter product details..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Base Price ($) *</label>
                                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="10.00" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Base Stock *</label>
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="99" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* OPTIONS SECTION */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between border-b pb-3 mb-5">
                            <h3 className="text-lg font-semibold">Options & Variants</h3>
                        </div>
                        
                        <div className="space-y-6 mb-6">
                            {options.map((opt, index) => (
                                <div key={opt.id} className="flex flex-col gap-4 p-5 border border-gray-200 rounded-2xl bg-gray-50/30">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-gray-700 block">Option name</label>
                                        <button onClick={() => removeOption(opt.id)} className="text-sm text-red-500 hover:text-red-700 font-medium transition" title="Remove Option">
                                            Remove
                                        </button>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={opt.name} 
                                        onChange={(e) => updateOptionName(opt.id, e.target.value)} 
                                        placeholder="e.g. Size or Color" 
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
                                                    placeholder={vIndex === opt.values.length - 1 ? "Add another value" : "e.g. Small"} 
                                                    className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 bg-white" 
                                                />
                                                {opt.values.length > 1 && vIndex !== opt.values.length - 1 && (
                                                    <button 
                                                        onClick={() => removeOptionValue(opt.id, v.id)} 
                                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" 
                                                        title="Delete value"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                )}
                                                {/* Placeholder div to keep alignment when trash icon is missing on the last input */}
                                                {(opt.values.length === 1 || vIndex === opt.values.length - 1) && (
                                                    <div className="w-[38px]"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            
                            {options.length < 3 && (
                                <button onClick={addOption} className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-2 px-2 py-1">
                                    <FiPlus /> Add another option
                                </button>
                            )}
                        </div>

                        {/* VARIANTS TABLE */}
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
                                                        <input type="number" value={variant.price} onChange={(e) => updateVariant(variant.id, 'price', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <input type="number" value={variant.stock} onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
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

                {/* RIGHT COLUMN: Media & Categories */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">Media</h3>
                        {!form.image ? (
                            <label className="border-2 border-dashed border-gray-300 rounded-2xl h-56 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50 overflow-hidden">
                                <FiUpload className="text-4xl text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-600">Click to upload image</p>
                                <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or WEBP</p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        ) : (
                            <div className="relative h-56 w-full rounded-2xl overflow-hidden border">
                                <img src={URL.createObjectURL(form.image)} alt="preview" className="w-full h-full object-cover" onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                                <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 shadow hover:bg-red-600 transition">
                                    <FiX size={18} />
                                </button>
                            </div>
                        )}
                        
                        {/* GALLERY IMAGES */}
                        <div className="mt-6 border-t pt-5">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Gallery Images</h4>
                            
                            {form.galleryImages.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {form.galleryImages.map((img, index) => (
                                        <div key={index} className="relative h-28 w-full rounded-xl overflow-hidden border">
                                            <img src={URL.createObjectURL(img)} alt={`gallery-${index}`} className="w-full h-full object-cover" onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                                            <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <label className="border-2 border-dashed border-gray-300 rounded-xl py-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50/50">
                                <FiPlus className="text-2xl text-gray-400 mb-1" />
                                <span className="text-xs font-medium text-gray-500">Add Gallery Images</span>
                                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">Organization</h3>
                        <label className="text-sm font-medium text-gray-600 block mb-2">Category *</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="">Select Category</option>
                            {categoryData && categoryData.map((category, index) => (
                                <option key={index} value={category?.id}>{category?.name}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
}