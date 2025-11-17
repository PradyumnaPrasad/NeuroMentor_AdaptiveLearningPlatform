import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-sm text-foreground/70 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <button
            onClick={() => navigate(item.path)}
            className={`hover:text-foreground transition-colors ${
              index === items.length - 1 ? 'text-foreground font-semibold' : ''
            }`}
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;