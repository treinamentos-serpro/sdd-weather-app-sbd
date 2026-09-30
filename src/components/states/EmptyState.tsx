interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Confira o nome informado e tente uma nova busca.',
}: EmptyStateProps) {
  return (
    <div
      className="rounded-lg border border-white/10 bg-white/5 p-6 text-center shadow-glass backdrop-blur-md"
      role="status"
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{hint}</p>
    </div>
  );
}
