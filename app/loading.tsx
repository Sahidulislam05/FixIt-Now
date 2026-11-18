export default function RootLoading() {
  return (
    <main className="flex flex-1 items-center justify-center py-32" aria-busy="true" aria-label="Loading">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 animate-tick rounded-full bg-primary"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </main>
  );
}
