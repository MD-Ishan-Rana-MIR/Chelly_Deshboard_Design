'use client';

import { useState } from 'react';
import { Editor } from 'primereact/editor';
import { FiSave } from 'react-icons/fi';

type TermsType = {
    title: string;
    content: string;
};

export default function TermCondiction() {
    const [form, setForm] = useState<TermsType>({
        title: '',
        content: '',
    });

    // TITLE CHANGE


    // SAVE
    const handleSave = () => {
        console.log(form);
        alert('Terms & Conditions saved successfully!');
    };

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Terms & Conditions Upload
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Create or update your terms and conditions content
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 space-y-6">


                {/* PRIME REACT EDITOR */}
                <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                        Terms Content
                    </label>

                    <div className="border rounded-xl overflow-hidden">
                        <Editor
                            value={form.content}
                            onTextChange={(e) =>
                                setForm({
                                    ...form,
                                    content: e.htmlValue || '',
                                })
                            }
                            style={{ height: '320px' }}
                        />
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold w-full"
                >
                    <FiSave />
                    Save Terms & Conditions
                </button>
            </div>
        </section>
    );
}