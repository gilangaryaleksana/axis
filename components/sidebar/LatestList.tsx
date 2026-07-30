interface Item {
  id: string;
  title: string;
  sub: string;
}

interface Props {
  items: Item[];
  currentId: string;
  onSelect: (id: string) => void;
}

export default function LatestList({ items, currentId, onSelect }: Props) {
  return (
    <div className="flex-1 overflow-y-auto pr-0.5 scrollbar-hide">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`px-1.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2c2c2f] mb-0.5 ${
            currentId === item.id ? "bg-gray-100 dark:bg-[#2c2c2f]" : ""
          }`}
        >
          <p className="text-xs text-[#1a1a1a] dark:text-[#f1f0ee]">
            {item.title}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-[#9a9a97] truncate mt-0.5">
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
