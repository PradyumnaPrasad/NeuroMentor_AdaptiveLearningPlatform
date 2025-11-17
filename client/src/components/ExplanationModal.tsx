/**
 * AI Explanation Modal
 * Shows personalized explanations when student gets answer wrong
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { AIExplanation } from '@/services/learningApi';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: AIExplanation;
  correctAnswer: string;
  offerPractice?: boolean;
  onStartPractice?: () => void;
  onContinue?: () => void;
}

const ExplanationModal = ({
  isOpen,
  onClose,
  explanation,
  correctAnswer,
  offerPractice = false,
  onStartPractice,
  onContinue
}: ExplanationModalProps) => {
  console.log('ExplanationModal render:', { isOpen, explanation, correctAnswer });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Let's Learn Together! 📚
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Encouragement */}
          <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
            <div className="flex items-start gap-3">
              <div className="text-4xl">🦉</div>
              <div>
                <h3 className="font-bold text-lg text-purple-900 mb-2">Encouragement</h3>
                <p className="text-purple-800 text-lg">{explanation.encouragement}</p>
              </div>
            </div>
          </Card>

          {/* Explanation */}
          <Card className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300">
            <div className="flex items-start gap-3">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-2">Why This Answer?</h3>
                <p className="text-blue-800 text-lg mb-3">{explanation.explanation}</p>
                <div className="bg-white/50 p-3 rounded-lg border-2 border-blue-200">
                  <p className="font-bold text-blue-900">
                    ✓ Correct Answer: <span className="text-green-700">{correctAnswer}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Example */}
          <Card className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300">
            <div className="flex items-start gap-3">
              <div className="text-4xl">🌟</div>
              <div>
                <h3 className="font-bold text-lg text-green-900 mb-2">Real-World Example</h3>
                <p className="text-green-800 text-lg">{explanation.example}</p>
              </div>
            </div>
          </Card>

          {/* Tip */}
          <Card className="p-6 bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300">
            <div className="flex items-start gap-3">
              <div className="text-4xl">💪</div>
              <div>
                <h3 className="font-bold text-lg text-orange-900 mb-2">Pro Tip!</h3>
                <p className="text-orange-800 text-lg">{explanation.tip}</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {offerPractice && onStartPractice && (
              <Button
                onClick={onStartPractice}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
              >
                🎯 Practice with Similar Questions
              </Button>
            )}
            
            {onContinue && (
              <Button
                onClick={onContinue}
                variant="outline"
                className="w-full py-6 text-lg font-bold rounded-xl"
              >
                Continue Quiz →
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-4 text-base rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationModal;
