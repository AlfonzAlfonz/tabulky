interface Props {
  title: string;
}

export const Topbar = ({ title }: Props) => {
  return (
    <div className="sticky top-0 left-0 bg-white p-2 py-4 shadow-md w-screen">
      <div className="text-xl">{title}</div>
    </div>
  );
};
