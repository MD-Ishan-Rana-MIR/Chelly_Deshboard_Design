'use client';

import React from 'react';
import { Editor } from 'primereact/editor';

type FormType = {
    title: string;
    category: string;
    description: string;
};

type Props = {
    form: FormType;
    setForm: React.Dispatch<React.SetStateAction<FormType>>;
    handleAddBlog: () => void;
};

export default function BlogUpload({
    form,
    setForm,
    handleAddBlog,
}: Props) {
    return (
        <div className="space-y-4">

            {/* TITLE */}
            <input
                value={form.title}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
                placeholder="Blog title"
                className="w-full border border-[#207F36] focus:outline-0 focus:ring-0 p-3  rounded-xl"
            />

            {/* CATEGORY */}
            <select
                value={form.category}
                onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                }
                className="w-full border border-[#207F36] focus:outline-0 focus:ring-0 p-3  rounded-xl"
            >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Tech">Tech</option>
            </select>

            {/* DESCRIPTION */}
            <div className="border rounded-xl overflow-hidden">
                <Editor
                    value={form.description}
                    onTextChange={(e) =>
                        setForm({
                            ...form,
                            description: e.htmlValue || '',
                        })
                    }
                    style={{ height: '200px' }}
                />
            </div>

            {/* BUTTON */}
            <button
                onClick={handleAddBlog}
                className="w-full bg-[#207F36] cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
                Publish Blog
            </button>
        </div>
    );
}