import React, { useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  useAllEbtPackagesQuery,
  useAddEbtPackageMutation,
  useUpdateEbtPackageMutation,
  useDeleteEbtPackageMutation,
} from "../../api/ebtPackage/ebtPackageApi";

interface EbtPackage {
  id: number;
  title: string;
  price: number;
  product_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function EbtPackagesPage() {
  const { data, isLoading } = useAllEbtPackagesQuery(undefined);
  const [addEbtPackage, { isLoading: isAdding }] = useAddEbtPackageMutation();
  const [updateEbtPackage, { isLoading: isUpdating }] = useUpdateEbtPackageMutation();
  const [deleteEbtPackage] = useDeleteEbtPackageMutation();

  const packages: EbtPackage[] = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<EbtPackage | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    product_url: "",
    is_active: true,
  });

  const openAddModal = () => {
    setEditingPackage(null);
    setFormData({ title: "", price: "", product_url: "", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: EbtPackage) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      price: pkg.price.toString(),
      product_url: pkg.product_url || "",
      is_active: pkg.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPackage) {
        const res = await updateEbtPackage({
          id: editingPackage.id,
          data: formData,
        }).unwrap();
        if (res?.success) toast.success("Package updated successfully");
      } else {
        const res = await addEbtPackage(formData).unwrap();
        if (res?.success) toast.success("Package created successfully");
      }
      closeModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteEbtPackage(id).unwrap();
          if (res?.success) {
            Swal.fire("Deleted!", "The EBT package has been deleted.", "success");
          }
        } catch (error: any) {
          toast.error(error?.data?.message || "Failed to delete package");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a61]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">EBT Packages</h1>
          <p className="text-gray-500 text-sm mt-1">Manage EBT packages displayed on the checkout page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#1e3a61] hover:bg-[#172c4a] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Package
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Product URL</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No EBT packages found. Click "Add Package" to create one.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{pkg.title}</td>
                  <td className="p-4 font-bold text-[#1e3a61]">${Number(pkg.price).toFixed(2)}</td>
                  <td className="p-4">
                    {pkg.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {pkg.product_url ? (
                      <a
                        href={pkg.product_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate max-w-[200px] inline-block"
                      >
                        {pkg.product_url}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Package"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPackage ? "Edit EBT Package" : "Add New EBT Package"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a61]/20 focus:border-[#1e3a61] transition-all"
                  placeholder="e.g. Bronze Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a61]/20 focus:border-[#1e3a61] transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product URL (Optional)</label>
                <input
                  type="url"
                  value={formData.product_url}
                  onChange={(e) => setFormData({ ...formData, product_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a61]/20 focus:border-[#1e3a61] transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-[#1e3a61] rounded focus:ring-[#1e3a61] cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                  Active (Show on Checkout Form)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="px-5 py-2.5 text-white bg-[#1e3a61] hover:bg-[#172c4a] rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(isAdding || isUpdating) && (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  )}
                  {editingPackage ? "Save Changes" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
