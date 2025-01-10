import Link from 'next/link';

const Banner = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0">
      <div className="flex h-full w-full flex-col items-center justify-center pt-20 md:pt-32">
        <a
          href="https://popuzar.com"
          target="_blank"
          rel="noreferrer"
          className="mb-8 rounded-full bg-[#006400]/10 px-6 py-2 text-sm font-medium text-[#006400] transition duration-300 ease-in-out hover:bg-[#006400]/20 sm:text-base"
        >
          Propulsé par <span className="font-semibold">Popuzar AI</span>
        </a>
        <h1 className="max-w-4xl text-center text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          Vos notes de réunion <br className="hidden lg:inline-block" />
          résumées par l'IA.
        </h1>
        <p className="mt-8 max-w-2xl text-center text-xl font-light leading-relaxed text-gray-600 lg:text-2xl">
          Nott AI transforme vos notes vocales en{' '}
          <span className="font-medium text-gray-900">
            résumés structurés <br className="hidden lg:inline-block" />
          </span>{' '}
          tout en{' '}
          <span className="font-medium text-gray-900">garantissant la confidentialité</span> de vos données d'entreprise.
        </p>
        <Link
          href={'/dashboard'}
          className="mt-12 inline-flex items-center justify-center gap-3 rounded-full bg-[#006400] px-8 py-4 text-lg font-medium text-white shadow-lg transition duration-300 ease-in-out hover:bg-[#006400]/90 hover:shadow-xl md:text-xl"
        >
          Commencer
          <img
            src="/icons/get-started.svg"
            alt="get started icon"
            className="h-6 w-6"
          />
        </Link>
      </div>
    </div>
  );
};

export default Banner;
