import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import Link from 'next/link';

const RecordedfileItemCard = ({
  title,
  count,
  _creationTime,
  _id,
}: {
  title?: string;
  count: number;
  _creationTime: number;
  _id: any;
}) => {
  const deleteNote = useMutation(api.notes.removeNote);

  return (
    <Link
      href={`/recording/${_id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition duration-200 ease-in-out hover:border-[#006400]/20 hover:bg-gray-50"
    >
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006400]/10 md:h-12 md:w-12">
            <img
              src="/icons/file_symbol.svg"
              width={20}
              height={20}
              alt="file"
              className="h-5 w-5 text-[#006400] md:h-6 md:w-6"
            />
          </div>
          <h2 className="text-lg font-medium text-gray-900 md:text-xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden items-center gap-8 text-sm text-gray-500 md:flex lg:text-base">
            <time dateTime={new Date(_creationTime).toISOString()}>
              {new Date(_creationTime).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
            <span>{count} tâches</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteNote({ id: _id });
            }}
            className="group/delete flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ease-in-out hover:bg-red-50"
            aria-label="Supprimer la note"
          >
            <img 
              src={'/icons/delete.svg'} 
              alt="delete" 
              width={20} 
              height={20}
              className="h-5 w-5 text-gray-400 transition-colors group-hover/delete:text-red-500" 
            />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RecordedfileItemCard;
