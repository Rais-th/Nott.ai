'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getCurrentFormattedDate } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const RecordVoicePage = () => {
  const [title, setTitle] = useState('Record your voice note');
  const envVarsUrl = useQuery(api.utils.envVarsMissing);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const { user } = useUser();

  const generateUploadUrl = useMutation(api.notes.generateUploadUrl);
  const createNote = useMutation(api.notes.createNote);

  const router = useRouter();

  async function startRecording() {
    setIsRunning(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: any = [];

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'audio/mp3' },
        body: audioBlob,
      });
      const { storageId } = await result.json();

      if (user) {
        let noteId = await createNote({
          storageId,
        });

        router.push(`/recording/${noteId}`);
      }
    };
    setMediaRecorder(recorder as any);
    recorder.start();
  }

  function stopRecording() {
    // @ts-ignore
    mediaRecorder.stop();
    setIsRunning(false);
  }

  const formattedDate = getCurrentFormattedDate();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  function formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  const handleRecordClick = () => {
    if (title === 'Record your voice note') {
      setTitle('Recording...');
      startRecording();
    } else if (title === 'Recording...') {
      setTitle('Processing...');
      stopRecording();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gray-50 px-4 py-12 md:py-16">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-center text-base text-gray-500 md:text-lg">
          {formattedDate}
        </p>
        
        <div className="relative mx-auto mt-12 flex aspect-square w-full max-w-sm items-center justify-center md:mt-16">
          <div
            className={`recording-box absolute h-full w-full rounded-full bg-gradient-to-b from-[#006400]/20 to-[#006400]/5 p-8 ${
              title !== 'Record your voice note' && title !== 'Processing...'
                ? 'record-animation'
                : ''
            }`}
          >
            <div className="h-full w-full rounded-full bg-white/80 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-medium text-gray-900 md:text-5xl">
              {formatTime(Math.floor(totalSeconds / 60))}:{formatTime(totalSeconds % 60)}
            </h2>
          </div>
        </div>

        <div className="mt-12 flex justify-center md:mt-16">
          {envVarsUrl ? (
            <MissingEnvVars url={envVarsUrl} />
          ) : (
            <button
              onClick={handleRecordClick}
              className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-[#006400] shadow-lg transition duration-200 ease-in-out hover:bg-[#006400]/90 hover:shadow-xl md:h-20 md:w-20"
              type="button"
              aria-label={isRunning ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
            >
              {!isRunning ? (
                <img
                  src={'/icons/nonrecording_mic.svg'}
                  alt="recording mic"
                  width={32}
                  height={32}
                  className="h-8 w-8 text-white md:h-10 md:w-10"
                />
              ) : (
                <img
                  src={'/icons/recording_mic.svg'}
                  alt="recording mic"
                  width={32}
                  height={32}
                  className="h-8 w-8 animate-pulse text-white md:h-10 md:w-10"
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordVoicePage;

function MissingEnvVars(props: { url: string }) {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Missing Environment Variables
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Set up your{' '}
              <a className="underline" target="_blank" href={props.url}>
                Convex environment variables here
              </a>{' '}
              with API keys from{' '}
              <a
                className="underline"
                target="_blank"
                href="https://api.together.xyz/settings/api-keys"
              >
                Together.ai
              </a>{' '}
              and{' '}
              <a
                className="underline"
                target="_blank"
                href="https://replicate.com/account/api-tokens"
              >
                Replicate
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
