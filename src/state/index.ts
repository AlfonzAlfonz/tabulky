export interface TableState {
  width: number;
  height: number;

  data: string[];
}

export const createInitState = (width = 40, height = 100): TableState => ({
  width,
  height,

  data: [...Array(width * height)].map((_, i) => {
    const x = Math.round((i / width - Math.floor(i / width)) * width);
    const y = Math.floor(i / width);

    if (x < 10 && y < 10) {
      return `${x};${y}`;
    }

    return "";
  }),
});
