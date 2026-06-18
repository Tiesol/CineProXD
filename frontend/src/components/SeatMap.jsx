const SeatMap = ({ rows, cols, reserved, selected, onToggle }) => {
  const isReserved = (r, c) => reserved.some((s) => s.rowNum === r && s.colNum === c);
  const isSelected = (r, c) => selected.some((s) => s.rowNum === r && s.colNum === c);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-200 inline-block" /> Libre</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-500 inline-block" /> Ocupado</span>
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-500 inline-block" /> Seleccionado</span>
      </div>

      <div className="mb-2 text-center text-xs text-gray-400 tracking-widest uppercase">— PANTALLA —</div>
      <div className="border-b-2 border-gray-400 mb-4" />

      <div className="flex flex-col gap-1 items-center">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex gap-1">
            <span className="w-5 text-xs text-gray-400 text-right leading-6 mr-1">{String.fromCharCode(65 + r)}</span>
            {Array.from({ length: cols }, (_, c) => {
              const reserved_ = isReserved(r, c);
              const selected_ = isSelected(r, c);
              return (
                <button
                  key={c}
                  disabled={reserved_}
                  onClick={() => onToggle(r, c)}
                  className={`w-6 h-6 rounded text-xs font-bold transition-colors
                    ${reserved_ ? 'bg-red-500 cursor-not-allowed text-white' : selected_ ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}
                  `}
                  title={`Fila ${r + 1} - Col ${c + 1}`}
                >
                  {c + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
