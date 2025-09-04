import { useState } from 'react';
import { Upload, FileText, Heart, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { ApplicationData } from './CareerCoPilot';
import { parseFile, validateFile } from '@/lib/fileParser';
import { useToast } from '@/hooks/use-toast';

interface InputStepProps {
  onGenerate: (data: ApplicationData) => void;
  initialData: ApplicationData;
}

const InputStep = ({ onGenerate, initialData }: InputStepProps) => {
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [cvText, setCvText] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = async (file: File) => {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsProcessingFile(true);
    
    try {
      // Parse the file to extract text
      const parseResult = await parseFile(file);
      
      if (parseResult.success) {
        setFormData(prev => ({ ...prev, cvFile: file }));
        setCvText(parseResult.text);
        toast({
          title: "File uploaded successfully",
          description: "Your CV has been processed and is ready for optimization.",
        });
      } else {
        toast({
          title: "File Processing Error",
          description: parseResult.error || "Unable to process the file.",
          variant: "destructive",
        });
        // Still allow the file to be uploaded even if parsing fails
        setFormData(prev => ({ ...prev, cvFile: file }));
        setCvText('');
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred while processing your file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.cvFile) {
      toast({
        title: "Missing CV File",
        description: "Please upload your CV to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Include the parsed CV text in the data
    onGenerate({ ...formData, cvText });
  };

  const isValid = formData.jobDescription.trim().length > 0 && formData.cvFile;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Job Description Input */}
      <div className="card-professional">
        <div className="flex items-center gap-3 mb-4">
          <div className="step-indicator">1</div>
          <h2 className="text-xl font-semibold text-foreground">Paste the Job Description</h2>
        </div>
        <textarea
          value={formData.jobDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
          className="textarea-professional min-h-[300px]"
          placeholder="Paste the full job description here...

Example:
We are looking for a Senior Software Engineer to join our growing team. The ideal candidate will have:
• 5+ years of experience with React and Node.js  
• Strong background in PostgreSQL and system architecture
• Experience leading technical projects and mentoring junior developers
• Excellent communication skills and collaborative mindset..."
          required
          aria-label="Job Description"
          aria-describedby="job-description-help"
        />
        <p id="job-description-help" className="text-sm text-muted-foreground mt-2">
          Copy and paste the complete job posting for the most accurate optimization
        </p>
      </div>

      {/* CV Upload */}
      <div className="card-professional">
        <div className="flex items-center gap-3 mb-4">
          <div className="step-indicator">2</div>
          <h2 className="text-xl font-semibold text-foreground">Upload Your Current CV</h2>
        </div>
        
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-primary/5'
              : formData.cvFile
                ? 'border-success bg-success/5'
                : 'border-border hover:border-primary/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {isProcessingFile ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-foreground">Processing your CV...</p>
            </div>
          ) : formData.cvFile ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-success rounded-lg">
                {cvText ? <CheckCircle className="w-6 h-6 text-success-foreground" /> : <FileText className="w-6 h-6 text-success-foreground" />}
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{formData.cvFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB
                  {cvText && <span className="text-success"> • Text extracted</span>}
                  {!cvText && <span className="text-muted-foreground"> • Upload complete</span>}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop your CV here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF and DOCX files
                </p>
              </div>
            </div>
          )}
          
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.docx"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            disabled={isProcessingFile}
            aria-label="Upload CV file"
          />
        </div>
        
        {formData.cvFile && (
          <button
            type="button"
            className="btn-secondary mt-3"
            onClick={() => setFormData(prev => ({ ...prev, cvFile: null }))}
          >
            Remove File
          </button>
        )}
      </div>

      {/* Personal Touch */}
      <div className="card-professional">
        <div className="flex items-center gap-3 mb-4">
          <div className="step-indicator bg-muted text-muted-foreground">3</div>
          <h2 className="text-xl font-semibold text-foreground">Add a Personal Touch</h2>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">Optional</span>
        </div>
        <textarea
          value={formData.personalTouch}
          onChange={(e) => setFormData(prev => ({ ...prev, personalTouch: e.target.value }))}
          className="textarea-professional min-h-[120px]"
          placeholder="Add something personal that shows your genuine interest...

Examples:
• 'I've been following your company's work in renewable energy and am excited about your recent solar panel innovations.'
• 'As someone who uses Python daily for data analysis, I was thrilled to see it's a core part of your tech stack.'
• 'Your company's commitment to work-life balance really resonates with my values.'"
          aria-label="Personal touch (optional)"
          aria-describedby="personal-touch-help"
        />
        <div id="personal-touch-help" className="flex items-center gap-2 mt-2">
          <Heart className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This helps create a more compelling, personalized cover letter
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={!isValid || isProcessingFile}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          aria-label="Generate optimized CV and cover letter"
        >
          <Zap className="w-5 h-5" />
          {isProcessingFile ? 'Processing File...' : 'Generate My Application Kit'}
        </button>
        {!isValid && !isProcessingFile && (
          <p className="text-sm text-muted-foreground mt-2" role="alert">
            Please fill in the job description and upload your CV to continue
          </p>
        )}
        {isProcessingFile && (
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we process your CV...
          </p>
        )}
      </div>
    </form>
  );
};

export default InputStep;