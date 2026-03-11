interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white px-8 flex items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <span className="text-sm text-gray-600">{description}</span>
      </div>
    </header>
  );
}