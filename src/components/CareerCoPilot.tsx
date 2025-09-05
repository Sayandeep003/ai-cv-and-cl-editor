import { useState } from 'react';
import { Briefcase, FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InputStep from './InputStep';
import ResultsStep from './ResultsStep';
import LoadingStep from './LoadingStep';

export type ApplicationData = {
  jobDescription: string;
  cvFile: File | null;
  personalTouch: string;
  cvText?: string;
};

export type Results = {
  cvSuggestions: string;
  coverLetter: string;
};

type Step = 'input' | 'loading' | 'results';

const CareerCoPilot = () => {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    jobDescription: '',
    cvFile: null,
    personalTouch: '',
  });
  const [results, setResults] = useState<Results>({
    cvSuggestions: '',
    coverLetter: '',
  });
  const { toast } = useToast();

  const handleGenerate = async (data: ApplicationData) => {
    try {
      setApplicationData(data);
      setCurrentStep('loading');
      
      toast({
        title: "Processing your application",
        description: "Our AI is analyzing your CV and the job description...",
      });
      
      // Import the AI service dynamically to avoid blocking the initial load
      const { processApplication } = await import('@/lib/aiService');
      
      // Process application with AI
      const aiResults = await processApplication(data);
      
      setResults(aiResults);
      setCurrentStep('results');
      
      toast({
        title: "Success!",
        description: "Your optimized application kit is ready.",
      });
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: "Error",
        description: "Something went wrong while processing your application. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('input');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setApplicationData({ jobDescription: '', cvFile: null, personalTouch: '' });
    setResults({ cvSuggestions: '', coverLetter: '' });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">AI Career Co-Pilot</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimize your job application in seconds with AI-powered CV analysis and cover letter generation
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className={`step-indicator ${currentStep === 'input' ? 'bg-primary' : currentStep === 'loading' || currentStep === 'results' ? 'bg-success' : 'bg-muted'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Input</span>
          </div>
          <div className="w-12 h-0.5 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className={`step-indicator ${currentStep === 'loading' ? 'bg-primary' : currentStep === 'results' ? 'bg-success' : 'bg-muted'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Processing</span>
          </div>
          <div className="w-12 h-0.5 bg-border"></div>
          <div className="flex items-center gap-2">
            <div className={`step-indicator ${currentStep === 'results' ? 'bg-success' : 'bg-muted'}`}>
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Results</span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'input' && (
          <InputStep onGenerate={handleGenerate} initialData={applicationData} />
        )}
        
        {currentStep === 'loading' && (
          <LoadingStep />
        )}
        
        {currentStep === 'results' && (
          <ResultsStep results={results} onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  );
};

export default CareerCoPilot;