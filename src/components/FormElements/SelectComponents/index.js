export default function SelectComponent({
  label,
  value,
  onChange,
  options = {},
}) {
  console.log("🚀 ~ file: index.js:7 ~ options:", options);

  return (
    <>
      <div className="relative">
        <p className="pt-0 pb-0 pr-2 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600  absolute bg-white">
          {label}
        </p>
        <select
          value={value}
          onChange={onChange}
          className="border p-2 placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 mr-0 mt-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
        >
          {options && options.length ? (
            options.map((item) => (
              <option id={item.id} value={item.id} key={item.id}>
                {item.label}
              </option>
            ))
          ) : (
            <option value={""} id="">
              select
            </option>
          )}
        </select>
      </div>
    </>
  );
}
