import { useState } from "react";
import { Editor } from "primereact/editor";
import { usePostBlogMutation } from "../../api/blog/blogApi";
import { errorMessage } from "../../lib/msg/errorMsg";
import toast from "react-hot-toast";
import ConfirmModal from "../../lib/alert/ConfirmModal";
import { useGetAllCollectionQuery } from "../../api/collection/collectionApi";
import type { CollectionItem } from "../../lib/type/type";

type FormType = {
    title: string;
    category: string;
    description: string;
    image: File | null;
};

type FormErrors = Partial<Record<keyof FormType, string>>;

export type CategoryType = {
    id: number;
    name: string;
    image: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export default function BlogUpload({setOpenModal}:{setOpenModal:React.Dispatch<React.SetStateAction<boolean>>}) {
    const [form, setForm] = useState<FormType>({
        title: "",
        category: "",
        description: "",
        image: null,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [preview, setPreview] = useState<string | null>(null);

    const [openPopUpModal, setOpenPopUpModal] = useState(false);

    const {data:collection} = useGetAllCollectionQuery({});

    console.log("collection",collection?.data);

    const collectionData : CollectionItem[] = collection?.data || [];

    // const { data: categories } = useAllCategoryQuery(undefined);
    // const categoryData: CategoryType[] = categories?.data?.data || [];

    const [createBlog, { isLoading }] = usePostBlogMutation();

    // ================= IMAGE =================
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    // ================= VALIDATION =================
    const validate = () => {
        const newErrors: FormErrors = {};

        if (!form.title || form.title.length < 3) {
            newErrors.title = "Title must be at least 3 characters";
        }

        if (!form.category) {
            newErrors.category = "Category is required";
        }

        if (!form.description || form.description.length < 10) {
            newErrors.description =
                "Description must be at least 10 characters";
        }

        if (!form.image) {
            newErrors.image = "Image is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ================= SUBMIT (PURE FUNCTION) =================
    const submitBlog = async () => {
        if (!validate()) return;

        const formData = new FormData();

        try {
            formData.append("title", form.title);
            formData.append("category_id", form.category);
            formData.append("content", form.description);

            if (form.image) {
                formData.append("image", form.image);
            }

            const res = await createBlog(formData).unwrap();

            if (res) {
                toast.success("Blog created successfully");

                setForm({
                    title: "",
                    category: "",
                    description: "",
                    image: null,
                });

                setPreview(null);
                setErrors({});
                setOpenPopUpModal(false);
                return setOpenModal(false);
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    // ================= MODAL HANDLERS =================
    const openPopUp = () => {
        const isValid = validate();

        if (!isValid) return;

        setOpenPopUpModal(true);
    };
    const handleClosePopUp = () => setOpenPopUpModal(false);
    const handleConfirm = () => submitBlog();

    // ================= HANDLE INPUT =================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    return (
        <div className="space-y-4">

            {/* TITLE */}
            <div>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Blog title"
                    className="w-full rounded-xl border border-[#207F36] p-3 focus:outline-none"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.title}
                    </p>
                )}
            </div>

            {/* CATEGORY */}
            <div>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#207F36] p-3 focus:outline-none"
                >
                    <option value="">Select category</option>
                    {collectionData.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.category}
                    </p>
                )}
            </div>

            {/* IMAGE */}
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-xl border border-[#207F36] p-3"
                />

                {errors.image && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.image}
                    </p>
                )}

                {preview && (
                    <div className="mt-3">
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-48 w-full rounded-xl border object-cover"
                        />
                    </div>
                )}
            </div>

            {/* DESCRIPTION */}
            <div>
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

                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                    </p>
                )}
            </div>

            {/* BUTTON */}
            <button
                onClick={openPopUp}
                className="w-full rounded-xl bg-[#207F36] py-3 font-semibold text-white hover:bg-green-700 cursor-pointer "
            >
                Publish Blog
            </button>

            {/* CONFIRM MODAL */}
            <ConfirmModal
                open={openPopUpModal}
                title="Are you sure you want to upload this blog?"
                description="The blog will be published and visible to users."
                confirmText={isLoading ? "Uploading..." : "Yes, Upload"}
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleClosePopUp}
                loading={isLoading}
            />
        </div>
    );
}