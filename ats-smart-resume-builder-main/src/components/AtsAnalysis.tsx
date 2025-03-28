
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  PencilLine,
  Target,
  Lightbulb,
  FileText,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { AtsAnalysisResult } from '@/types';
import { getScoreColor } from '@/utils/resumeHelpers';
import { analyzeResume } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AtsAnalysisProps {
  resumeText: string;
  onImproveResume: () => void;
  onJobDescriptionChange: (description: string) => void;
}

const AtsAnalysis: React.FC<AtsAnalysisProps> = ({ 
  resumeText, 
  onImproveResume,
  onJobDescriptionChange
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('keywords');
  const { toast } = useToast();

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    onJobDescriptionChange(e.target.value);
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please enter a job description to analyze your resume against.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete",
        description: `Your resume scored ${result.score}/100 against this job description.`,
        variant: result.score >= 80 ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderScoreGauge = (score: number) => {
    const color = getScoreColor(score);
    const rotation = (score / 100) * 180;
    
    return (
      <div className="relative w-40 h-40 mx-auto mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-muted/30 flex items-center justify-center">
            <span className={`text-4xl font-bold ${color}`}>
              {score}
            </span>
          </div>
        </div>
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M 5 50 A 45 45 0 1 1 95 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 5 50 A 45 45 0 1 1 95 50"
            fill="none"
            stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="141"
            strokeDashoffset={141 - (141 * score) / 100}
            transform="rotate(-90, 50, 50)"
          />
        </svg>
      </div>
    );
  };
  
  const renderTabIcon = (tab: string) => {
    switch (tab) {
      case 'keywords':
        return <Target className="h-4 w-4 mr-2" />;
      case 'structure':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'formatting':
        return <PencilLine className="h-4 w-4 mr-2" />;
      case 'content':
        return <Lightbulb className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    
    return (
      <div className="mt-8 animate-fade-in">
        <Card className="border border-primary/20 shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              ATS Analysis Result
            </CardTitle>
            <CardDescription>
              Based on the job description and your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 text-center">
              {renderScoreGauge(analysisResult.score)}
              <p className={`text-lg font-medium ${getScoreColor(analysisResult.score)}`}>
                {analysisResult.score >= 80 
                  ? 'Excellent Match' 
                  : analysisResult.score >= 60 
                  ? 'Good Match, Some Improvements Needed' 
                  : 'Needs Significant Improvements'}
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="keywords" className="flex items-center">
                  {renderTabIcon('keywords')}
                  <span className="hidden sm:inline">Keywords</span>
                </TabsTrigger>
                <TabsTrigger value="structure" className="flex items-center">
                  {renderTabIcon('structure')}
                  <span className="hidden sm:inline">Structure</span>
                </TabsTrigger>
                <TabsTrigger value="formatting" className="flex items-center">
                  {renderTabIcon('formatting')}
                  <span className="hidden sm:inline">Format</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center">
                  {renderTabIcon('content')}
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="keywords" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-destructive/5 border-destructive/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center text-destructive">
                        <XCircle className="h-5 w-5 mr-2" />
                        Missing Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysisResult.suggestions.keywords.missing.length > 0 ? (
                        <ul className="space-y-1">
                          {analysisResult.suggestions.keywords.missing.map((keyword, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                              <span>{keyword}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No missing keywords detected!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50/5 border-green-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Found Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysisResult.suggestions.keywords.found.length > 0 ? (
                        <ul className="space-y-1">
                          {analysisResult.suggestions.keywords.found.map((keyword, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{keyword}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No matching keywords found.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="structure" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                      Structure Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {analysisResult.suggestions.structure.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.structure.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="formatting" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                      Formatting Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {analysisResult.suggestions.formatting.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.formatting.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                      Content Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {analysisResult.suggestions.content.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.content.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t px-6 py-4">
            <Button onClick={onImproveResume} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Improved Resume
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-2">ATS Analysis</h2>
          <p className="text-muted-foreground">
            See how your resume performs against ATS systems
          </p>
        </div>
        
        <Card className="border border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>Enter Job Description</CardTitle>
            <CardDescription>
              Paste the job description to analyze your resume against the specific requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="resize-none"
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Your Resume
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Your Current Resume</DialogTitle>
                    <DialogDescription>
                      This is the resume that will be analyzed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto border rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
                    {resumeText}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleAnalyze} 
              disabled={!jobDescription.trim() || isAnalyzing}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {renderAnalysisResult()}
      </div>
    </div>
  );
};

export default AtsAnalysis;
