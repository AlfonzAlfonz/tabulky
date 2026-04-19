import { useApp } from "./AppContext";
import { Editor } from "./Editor";
import { Topbar } from "./Topbar";

export const Table = () => {
  const {
    state: { table: state },
    focused,
    setFocused,
  } = useApp();

  const gridTemplateColumns = [...Array(state.width)].map(() => 80);
  const gridTemplateRows = [...Array(state.height)].map(() => 24);

  return (
    <div
      style={{
        width: `${gridTemplateColumns.reduce((acc, x) => acc + x, 0)}px`,
      }}
    >
      <Topbar title="Untitled table" />
      <div
        className="jed-table grid"
        style={{
          gridTemplateColumns: gridTemplateColumns
            .map((c) => `${c}px`)
            .join(" "),
          gridTemplateRows: gridTemplateRows.map((c) => `${c}px`).join(" "),
        }}
      >
        {[...Array(state.width - 1)].map((_, i) => (
          <div
            className="jed-cell text-gray-400 text-center border-gray-400! text-sm"
            style={{ gridColumnStart: i + 2, gridRowStart: 1 }}
          >
            {String.fromCharCode("A".charCodeAt(0) + (i % 26))}
          </div>
        ))}
        {state.data.map((s, i) => {
          const x = Math.round(
            (i / state.width - Math.floor(i / state.width)) * state.width,
          );
          const y = Math.floor(i / state.width);

          console.log(x);

          return (
            <>
              {x === 0 && (
                <div
                  className="jed-cell text-gray-400 text-center border-gray-400! text-sm"
                  style={{ gridColumnStart: x + 1, gridRowStart: y + 2 }}
                >
                  {y}
                </div>
              )}
              <div
                className={`jed-cell ${focused?.offset === i ? "outline-2 outline-emerald-800" : ""}`}
                key={`${x};${y}`}
                style={{ gridColumnStart: x + 2, gridRowStart: y + 2 }}
                onClick={() => setFocused(i)}
              >
                {s}
              </div>
            </>
          );
        })}
      </div>
      <Editor />
    </div>
  );
};
