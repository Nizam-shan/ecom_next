import { PulseLoader } from "react-spinners";

export default function ComponentLevelLoader({ text, loading, size, color }) {
  return (
    <>
      <span className="flex gap-1 items-center">
        {text}
        <PulseLoader
          color={color}
          loading={loading}
          size={size || 10}
          data-testid="loader"
        />
      </span>
    </>
  );
}
