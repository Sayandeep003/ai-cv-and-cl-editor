import { useState } from 'react';
import { Copy, Download, CheckCircle, RotateCcw, FileText, Mail } from 'lucide-react';
import { Results } from './CareerCoPilot';

interface ResultsStepProps {
  results: Results;
  onStartOver: () => void;
}

const ResultsStep = ({ results, onStartOver }: ResultsStepProps) => {
  const [copiedCv, setCopiedCv] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);
  const [coverLetter, setCoverLetter] = useState(results.coverLetter);

  const handleCopy = async (text: string, type: 'cv' | 'cover') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'cv') {
        setCopiedCv(true);
        setTimeout(() => setCopiedCv(false), 2000);
      } else {
        setCopiedCover(true);
        setTimeout(() => setCopiedCover(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Optimized Application Kit
        </h2>
        <p className="text-muted-foreground">
          Your CV suggestions and cover letter are ready! Review and customize as needed.
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* CV Suggestions */}
        <div className="card-professional">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">CV Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Apply these edits to your original CV document
              </p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
              {results.cvSuggestions}
            </pre>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleCopy(results.cvSuggestions, 'cv')}
              className={`btn-secondary flex items-center gap-2 ${copiedCv ? 'bg-success text-success-foreground' : ''}`}
            >
              {copiedCv ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCv ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={() => handleDownload(results.cvSuggestions, 'cv-suggestions.txt')}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="card-professional">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">Generated Cover Letter</h3>
              <p className="text-sm text-muted-foreground">
                Edit as needed and personalize further
              </p>
            </div>
          </div>

          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="textarea-professional min-h-80"
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleCopy(coverLetter, 'cover')}
              className={`btn-secondary flex items-center gap-2 ${copiedCover ? 'bg-success text-success-foreground' : ''}`}
            >
              {copiedCover ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCover ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={() => handleDownload(coverLetter, 'cover-letter.txt')}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card-professional bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Next Steps</h3>
        <div className="space-y-2 text-sm text-foreground">
          <p>• <strong>CV:</strong> Apply the suggested edits to your original CV document</p>
          <p>• <strong>Cover Letter:</strong> Copy the text and paste it into your job application</p>
          <p>• <strong>Personalize:</strong> Add company-specific details you may know</p>
          <p>• <strong>Proofread:</strong> Always review for accuracy before submitting</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <button
          onClick={onStartOver}
          className="btn-secondary flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Optimize Another Application
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;