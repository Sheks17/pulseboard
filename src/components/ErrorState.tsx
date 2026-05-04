interface Props {
  onRetry: () => void;
  lang: string;
}

export default function ErrorState({ onRetry, lang }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="text-5xl">⚠️</span>
      <p className="text-[#818384] text-sm">
        {lang === "fr"
          ? "Quelque chose s'est mal passé. Réessayez."
          : "Something went wrong. Please try again."}
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-brand text-white rounded-full text-sm hover:opacity-90 transition-opacity"
      >
        {lang === "fr" ? "Réessayer" : "Try again"}
      </button>
    </div>
  );
}
