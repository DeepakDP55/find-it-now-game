
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Difference {
  id: number;
  x: number;
  y: number;
  radius: number;
}

const Index = () => {
  const differences: Difference[] = [
    { id: 1, x: 25, y: 40, radius: 8 },
    { id: 2, x: 60, y: 25, radius: 6 },
    { id: 3, x: 80, y: 60, radius: 7 },
    { id: 4, x: 15, y: 75, radius: 5 },
    { id: 5, x: 45, y: 80, radius: 6 },
  ];

  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLDivElement>, imageType: 'left' | 'right') => {
    if (imageType === 'left') return; // Only allow clicking on the right image
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const clickedDifference = differences.find(diff => {
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      return distance <= diff.radius && !foundDifferences.includes(diff.id);
    });

    if (clickedDifference) {
      const newFound = [...foundDifferences, clickedDifference.id];
      setFoundDifferences(newFound);
      toast.success(`Great! You found difference ${newFound.length}/${differences.length}`, {
        duration: 2000,
      });

      if (newFound.length === differences.length) {
        setGameCompleted(true);
        toast.success('🎉 Congratulations! You found all differences!', {
          duration: 4000,
        });
      }
    } else {
      toast.error('No difference here. Keep looking!', {
        duration: 1500,
      });
    }
  }, [foundDifferences, differences]);

  const resetGame = () => {
    setFoundDifferences([]);
    setGameCompleted(false);
    setShowHints(false);
    toast.info('Game reset! Find all 5 differences.');
  };

  const toggleHints = () => {
    setShowHints(!showHints);
    toast.info(showHints ? 'Hints hidden' : 'Hints revealed!');
  };

  const progressPercentage = (foundDifferences.length / differences.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Spot the Difference
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find all 5 differences between these two images. Click on the right image when you spot a difference!
          </p>
          
          {/* Progress and Controls */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {foundDifferences.length}/{differences.length} Found
              </Badge>
              {gameCompleted && (
                <Badge className="bg-green-500 text-white animate-scale-in">
                  <Trophy className="w-4 h-4 mr-1" />
                  Complete!
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={toggleHints} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Game Area */}
        <Card className="p-6 shadow-2xl animate-scale-in">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Image - Original */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-gray-700">Original</h3>
              <div 
                className="relative bg-gray-200 rounded-lg overflow-hidden aspect-[4/3] cursor-not-allowed"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              </div>
            </div>

            {/* Right Image - Find Differences */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-gray-700">Find the Differences</h3>
              <div 
                className="relative bg-gray-200 rounded-lg overflow-hidden aspect-[4/3] cursor-crosshair hover:shadow-lg transition-shadow"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={(e) => handleImageClick(e, 'right')}
              >
                {/* Found Differences Indicators */}
                {foundDifferences.map(diffId => {
                  const diff = differences.find(d => d.id === diffId);
                  if (!diff) return null;
                  return (
                    <div
                      key={diffId}
                      className="absolute border-4 border-green-400 bg-green-400 bg-opacity-20 rounded-full animate-scale-in"
                      style={{
                        left: `${diff.x - diff.radius}%`,
                        top: `${diff.y - diff.radius}%`,
                        width: `${diff.radius * 2}%`,
                        height: `${diff.radius * 2}%`,
                      }}
                    >
                      <div className="absolute inset-0 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                  );
                })}

                {/* Hint Indicators */}
                {showHints && differences
                  .filter(diff => !foundDifferences.includes(diff.id))
                  .map(diff => (
                    <div
                      key={`hint-${diff.id}`}
                      className="absolute border-2 border-yellow-400 bg-yellow-400 bg-opacity-30 rounded-full animate-pulse"
                      style={{
                        left: `${diff.x - diff.radius}%`,
                        top: `${diff.y - diff.radius}%`,
                        width: `${diff.radius * 2}%`,
                        height: `${diff.radius * 2}%`,
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              💡 Tip: Look carefully for subtle changes in colors, objects, or details between the two images.
              Click on the right image when you spot a difference!
            </p>
          </div>
        </Card>

        {/* Completion Celebration */}
        {gameCompleted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <Card className="p-8 text-center max-w-md mx-4 animate-scale-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You found all {differences.length} differences! Great attention to detail!
              </p>
              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
