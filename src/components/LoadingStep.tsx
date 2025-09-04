import { Loader2, Brain, FileSearch, PenTool } from 'lucide-react';

const LoadingStep = () => {
  return (
    <div className="card-professional max-w-2xl mx-auto text-center">
      <div className="space-y-8">
        {/* Main Loading Animation */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <span className="text-xs text-success-foreground font-bold">AI</span>
            </div>
          </div>
        </div>

        {/* Progress Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Processing Your Application
          </h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your CV and the job description to create the perfect match
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <div className="p-2 bg-primary rounded-lg">
              <FileSearch className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-foreground">Analyzing Job Requirements</p>
              <p className="text-sm text-muted-foreground">
                Identifying key skills, keywords, and company preferences
              </p>
            </div>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-muted rounded-lg">
              <Brain className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-foreground">Matching Your Experience</p>
              <p className="text-sm text-muted-foreground">
                Finding connections between your background and their needs
              </p>
            </div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="p-2 bg-muted rounded-lg">
              <PenTool className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-foreground">Crafting Your Documents</p>
              <p className="text-sm text-muted-foreground">
                Creating tailored suggestions and cover letter
              </p>
            </div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            ⏱️ This usually takes 10-30 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingStep;