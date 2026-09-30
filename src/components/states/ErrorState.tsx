interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="rounded-lg border border-red-300/30 bg-red-950/30 p-6 shadow-glass backdrop-blur-md"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-white">Não foi possível concluir</h2>
      <p className="mt-2 text-sm text-red-100">{message}</p>
      <button
        className="mt-5 rounded-md bg-white px-4 py-2 font-semibold text-night-900 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}
