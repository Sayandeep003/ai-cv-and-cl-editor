import { useState } from 'react';
import { Upload, FileText, Heart, Zap } from 'lucide-react';
import { ApplicationData } from './CareerCoPilot';

interface InputStepProps {
  onGenerate: (data: ApplicationData) => void;
  initialData: ApplicationData;
}

const InputStep = ({ onGenerate, initialData }: InputStepProps) => {
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File) => {
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setFormData(prev => ({ ...prev, cvFile: file }));
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
    if (formData.jobDescription.trim() && formData.cvFile) {
      onGenerate(formData);
    }
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
        />
        <p className="text-sm text-muted-foreground mt-2">
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
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
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
          {formData.cvFile ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-success rounded-lg">
                <FileText className="w-6 h-6 text-success-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{formData.cvFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB
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
        />
        <div className="flex items-center gap-2 mt-2">
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
          disabled={!isValid}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          <Zap className="w-5 h-5" />
          Generate My Application Kit
        </button>
        {!isValid && (
          <p className="text-sm text-muted-foreground mt-2">
            Please fill in the job description and upload your CV to continue
          </p>
        )}
      </div>
    </form>
  );
};

export default InputStep;