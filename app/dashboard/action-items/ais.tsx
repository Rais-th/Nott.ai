'use client';

import { api } from '@/convex/_generated/api';
import { usePreloadedQueryWithAuth } from '@/lib/hooks';
import { Preloaded, useMutation } from 'convex/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function ActionItemsPage({
  preloadedItems,
}: {
  preloadedItems: Preloaded<typeof api.notes.getActionItems>;
}) {
  const actionItems = usePreloadedQueryWithAuth(preloadedItems);
  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    mutateActionItems({ id: actionId });
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Tâches à Faire
          </h1>
          <p className="mt-3 text-base text-gray-600 md:text-lg">
            {actionItems?.length || 0} tâches en attente
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {actionItems?.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition duration-200 ease-in-out hover:border-[#006400]/20 hover:shadow-md md:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        removeActionItem(item._id);
                        toast.success('Tâche terminée !');
                      }
                    }}
                    className="h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 text-[#006400] transition-colors duration-200 checked:border-[#006400] checked:bg-[#006400] hover:border-[#006400]/60"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-base font-medium text-gray-900 md:text-lg">
                    {item?.task}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 md:text-base">
                    <time dateTime={new Date(item?._creationTime).toISOString()}>
                      {new Date(item?._creationTime).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </time>
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 18v-6M9 15h6" />
                      </svg>
                      Note : {item?.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {actionItems?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 18v-6M9 15h6" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Aucune tâche pour le moment
              </h3>
              <p className="mt-2 text-center text-base text-gray-500">
                Commencez par enregistrer une note vocale pour générer des tâches.
              </p>
              <Link
                href="/record"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#006400] px-6 py-3 text-base font-medium text-white shadow-sm transition duration-200 ease-in-out hover:bg-[#006400]/90 hover:shadow md:text-lg"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvel Enregistrement
              </Link>
            </div>
          )}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
