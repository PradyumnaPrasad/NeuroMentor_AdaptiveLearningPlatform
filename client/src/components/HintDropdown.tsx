import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface HintDropdownProps {
  hint: string;
}

const HintDropdown = ({ hint }: HintDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // If no hint is provided, don't render anything
  if (!hint) {
    return null;
  }

  return (
    <div className="w-full mb-6 animate-fade-in">
      <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md hover:shadow-lg transition-all duration-300">
        {/* Dropdown Header - Clickable */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-100/50 transition-colors duration-200"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Hide hint" : "Show hint"}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-md">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-purple-800">Need a Hint?</h3>
              <p className="text-sm text-purple-600">Click to see a helpful tip!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm font-semibold text-purple-700">
              {isOpen ? 'Hide' : 'Show'}
            </span>
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-purple-700 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-6 h-6 text-purple-700 transition-transform duration-300" />
            )}
          </div>
        </button>

        {/* Dropdown Content - Expandable */}
        {isOpen && (
          <div className="px-6 pb-6 pt-2 border-t-2 border-purple-100 animate-slide-down">
            <div className="bg-white rounded-xl p-5 shadow-inner border border-purple-100">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 mt-1">💡</div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {hint}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HintDropdown;
