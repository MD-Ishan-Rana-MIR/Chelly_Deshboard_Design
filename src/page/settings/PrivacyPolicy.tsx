
import { useEffect, useState } from 'react';
import { Editor } from 'primereact/editor';
import { FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

import DotsLoader from '../../components/loader/DotsLoader';
import { errorMessage } from '../../lib/msg/errorMsg';
import { useGetSettingPageQuery, useStoreSettingPageMutation } from '../../api/setting/settingApi';

type PrivacyType = {
  privacy_policy: string;
};

export default function PrivacyPolicy() {
  const [form, setForm] = useState<PrivacyType>({
    privacy_policy: '',
  });

  // ============================== Get Privacy Policy ==============================
  const {
    data,
    isLoading: isPrivacyLoading,
    refetch,
  } = useGetSettingPageQuery('privacy_policy');

  // ============================== Save Privacy Policy ==============================
  const [storeSettingPage, { isLoading }] = useStoreSettingPageMutation();

  useEffect(() => {
    if (data?.data?.privacy_policy) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        privacy_policy: data.data.privacy_policy,
      });
    }
  }, [data?.data?.privacy_policy]);

  const handleSave = async () => {
    // Remove HTML tags and check if editor is actually empty
    const plainText = form.privacy_policy
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, '')
      .trim();

    if (!plainText) {
      return toast.error('Privacy policy is required');
    }

    const payload = {
      privacy_policy: form.privacy_policy
    }

    try {
      const res = await storeSettingPage(payload).unwrap();

      toast.success(res?.message || 'Privacy Policy Saved Successfully');

      refetch();
    } catch (error) {
      errorMessage(error);
    }
  };

  // ============================== Loading State ==============================
  if (isPrivacyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Privacy Policy Upload
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Create or update your privacy policy content
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 space-y-6">
        {/* Editor */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            Privacy Content
          </label>

          <div className="border rounded-xl overflow-hidden">
            <Editor
              value={form.privacy_policy}
              onTextChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  privacy_policy: e.htmlValue || '',
                }))
              }
              style={{ height: '520px' }}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="flex cursor-pointer items-center justify-center gap-2 bg-[#207F36] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold w-full disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <DotsLoader />
          ) : (
            <>
              <FiSave size={18} />
              <span>Save Privacy Policy</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}