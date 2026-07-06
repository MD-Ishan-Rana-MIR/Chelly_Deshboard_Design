import { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import { useAllCategoryQuery } from "../../api/category/categoryApi";
import {
    useSingleBlogQuery,
    useUpdateBlogMutation,
} from "../../api/blog/blogApi";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { imgUrl } from "../../lib/url/url";

type FormType = {
    title: string;
    category: string;
    description: string;
    image: File | null;
};

export type CategoryType = {
    id: number;
    name: string;
    image: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export default function BlogEditModal({
    editId,
    setOpenEditModal,
}: {
    editId: number | null;
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { data } = useSingleBlogQuery(editId, {
        skip: !editId,
    });

    const [form, setForm] = useState<FormType>({
        title: "",
        category: "",
        description: "",
        image: null,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [openPopUpModal, setOpenPopUpModal] = useState(false);

    const { data: categories } = useAllCategoryQuery(undefined);
    const categoryData: CategoryType[] = categories?.data?.data || [];

    const [updateBlog, { isLoading }] = useUpdateBlogMutation();

    // ================= SET DEFAULT VALUE =================
    useEffect(() => {
        const blog = data?.data;

        if (blog) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                title: blog.title || "",
                category: String(blog.category_id || ""),
                description: blog.content || "",
                image: null,
            });

            setPreview(blog.image || null);
        }
    }, [data]);

    // ================= IMAGE =================
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    // ================= HANDLE INPUT =================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ================= SUBMIT =================
    const submitBlog = async () => {
        if (!editId) return;

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("category_id", form.category);
            formData.append("content", form.description);

            if (form.image) {
                formData.append("image", form.image);
            }

            const res = await updateBlog({editId,formData}).unwrap();

            if (res) {
                toast.success("Blog updated successfully");

                setOpenPopUpModal(false);
                setOpenEditModal(false);
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    const openPopUp = () => {
        setOpenPopUpModal(true);
    };

    // ================= IMAGE PREVIEW =================
    const imageSrc = preview
        ? preview.startsWith("blob:")
            ? preview
            : `${imgUrl}/${preview}`
        : "";

    return (
        <div className="space-y-4">
            {/* TITLE */}
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Blog title"
                className="w-full rounded-xl border border-[#207F36] p-3 focus:outline-none"
            />

            {/* CATEGORY */}
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#207F36] p-3 focus:outline-none"
            >
                <option value="">Select category</option>
                {categoryData.map((category:CategoryType) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            {/* IMAGE */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-[#207F36] p-3"
            />

            {/* IMAGE PREVIEW */}
            {preview && (
                <div className="mt-3">
                    <img
                        src={imageSrc}
                        alt="Preview"
                        className="h-48 w-full rounded-xl border object-cover"
                    />
                </div>
            )}

            {/* DESCRIPTION */}
            <Editor
                value={form.description}
                onTextChange={(e) =>
                    setForm((prev) => ({
                        ...prev,
                        description: e.htmlValue || "",
                    }))
                }
                style={{ height: "200px" }}
            />

            {/* BUTTON */}
            <button
                onClick={openPopUp}
                disabled={isLoading}
                className="w-full cursor-pointer rounded-xl bg-[#207F36] py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
                {isLoading ? "Updating..." : "Update Blog"}
            </button>

            {/* CONFIRM MODAL */}
            <ConfirmModal
                open={openPopUpModal}
                title="Are you sure you want to update this blog?"
                description="The updated blog will be visible to users."
                confirmText={
                    isLoading ? "Updating..." : "Yes, Update"
                }
                cancelText="Cancel"
                onConfirm={submitBlog}
                onCancel={() => setOpenPopUpModal(false)}
                loading={isLoading}
            />
        </div>
    );
}