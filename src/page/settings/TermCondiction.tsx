
import { useEffect, useState } from 'react';
import { Editor } from 'primereact/editor';
import { FiSave } from 'react-icons/fi';
import { useGetSettingPageQuery, useStoreSettingPageMutation } from '../../api/setting/settingApi';
import { errorMessage } from '../../lib/msg/errorMsg';
import toast from 'react-hot-toast';
import DotsLoader from '../../components/loader/DotsLoader';

type TermsType = {
    terms_conditions: string;
};

export default function TermCondiction() {
    const [form, setForm] = useState<TermsType>({
        terms_conditions: '',
    });

    // ============================== Get Privacy Policy ==============================
    const {
        data,
        isLoading: isTermsLoading,
        refetch,
    } = useGetSettingPageQuery('terms_conditions');

    // ============================== Save Privacy Policy ==============================
    const [storeSettingPage, { isLoading }] = useStoreSettingPageMutation();

    useEffect(() => {
        if (data?.data?.terms_conditions) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                terms_conditions: data.data.terms_conditions,
            });
        }
    }, [data?.data?.terms_conditions]);

    const handleSave = async () => {
        // Remove HTML tags and check if editor is actually empty
        const plainText = form.terms_conditions
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, '')
            .trim();

        if (!plainText) {
            return toast.error('Privacy policy is required');
        }

        const payload = {
            terms_conditions: form.terms_conditions
        }

        try {
            const res = await storeSettingPage(payload).unwrap();

            toast.success(res?.message || 'Privacy Policy Saved Successfully');

            refetch();
            return;
        } catch (error) {
            return errorMessage(error);
        }
    };

      // ============================== Loading State ==============================
      if (isTermsLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <DotsLoader />
          </div>
        );
      }

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
                            value={form.terms_conditions}
                            onTextChange={(e) =>
                                setForm({
                                    ...form,
                                    terms_conditions: e.htmlValue || '',
                                })
                            }
                            style={{ height: '520px' }}
                        />
                    </div>
                </div>

                {/* SAVE BUTTON */}
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
                              <span>Save Term & Condiction</span>
                            </>
                          )}
                        </button>
            </div>
        </section>
    );
}