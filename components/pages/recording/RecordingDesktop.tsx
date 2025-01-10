import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { formatTimestamp } from '@/lib/utils';
import { useMutation } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RecordingDesktop({
  note,
  actionItems,
}: {
  note: Doc<'notes'>;
  actionItems: Doc<'actionItems'>[];
}) {
  const {
    generatingActionItems,
    generatingTitle,
    summary,
    transcription,
    title,
    _creationTime,
  } = note;
  const [originalIsOpen, setOriginalIsOpen] = useState<boolean>(true);

  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    // Trigger a mutation to remove the item from the list
    mutateActionItems({ id: actionId });
  }

  return (
    <div className="hidden md:block">
      <div className="max-width mt-5 flex items-center justify-between">
        <div />
        <h1
          className={`text-center text-xl font-medium leading-[114.3%] tracking-[-0.75px] text-dark md:text-[35px] lg:text-[43px] ${
            generatingTitle ? 'animate-pulse' : ''
          }`}
        >
          {generatingTitle ? (
            <div className="flex items-center gap-2">
              <span>Génération du titre</span>
              <div className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </div>
            </div>
          ) : (
            title ?? 'Note sans titre'
          )}
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-lg opacity-80">
            {formatTimestamp(Number(_creationTime))}
          </p>
        </div>
      </div>
      <div className="mt-[18px] grid h-fit w-full grid-cols-2 px-[30px] py-[19px] lg:px-[45px]">
        <div className="flex w-full items-center justify-center gap-[50px] border-r lg:gap-[70px]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOriginalIsOpen(true)}
              className={`text-xl leading-[114.3%] tracking-[-0.6px] text-dark lg:text-2xl ${
                originalIsOpen ? 'opacity-100 font-medium' : 'opacity-40'
              } transition-all duration-300`}
            >
              Transcription
            </button>
            <div
              onClick={() => setOriginalIsOpen(!originalIsOpen)}
              className="flex h-[20px] w-[36px] cursor-pointer items-center rounded-full bg-[#006400] px-[1px] transition-colors"
            >
              <div
                className={`h-[18px] w-4 rounded-[50%] bg-white ${
                  originalIsOpen ? 'translate-x-0' : 'translate-x-[18px]'
                } transition-all duration-300`}
              />
            </div>
            <button
              onClick={() => setOriginalIsOpen(false)}
              className={`text-xl leading-[114.3%] tracking-[-0.6px] text-dark lg:text-2xl ${
                !originalIsOpen ? 'opacity-100 font-medium' : 'opacity-40'
              } transition-all duration-300`}
            >
              Résumé
            </button>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-xl leading-[114.3%] tracking-[-0.75px] text-dark lg:text-2xl xl:text-[30px]">
            Tâches
          </h1>
        </div>
      </div>
      <div className="grid h-full w-full grid-cols-2 px-[30px] lg:px-[45px]">
        <div className="relative min-h-[70vh] w-full border-r px-5 py-3 text-justify text-xl font-[300] leading-[114.3%] tracking-[-0.6px] lg:text-2xl">
          {transcription ? (
            <div className="transition-opacity duration-300">
              {originalIsOpen ? transcription : summary}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-6">
              <div className="h-24 w-24 animate-spin rounded-full border-4 border-[#006400] border-t-transparent"></div>
              <p className="text-lg text-gray-500">Transcription en cours...</p>
            </div>
          )}
        </div>
        <div className="relative mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
          {generatingActionItems ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={`loading-${idx}`}
                  className="border-[#00000033] py-2 md:border-t-[1px]"
                >
                  <div className="flex w-full justify-center">
                    <div className="group w-full items-center rounded p-2">
                      <div className="flex items-center gap-4">
                        <div className="h-5 w-5 animate-pulse rounded-sm bg-gray-200"></div>
                        <div className="h-6 w-3/4 animate-pulse rounded-full bg-gray-200"></div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="ml-9 h-4 w-32 animate-pulse rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            actionItems?.map((item, idx) => (
              <div
                className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
                key={idx}
              >
                <div className="flex w-full justify-center">
                  <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
                    <div className="flex items-center">
                      <input
                        onChange={(e) => {
                          if (e.target.checked) {
                            removeActionItem(item._id);
                            toast.success('1 task completed.');
                          }
                        }}
                        type="checkbox"
                        checked={false}
                        className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
                      />
                      <label className="">{item?.task}</label>
                    </div>
                    <div className="flex justify-between md:mt-2">
                      <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
                        {new Date(Number(_creationTime)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-center">
            <Link
              className="rounded-[7px] bg-dark px-5 py-[15px] text-[17px] leading-[79%] tracking-[-0.75px] text-light md:text-xl lg:px-[37px]"
              style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
              href="/dashboard/action-items"
            >
              View All Action Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

