import { pipeline } from '@huggingface/transformers';
import type { ApplicationData, Results } from '@/components/CareerCoPilot';

let textGenerator: any = null;

// Initialize the AI model (only once)
async function initializeAI() {
  if (!textGenerator) {
    console.log('Initializing AI model...');
    textGenerator = await pipeline(
      'text-generation',
      'microsoft/DialoGPT-small',
      { 
        device: 'webgpu',
        dtype: 'fp32'
      }
    );
    console.log('AI model initialized successfully');
  }
  return textGenerator;
}

// Generate CV suggestions based on job description and CV content
async function generateCVSuggestions(jobDescription: string, cvText: string): Promise<string> {
  const generator = await initializeAI();
  
  const prompt = `Analyze this CV against the job requirements and provide specific improvement suggestions:

JOB DESCRIPTION:
${jobDescription}

CV CONTENT:
${cvText}

Please provide detailed CV improvement suggestions in the following format:
- Section improvements with before/after examples
- Missing skills or experiences to highlight
- Ways to better match job requirements
- Quantifiable achievements to add

CV SUGGESTIONS:`;

  try {
    const result = await generator(prompt, {
      max_new_tokens: 500,
      temperature: 0.7,
      do_sample: true,
      num_return_sequences: 1
    });
    
    return result[0].generated_text.replace(prompt, '').trim();
  } catch (error) {
    console.error('Error generating CV suggestions:', error);
    return generateFallbackCVSuggestions(jobDescription, cvText);
  }
}

// Generate cover letter based on job description and personal touch
async function generateCoverLetter(jobDescription: string, personalTouch: string, cvText: string): Promise<string> {
  const generator = await initializeAI();
  
  const prompt = `Write a professional cover letter for this job application:

JOB DESCRIPTION:
${jobDescription}

APPLICANT'S CV HIGHLIGHTS:
${cvText.substring(0, 300)}...

PERSONAL NOTE FROM APPLICANT:
${personalTouch}

Write a compelling cover letter that:
- Addresses the specific job requirements
- Highlights relevant experience from the CV
- Incorporates the personal touch naturally
- Shows enthusiasm for the role
- Is professional yet personable

COVER LETTER:`;

  try {
    const result = await generator(prompt, {
      max_new_tokens: 400,
      temperature: 0.8,
      do_sample: true,
      num_return_sequences: 1
    });
    
    return result[0].generated_text.replace(prompt, '').trim();
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return generateFallbackCoverLetter(jobDescription, personalTouch);
  }
}

// Fallback CV suggestions when AI fails
function generateFallbackCVSuggestions(jobDescription: string, cvText: string): string {
  const jobKeywords = extractKeywords(jobDescription);
  const cvKeywords = extractKeywords(cvText);
  const missingKeywords = jobKeywords.filter(keyword => 
    !cvKeywords.some(cvKeyword => cvKeyword.toLowerCase().includes(keyword.toLowerCase()))
  );

  return `📋 **AI-Generated CV Enhancement Suggestions**

**Keywords Analysis:**
• Your CV contains: ${cvKeywords.slice(0, 5).join(', ')}
• Job requires: ${jobKeywords.slice(0, 5).join(', ')}
• Consider adding: ${missingKeywords.slice(0, 3).join(', ')}

**Improvement Recommendations:**
• Add specific metrics and numbers to quantify your achievements
• Include technologies mentioned in the job description: ${missingKeywords.slice(0, 2).join(', ')}
• Restructure experience bullets to lead with action verbs and outcomes
• Add a skills section that directly matches job requirements
• Include relevant projects that demonstrate the required competencies

**Action Items:**
1. Quantify your accomplishments (e.g., "increased efficiency by X%")
2. Use keywords from the job description naturally throughout your CV
3. Highlight leadership and collaboration experiences if mentioned in the job posting
4. Ensure your CV format is ATS-friendly and easy to scan`;
}

// Fallback cover letter when AI fails
function generateFallbackCoverLetter(jobDescription: string, personalTouch: string): string {
  const companyName = extractCompanyName(jobDescription) || '[Company Name]';
  const roleTitle = extractRoleTitle(jobDescription) || 'this position';
  
  return `Dear Hiring Manager,

I am writing to express my strong interest in ${roleTitle} at ${companyName}. Your job posting caught my attention because it aligns perfectly with my professional background and career aspirations.

Based on my experience and the requirements outlined in your job description, I believe I would be a valuable addition to your team. My background demonstrates the technical skills and problem-solving abilities you're seeking, and I'm excited about the opportunity to contribute to your organization's continued success.

${personalTouch ? personalTouch + '\n\n' : ''}I would welcome the opportunity to discuss how my skills and enthusiasm can benefit your team. Thank you for considering my application, and I look forward to hearing from you.

Best regards,
[Your Name]`;
}

// Helper function to extract keywords
function extractKeywords(text: string): string[] {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .filter((word, index, arr) => arr.indexOf(word) === index)
    .slice(0, 20);
}

// Helper function to extract company name
function extractCompanyName(jobDescription: string): string | null {
  const companyPatterns = [
    /at\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.|\n)/g,
    /company:\s*([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.|\n)/g,
    /([A-Z][a-zA-Z\s&]+?)\s+is\s+looking/g
  ];
  
  for (const pattern of companyPatterns) {
    const match = pattern.exec(jobDescription);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

// Helper function to extract role title
function extractRoleTitle(jobDescription: string): string | null {
  const rolePatterns = [
    /position:\s*([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|\n)/g,
    /role:\s*([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|\n)/g,
    /hiring\s+([A-Z][a-zA-Z\s]+?)(?:\s|,|\.|\n)/g
  ];
  
  for (const pattern of rolePatterns) {
    const match = pattern.exec(jobDescription);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

// Main function to process application data
export async function processApplication(data: ApplicationData): Promise<Results> {
  const cvText = data.cvText || 'No CV content available';
  
  console.log('Processing application with AI...');
  console.log('Job Description:', data.jobDescription.substring(0, 100) + '...');
  console.log('CV Text:', cvText.substring(0, 100) + '...');
  
  const [cvSuggestions, coverLetter] = await Promise.all([
    generateCVSuggestions(data.jobDescription, cvText),
    generateCoverLetter(data.jobDescription, data.personalTouch, cvText)
  ]);
  
  return {
    cvSuggestions,
    coverLetter
  };
}