import type { ApplicationData, Results } from '@/components/CareerCoPilot';

// Simulate AI processing with intelligent analysis
async function simulateProcessing() {
  // Add a realistic delay to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// Generate CV suggestions based on job description and CV content
async function generateCVSuggestions(jobDescription: string, cvText: string): Promise<string> {
  await simulateProcessing();
  
  console.log('Analyzing CV content and job requirements...');
  
  const jobKeywords = extractKeywords(jobDescription);
  const cvKeywords = extractKeywords(cvText);
  const missingKeywords = jobKeywords.filter(keyword => 
    !cvKeywords.some(cvKeyword => cvKeyword.toLowerCase().includes(keyword.toLowerCase()))
  );
  
  // Analyze skills and technologies
  const techSkills = extractTechSkills(jobDescription);
  const cvTechSkills = extractTechSkills(cvText);
  const missingTechSkills = techSkills.filter(skill => 
    !cvTechSkills.some(cvSkill => cvSkill.toLowerCase().includes(skill.toLowerCase()))
  );
  
  // Generate suggestions based on analysis
  const suggestions = [];
  
  if (missingKeywords.length > 0) {
    suggestions.push(`**Missing Keywords**: Consider incorporating these terms: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  
  if (missingTechSkills.length > 0) {
    suggestions.push(`**Technical Skills Gap**: Add these technologies if you have experience: ${missingTechSkills.slice(0, 3).join(', ')}`);
  }
  
  // Add specific improvement suggestions
  suggestions.push(`**Quantification**: Add specific metrics and numbers to your achievements`);
  suggestions.push(`**Action Verbs**: Start bullet points with strong action verbs like "Developed", "Led", "Optimized"`);
  
  if (jobDescription.toLowerCase().includes('lead') || jobDescription.toLowerCase().includes('senior')) {
    suggestions.push(`**Leadership**: Highlight leadership and mentorship experiences`);
  }
  
  return `📋 **AI-Powered CV Enhancement Suggestions**

${suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n\n')}

**Keyword Analysis:**
• Your CV contains: ${cvKeywords.slice(0, 5).join(', ')}
• Job emphasizes: ${jobKeywords.slice(0, 5).join(', ')}
• Consider adding: ${missingKeywords.slice(0, 3).join(', ')}

**Recommended Actions:**
✅ Tailor your summary to match the job requirements
✅ Quantify achievements with percentages and numbers  
✅ Use industry-specific terminology from the job posting
✅ Highlight relevant projects and their impact
✅ Ensure your CV passes ATS keyword scanning`;
}

// Generate cover letter based on job description and personal touch
async function generateCoverLetter(jobDescription: string, personalTouch: string, cvText: string): Promise<string> {
  await simulateProcessing();
  
  console.log('Generating personalized cover letter...');
  
  const companyName = extractCompanyName(jobDescription) || '[Company Name]';
  const roleTitle = extractRoleTitle(jobDescription) || 'this position';
  const keyRequirements = extractKeyRequirements(jobDescription);
  const relevantSkills = extractRelevantSkills(cvText, jobDescription);
  
  let coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${roleTitle} position at ${companyName}. After reviewing your job posting, I am confident that my background and experience align perfectly with what you're seeking.`;

  if (relevantSkills.length > 0) {
    coverLetter += `\n\nMy experience with ${relevantSkills.slice(0, 3).join(', ')} directly matches your requirements.`;
  }
  
  if (keyRequirements.length > 0) {
    coverLetter += ` I am particularly excited about the opportunity to contribute to ${keyRequirements[0].toLowerCase()}.`;
  }
  
  if (personalTouch) {
    coverLetter += `\n\n${personalTouch}`;
  }
  
  coverLetter += `\n\nI would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success. Thank you for considering my application.

Best regards,
[Your Name]`;

  return coverLetter;
}

// Extract technical skills from text
function extractTechSkills(text: string): string[] {
  const techPatterns = [
    /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes|Git|HTML|CSS|PHP|Ruby|C\+\+|C#|Swift|Kotlin|Flutter|Unity|TensorFlow|PyTorch|Django|Flask|Laravel|Spring|Hibernate|Jenkins|Terraform|Ansible|Elasticsearch|Redis|GraphQL|REST|API|Microservices|Agile|Scrum|DevOps|CI\/CD|Machine Learning|AI|Data Science|Frontend|Backend|Full-stack|Mobile|iOS|Android|Web Development|Software Engineering|Cloud|Blockchain|Cybersecurity|UX\/UI|Product Management|Project Management)\b/gi
  ];
  
  const skills = new Set<string>();
  techPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => skills.add(match));
    }
  });
  
  return Array.from(skills);
}

// Extract key requirements from job description
function extractKeyRequirements(jobDescription: string): string[] {
  const requirementPatterns = [
    /required?:?\s*([^.]+)/gi,
    /must have:?\s*([^.]+)/gi,
    /essential:?\s*([^.]+)/gi,
    /responsibilities?:?\s*([^.]+)/gi
  ];
  
  const requirements = [];
  requirementPatterns.forEach(pattern => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      requirements.push(...matches.slice(0, 3));
    }
  });
  
  return requirements;
}

// Extract relevant skills from CV that match job requirements
function extractRelevantSkills(cvText: string, jobDescription: string): string[] {
  const cvSkills = extractTechSkills(cvText);
  const jobSkills = extractTechSkills(jobDescription);
  
  return cvSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
  );
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
  
  console.log('🚀 Processing application with intelligent AI analysis...');
  console.log('📄 Job Description length:', data.jobDescription.length, 'characters');
  console.log('📋 CV Text length:', cvText.length, 'characters');
  console.log('💡 Personal touch:', data.personalTouch ? 'Provided' : 'Not provided');
  
  try {
    const [cvSuggestions, coverLetter] = await Promise.all([
      generateCVSuggestions(data.jobDescription, cvText),
      generateCoverLetter(data.jobDescription, data.personalTouch, cvText)
    ]);
    
    console.log('✅ Successfully generated AI suggestions and cover letter');
    
    return {
      cvSuggestions,
      coverLetter
    };
  } catch (error) {
    console.error('❌ Error in processApplication:', error);
    throw new Error('Failed to process application data');
  }
}