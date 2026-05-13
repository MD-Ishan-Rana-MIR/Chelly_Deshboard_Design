'use client';

import { useMemo, useState } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import BlogUpload from './BlogUplod';

type Blog = {
    id: number;
    title: string;
    category: string;
    description: string;
};

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([
        {
            id: 1,
            title: 'Healthy Food Guide',
            category: 'Food',
            description: '<p>Eat healthy food daily</p>',
        },
        {
            id: 2,
            title: 'Travel Tips',
            category: 'Travel',
            description: '<p>Best travel guide</p>',
        },
    ]);

    const [openModal, setOpenModal] = useState(false);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState({
        title: '',
        category: '',
        description: '',
    });

    // ADD BLOG
    const handleAddBlog = () => {
        const newBlog: Blog = {
            id: Date.now(),
            title: form.title,
            category: form.category,
            description: form.description,
        };

        setBlogs((prev) => [newBlog, ...prev]);

        setForm({
            title: '',
            category: '',
            description: '',
        });

        setOpenModal(false);
    };

    // DELETE BLOG
    const handleDelete = (id: number) => {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
    };

    // SEARCH
    const filteredBlogs = useMemo(() => {
        return blogs.filter((b) =>
            b.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [blogs, search]);

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Blog Management</h1>
                    <p className="text-gray-500">Create and manage blogs</p>
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-2 bg-[#207F36] cursor-pointer text-white px-5 py-3 rounded-2xl font-semibold"
                >
                    <FiPlus />
                    Add Blog
                </button>
            </div>

            {/* SEARCH */}
            <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-3 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search blog by title..."
                    className="w-full border border-[#207F36] focus:outline-0 focus:ring-0   pl-11 pr-4 py-3 rounded-2xl"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Title</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBlogs.map((blog) => (
                            <tr key={blog.id} className="border-t">
                                <td className="p-4 font-medium">
                                    {blog.title}
                                </td>

                                <td className="p-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                        {blog.category}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <button
                                        onClick={() =>
                                            handleDelete(blog.id)
                                        }
                                        className="text-red-500 hover:text-red-100 cursor-pointer "
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-[90%] max-w-2xl rounded-2xl p-6 relative">

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-4 cursor-pointer right-4"
                        >
                            <FiX size={22} />
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            Create Blog
                        </h2>

                        {/* CHILD COMPONENT */}
                        <BlogUpload
                            form={form}
                            setForm={setForm}
                            handleAddBlog={handleAddBlog}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}