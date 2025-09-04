import { useState } from 'react';
import { Briefcase, FileText, Sparkles } from 'lucide-react';
import InputStep from './InputStep';
import ResultsStep from './ResultsStep';
import LoadingStep from './LoadingStep';

export type ApplicationData = {
  jobDescription: string;
  cvFile: File | null;
  personalTouch: string;
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

  const handleGenerate = async (data: ApplicationData) => {
    setApplicationData(data);
    setCurrentStep('loading');
    
    // Simulate AI processing - In real app, this would call your AI API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results - In real app, this would come from your AI processing
    const mockResults: Results = {
      cvSuggestions: `📋 **CV Enhancement Suggestions**

**Experience Section - Software Engineer at TechCorp:**
• **Original:** "Developed web applications using modern technologies"
• **Suggested:** "Developed 5+ scalable web applications using React, Node.js, and PostgreSQL, serving 10,000+ daily active users"
• **Reason:** Adds quantifiable metrics and specific technologies mentioned in the job description

**Skills Section:**
• **Original:** "Proficient in JavaScript and databases"  
• **Suggested:** "Expert in JavaScript (ES6+), TypeScript, React, and PostgreSQL database optimization"
• **Reason:** Matches exact technology stack requirements from the job posting

**Projects Section:**
• **Original:** "Built e-commerce platform"
• **Suggested:** "Architected and deployed full-stack e-commerce platform with payment integration, reducing checkout time by 40% and increasing conversion rates by 25%"
• **Reason:** Demonstrates impact with metrics and shows business value understanding

**Leadership Experience:**
• **Add:** "Mentored 3 junior developers and led code review processes, improving team code quality scores by 30%"
• **Reason:** Job description emphasizes collaboration and mentorship - this wasn't in your original CV`,

      coverLetter: `Dear Hiring Manager,

I was excited to discover the Software Engineer position at ${data.jobDescription.includes('company') ? 'your innovative company' : 'TechCorp'}. With 5+ years of experience building scalable web applications using React and Node.js, I'm confident I can contribute immediately to your development team.

In my current role at TechCorp, I've developed web applications serving over 10,000 daily users and led optimization initiatives that reduced load times by 35%. My experience with the exact tech stack mentioned in your posting—React, TypeScript, and PostgreSQL—combined with my track record of mentoring junior developers, aligns perfectly with your team's needs.

${data.personalTouch ? data.personalTouch + '\n\n' : ''}I'm particularly drawn to your company's commitment to innovation and would welcome the opportunity to discuss how my technical expertise and collaborative approach can help drive your next phase of growth.

Best regards,
[Your Name]`
    };
    
    setResults(mockResults);
    setCurrentStep('results');
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