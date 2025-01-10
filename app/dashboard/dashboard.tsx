'use client';

import RecordedfileItemCard from '@/components/pages/dashboard/RecordedfileItemCard';
import { api } from '@/convex/_generated/api';
import { usePreloadedQueryWithAuth } from '@/lib/hooks';
import { Preloaded, useAction } from 'convex/react';
import { FunctionReturnType } from 'convex/server';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardHomePage({
  preloadedNotes,
}: {
  preloadedNotes: Preloaded<typeof api.notes.getNotes>;
}) {
  const allNotes = usePreloadedQueryWithAuth(preloadedNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [relevantNotes, setRelevantNotes] =
    useState<FunctionReturnType<typeof api.notes.getNotes>>();

  const performMyAction = useAction(api.together.similarNotes);

  const handleSearch = async (e: any) => {
    e.preventDefault();

    console.log({ searchQuery });
    if (searchQuery === '') {
      setRelevantNotes(undefined);
    } else {
      const scores = await performMyAction({ searchQuery: searchQuery });
      const scoreMap: Map<string, number> = new Map();
      for (const s of scores) {
        scoreMap.set(s.id, s.score);
      }
      const filteredResults = allNotes.filter(
        (note) => (scoreMap.get(note._id) ?? 0) > 0.6,
      );
      setRelevantNotes(filteredResults);
    }
  };

  const finalNotes = relevantNotes ?? allNotes;

  return (
    <div suppressHydrationWarning={true} className="min-h-screen bg-gray-50 px-4 pb-12 pt-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Vos Notes Vocales
        </h1>
        
        {/* search bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#006400] focus-within:ring-1 focus-within:ring-[#006400]">
            <Image
              src="/icons/search.svg"
              width={24}
              height={24}
              alt="search"
              className="text-gray-400"
            />
            <form onSubmit={handleSearch} className="w-full">
              <input
                type="text"
                placeholder="Rechercher dans vos notes..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="w-full border-0 bg-transparent text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0"
              />
            </form>
          </div>
        </div>

        {/* recorded items */}
        <div className="mx-auto mt-8 max-w-5xl space-y-4">
          {finalNotes &&
            finalNotes.map((item, index) => (
              <RecordedfileItemCard {...item} key={index} />
            ))}
          {finalNotes.length === 0 && (
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10">
              <p className="text-center text-xl font-medium text-gray-500">
                Vous n'avez pas encore <br /> d'enregistrements.
              </p>
            </div>
          )}
        </div>

        {/* actions button container */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-6 px-4 md:flex-row md:gap-8">
          <Link
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#006400] px-6 py-3 text-base font-medium text-white shadow-sm transition duration-200 ease-in-out hover:bg-[#006400]/90 hover:shadow md:w-auto md:text-lg"
            href="/record"
          >
            Nouvel Enregistrement
          </Link>
          {allNotes && (
            <Link
              className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition duration-200 ease-in-out hover:bg-gray-50 hover:shadow md:w-auto md:text-lg"
              href="/dashboard/action-items"
            >
              Voir les Tâches
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
