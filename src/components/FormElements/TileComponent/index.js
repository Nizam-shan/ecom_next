export default function TileComponent({ data, seleceted = [], onClick }) {
  return (
    <>
      {data && data.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-1">
          {data.map((item) => (
            <label
              key={item.id}
              className={`cursor-pointer ${
                seleceted &&
                seleceted.length &&
                seleceted.map((item) => item.id).indexOf(item.id) !== -1
                  ? "bg-black"
                  : ""
              }`}
              onClick={() => onClick(item)}
            >
              <span
                className={`rounded-lg border border-black px-6 py-2 font-bold ${
                  seleceted &&
                  seleceted.length &&
                  seleceted.map((item) => item.id).indexOf(item.id) !== -1
                    ? "text-white"
                    : ""
                }`}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      ) : null}
    </>
  );
}
