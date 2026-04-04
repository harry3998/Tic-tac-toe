type Props = {
  value: string | null;
  onClick: () => void;
};

export default function Square({ value, onClick }: Props) {
  return (
    <button onClick={onClick} style={{ width: 60, height: 60 }}>
      {value}
    </button>
  );
}