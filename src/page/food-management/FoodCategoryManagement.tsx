

import { useState } from "react";
import Category from "./Category";
import Food from "./Food";
import Offer from "./Offer";
import Banner from "./Banner";
import Collection from "./Collection";

export default function FoodCategoryManagement() {
    const [openPage, setOpenPage] = useState<'Food' | 'Category' | 'Offer'|'Banner'|'Collection'>('Food');

    return (
        <div className="p-6">

            {/* TAB BUTTONS */}
            <div className="flex items-center gap-3 mb-6 bg-gray-100 p-2 rounded-2xl w-fit">

                {/* FOOD TAB */}
                <button
                    onClick={() => setOpenPage('Food')}
                    className={`px-6 py-2 rounded-xl font-semibold cursor-pointer transition-all duration-200
                    ${openPage === 'Food'
                            ? 'bg-[#207F36] text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                >
                    🍔 Food
                </button>

                {/* CATEGORY TAB */}
                <button
                    onClick={() => setOpenPage('Category')}
                    className={`px-6 py-2 rounded-xl font-semibold cursor-pointer transition-all duration-200
                    ${openPage === 'Category'
                            ? 'bg-[#207F36] text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                >
                    🗂️ Category
                </button>

                <button
                    onClick={() => setOpenPage('Offer')}
                    className={`px-6 py-2 rounded-xl font-semibold cursor-pointer transition-all duration-200
                    ${openPage === 'Offer'
                            ? 'bg-[#207F36] text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                >
                    🎁 Offer
                </button>

                <button
                    onClick={() => setOpenPage('Banner')}
                    className={`px-6 py-2 rounded-xl font-semibold cursor-pointer transition-all duration-200
                    ${openPage === 'Banner'
                            ? 'bg-[#207F36] text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                >
                    📢 Banner
                </button>
                <button
                    onClick={() => setOpenPage('Collection')}
                    className={`px-6 py-2 rounded-xl font-semibold cursor-pointer transition-all duration-200
                    ${openPage === 'Collection'
                            ? 'bg-[#207F36] text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                >
                    📢 Collection
                </button>

            </div>

            {/* CONTENT */}
            <div className="mt-4">
                {openPage === 'Category' && <Category />}
                {openPage === 'Food' && <Food />}
                {openPage === 'Offer' && <Offer />}
                {openPage === 'Banner' && <Banner />}
                {openPage === 'Collection' &&  <Collection/> }
            </div>

        </div>
    );
}