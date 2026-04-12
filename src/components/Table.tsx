import { useApp } from "./AppContext";
import { Editor } from "./Editor";
import { Topbar } from "./Topbar";

export const Table = () => {
  const {
    state: { table: state },
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
      <Topbar title="Test table" />
      <div
        className="jed-table grid"
        style={{
          gridTemplateColumns: gridTemplateColumns
            .map((c) => `${c}px`)
            .join(" "),
          gridTemplateRows: gridTemplateRows.map((c) => `${c}px`).join(" "),
        }}
      >
        {state.data.map((s, i) => {
          const x = Math.round(
            (i / state.width - Math.floor(i / state.width)) * state.width,
          );
          const y = Math.floor(i / state.width);

          return (
            <div
              className="jed-cell"
              key={`${x};${y}`}
              style={{ gridColumnStart: x + 1, gridRowStart: y + 1 }}
              onClick={() => setFocused(i)}
            >
              {s}
            </div>
          );
        })}
      </div>
      <Editor />
    </div>
  );
};
