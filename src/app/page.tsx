export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream">
      <h1 className="pt-12 text-center text-4xl font-semibold text-umber">
        tracknseek
      </h1>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="w-64 rounded-full bg-umber px-8 py-3 text-lg font-medium text-cream"
          >
            create a session
          </button>
          <button
            type="button"
            className="w-64 rounded-full bg-umber px-8 py-3 text-lg font-medium text-cream"
          >
            join a session
          </button>
        </div>
      </div>
    </div>
  );
}
