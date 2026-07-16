/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2,FiX, FiEdit } from "react-icons/fi";
import { Editor } from "primereact/editor";
import { useAllOfferQuery, useDeleteOfferMutation, usePostOfferMutation, useUpdateOfferMutation } from "../../api/offer/offerApi";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import BannerSkeleton from "../../components/skeleton/BannerSkeleton";

type Offer = {
    id: number;
    title: string;
    status: string;
    link: string | null;
    created_at: string;
    updated_at: string
};

export default function Offer() {

    // OFFERS STATE
    const [offers, setOffers] = useState<Offer[]>([]);
    const [title, settitle] = useState<string>("")
    const [link, setLink] = useState<string>("");


    // ==========================================All Offer Api==========================================


    const { data, isLoading } = useAllOfferQuery({});



    const offerData: Offer[] = data?.data?.data || [];

    useEffect(() => {
        setOffers(offerData);
    }, [offerData]);










    // MODAL STATE
    const [openModal, setOpenModal] = useState(false);

    const offerModalClose = () => {
        setOpenModal(false);
        settitle("");
        setLink("");
    }

    const [editId, setEditId] = useState(Number);
    const [offerPopUp, setOfferPopUp] = useState(false);



    // =========================================== Offer Edit Related Function =======================================
    const handleEdit = (offer: Offer) => {
        settitle(offer.title);
        setLink(offer.link || "");
        setOpenModal(true);
        setEditId(offer?.id)
    }

    const OpenPopUpModal = async () => {
        setOfferPopUp(true);

    }

    const handleOfferClose = () => {
        setOfferPopUp(false);
        settitle("");
        setLink("");
    }


    // =============================================== Offer Upload Api ==================================================



    const [postOffer, { isLoading: postLoading }] = usePostOfferMutation();
    const [updateOffer, { isLoading: updateLoading }] = useUpdateOfferMutation();





    // ADD OFFER
    const handleSubmit = async () => {
        const payload = {
            title: title,
            link: link || null,
            status: "active"
        }
        if (editId) {
            try {
                const res = await updateOffer({ editId, payload }).unwrap();
                if (res) {
                    toast.success(res?.message);
                    settitle("");
                    setLink("");
                    setOpenModal(false)
                    return setOfferPopUp(false);
                }
            } catch (error) {
                return errorMessage(error)
            }

        } else {
            const payload = {
                title: title,
                link: link || null,
                status: "active"
            }
            try {
                const res = await postOffer(payload).unwrap();
                if (res) {
                    settitle("");
                    setLink("");
                    setOpenModal(false);
                    return setOfferPopUp(false);
                }
            } catch (error) {
                return errorMessage(error)
            }
        }

        setOpenModal(false);
    };





    // ================================== DELETE OFFER =======================================

    const [deleteOffer,{isLoading:deleteLoading}] = useDeleteOfferMutation();




    const [deleteOfferPopUp, setDeleteOfferPopUp] = useState(false);



    const closeDeleteOfferPopUp = () => {
        setDeleteOfferPopUp(false)
    }




    const [deleteId, setDeleteId] = useState(Number);

    const openDeleteOfferPopUp = (id: number) => {
        setDeleteOfferPopUp(true);
        setDeleteId(id);
    }



    const handleDelete = async () => {
        try {
            const res = await deleteOffer(deleteId).unwrap();
            if(res){
                setDeleteOfferPopUp(false);
                return toast.success(res?.message)
            }
        } catch (error) {
            return errorMessage(error)
        }
    };


    if (isLoading) {
        return (
            <div>
                <BannerSkeleton />
            </div>
        )
    }

    return (
        <section className="min-h-screen bg-gray-50 p-6 md:p-10 rounded-2xl ">

            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Offer Management
                    </h1>

                    <p className="text-gray-500">
                        Create and manage offers
                    </p>
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[#207F36] px-5 py-3 font-semibold text-white"
                >
                    <FiPlus />
                    Add Offer
                </button>

            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>

                            <th className="p-4 text-left">
                                Title
                            </th>

                            <th className="p-4 text-right">
                                Actions
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {offers.length > 0 ? (
                            offers.map((offer) => (
                                <tr key={offer.id} className="border-t">

                                    <td className="p-4">

                                        <div
                                            className="prose max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: offer.title,
                                            }}
                                        />

                                    </td>

                                    <td className="p-4">

                                        <div className="flex justify-end gap-3">

                                            <button onClick={() => handleEdit(offer)} className=" cursor-pointer rounded-xl p-2 text-[#207F36] hover:bg-green-100">
                                                <FiEdit />
                                            </button>

                                            <button
                                                onClick={() => openDeleteOfferPopUp(offer.id)}
                                                className="rounded-xl p-2 text-red-600 hover:bg-red-50 cursor-pointer "
                                            >
                                                <FiTrash2 />
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="p-10 text-center text-gray-500"
                                >
                                    No offers found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    <div className="relative w-[95%] max-w-3xl rounded-2xl bg-white p-6">

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={offerModalClose}
                            className="absolute cursor-pointer right-4 top-4 text-gray-600"
                        >
                            <FiX size={22} />
                        </button>

                        {/* TITLE */}
                        <h2 className="mb-5 text-2xl font-bold">
                            Create Offer
                        </h2>

                        {/* EDITOR */}
                        <div className="mb-5 overflow-hidden rounded-xl border">
                            <Editor
                                value={title}
                                onTextChange={(e) => settitle(e.htmlValue || "")}
                                style={{ height: "220px" }}
                            />
                        </div>

                        {/* LINK INPUT */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://example.com/product"
                                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-[#207F36] focus:ring-1 focus:ring-[#207F36]"
                            />
                        </div>

                        {/* SAVE BUTTON */}
                        <button
                            onClick={OpenPopUpModal}
                            className="w-full cursor-pointer rounded-xl bg-[#207F36] py-3 font-semibold text-white"
                        >
                            Save Offer
                        </button>

                    </div>

                </div>
            )}

            <ConfirmModal
                open={deleteOfferPopUp}
                title="Are you sure you want to sure delete?"
                description="Once deleted, this offer cannot be recovered."
                confirmText={isLoading ? 'Deleting...' : "Delete"}
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={closeDeleteOfferPopUp}
                 loading={deleteLoading}
            />

            {/* // For Post and Update  */}


            <ConfirmModal
                open={offerPopUp}
                title={
                    editId
                        ? "Are you sure you want to update this offer?"
                        : "Are you sure you want to upload this offer?"
                }
                description={
                    editId
                        ? "The offer information will be updated."
                        : "The new offer will be uploaded and visible to users."
                }
                confirmText={
                    (postLoading || updateLoading)
                        ? editId
                            ? "Updating..."
                            : "Uploading..."
                        : editId
                            ? "Update"
                            : "Upload"
                }
                cancelText="Cancel"
                onConfirm={handleSubmit}
                onCancel={handleOfferClose}
                loading={postLoading || updateLoading}
            />








        </section>
    );
}