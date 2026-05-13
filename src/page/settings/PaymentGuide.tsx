'use client';

import { useState } from 'react';
import { Editor } from 'primereact/editor';
import { FiSave } from 'react-icons/fi';

export default function PaymentGuidePage() {
    const [content, setContent] = useState<string>('');
    const [savedContent, setSavedContent] = useState<string>('');

    const handleSave = () => {
        setSavedContent(content);
        alert('Payment guide saved successfully!');
    };

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10">

            {/* HEADER */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Payment Guide
                </h1>
                <p className="text-gray-500">
                    Create and manage payment instructions for users
                </p>
            </div>

            {/* EDITOR CARD */}
            <div className="bg-white rounded-3xl shadow-lg p-6">

                {/* TITLE */}
                <h2 className="text-lg font-semibold mb-4">
                    Edit Payment Instructions
                </h2>

                {/* PRIME REACT EDITOR */}
                <Editor
                    value={content}
                    onTextChange={(e) => setContent(e.htmlValue || '')}
                    style={{ height: '320px' }}
                    placeholder="Write payment guide (Bkash, Nagad, Card, etc...)"
                />

                {/* SAVE BUTTON */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-[#207F36] cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        <FiSave />
                        Save Guide
                    </button>
                </div>
            </div>

            {/* PREVIEW */}
            {savedContent && (
                <div className="bg-white mt-8 p-6 rounded-3xl shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">
                        Preview
                    </h2>

                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: savedContent,
                        }}
                    />
                </div>
            )}

        </section>
    );
}