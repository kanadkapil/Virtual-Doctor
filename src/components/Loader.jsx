export default function Loader({ text = "Loading", fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      {text && <p className="text-sm text-base-content/70 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-base-200/50">
        {content}
      </div>
    );
  }

  return content;
}
