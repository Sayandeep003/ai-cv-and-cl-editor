import type { ApplicationData, Results } from '@/components/CareerCoPilot';
import { analyzeCV, type CVAnalysis } from './cvAnalyzer';
import { analyzeJobDescription, type JobAnalysis } from './jobAnalyzer';
import { generateSpecificSuggestions, type SpecificSuggestion } from './suggestionGenerator';

// Simulate AI processing with intelligent analysis
async function simulateProcessing() {
  // Add a realistic delay to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
}

// Generate CV suggestions with specific, actionable recommendations
async function generateCVSuggestions(jobDescription: string, cvText: string): Promise<string> {
  await simulateProcessing();
  
  console.log('🔍 Performing deep CV analysis...');
  console.log('📊 Analyzing job requirements and CV alignment...');
  
  // Perform comprehensive analysis
  const cvAnalysis = analyzeCV(cvText);
  const jobAnalysis = analyzeJobDescription(jobDescription);
  const specificSuggestions = generateSpecificSuggestions(cvAnalysis, jobAnalysis);
  
  console.log(`✅ Generated ${specificSuggestions.length} specific suggestions`);
  
  // Format suggestions with specific examples from CV
  const formattedSuggestions = formatSuggestionsWithExamples(specificSuggestions, cvAnalysis, jobAnalysis);
  
  return formattedSuggestions;
}

function formatSuggestionsWithExamples(
  suggestions: SpecificSuggestion[],
  cvAnalysis: CVAnalysis,
  jobAnalysis: JobAnalysis
): string {
  const prioritySuggestions = suggestions.filter(s => s.priority === 'high');
  const mediumSuggestions = suggestions.filter(s => s.priority === 'medium');
  
  let output = `🎯 **Specific CV Enhancement Recommendations**

**🚀 HIGH PRIORITY CHANGES:**

`;

  prioritySuggestions.slice(0, 5).forEach((suggestion, index) => {
    output += `**${index + 1}. ${suggestion.category}**
📝 **Current:** ${suggestion.original}
✨ **Improved:** ${suggestion.suggested}
💡 **Why:** ${suggestion.reasoning}

`;
  });

  if (mediumSuggestions.length > 0) {
    output += `**⭐ ADDITIONAL IMPROVEMENTS:**

`;
    mediumSuggestions.slice(0, 3).forEach((suggestion, index) => {
      output += `**${index + 1}. ${suggestion.category}**
✨ **Suggestion:** ${suggestion.suggested}
💡 **Reasoning:** ${suggestion.reasoning}

`;
    });
  }

  // Add analysis summary
  output += `**📊 ANALYSIS SUMMARY:**
• **Skills Match:** ${cvAnalysis.skills.technical.length} technical skills found, ${jobAnalysis.requiredSkills.length} required by job
• **Experience Level:** ${jobAnalysis.experienceLevel} role detected
• **Industry Focus:** ${jobAnalysis.industry}
• **Key Strengths:** ${cvAnalysis.experience.technologies.slice(0, 3).join(', ')}
• **Missing Keywords:** ${jobAnalysis.keywords.filter(k => !cvAnalysis.sections.some(s => s.content.toLowerCase().includes(k))).slice(0, 3).join(', ')}

**🎯 NEXT STEPS:**
1. Apply high-priority changes first for maximum impact
2. Add specific metrics to quantify your achievements  
3. Align your summary with job requirements
4. Ensure technical skills match job posting order`;

  return output;
}

// Generate personalized cover letter with specific examples from CV
async function generateCoverLetter(jobDescription: string, personalTouch: string, cvText: string): Promise<string> {
  await simulateProcessing();
  
  console.log('🎯 Creating targeted cover letter with CV insights...');
  
  const cvAnalysis = analyzeCV(cvText);
  const jobAnalysis = analyzeJobDescription(jobDescription);
  
  // Extract specific achievements and experiences
  const relevantAchievements = cvAnalysis.experience.achievements
    .filter(achievement => 
      jobAnalysis.requiredSkills.some(skill => 
        achievement.toLowerCase().includes(skill.toLowerCase())
      )
    )
    .slice(0, 2);
  
  const matchingTechnologies = cvAnalysis.skills.technical
    .filter(tech => 
      jobAnalysis.requiredSkills.some(skill => 
        skill.toLowerCase().includes(tech.toLowerCase())
      )
    )
    .slice(0, 4);

  const roleTitle = jobAnalysis.roleTitle;
  const companyName = jobAnalysis.companyName;
  
  let coverLetter = `Dear Hiring Manager,

I am excited to apply for the ${roleTitle} position at ${companyName}. Your job posting perfectly aligns with my background in ${matchingTechnologies.slice(0, 2).join(' and ')}, and I'm eager to contribute to your team's success.`;

  // Add specific achievements from CV
  if (relevantAchievements.length > 0) {
    coverLetter += `\n\nIn my previous role, I ${relevantAchievements[0].toLowerCase()}`;
    if (relevantAchievements.length > 1) {
      coverLetter += ` Additionally, I ${relevantAchievements[1].toLowerCase()}`;
    }
    coverLetter += ` These experiences have prepared me well for the challenges outlined in your job description.`;
  }

  // Add technology alignment
  if (matchingTechnologies.length > 0) {
    coverLetter += `\n\nMy technical expertise includes ${matchingTechnologies.join(', ')}, which directly matches your requirements.`;
    
    // Add specific context if metrics are available
    if (cvAnalysis.experience.metrics.length > 0) {
      coverLetter += ` I have successfully delivered projects that ${cvAnalysis.experience.metrics[0].includes('%') ? 'improved performance by ' + cvAnalysis.experience.metrics[0] : 'impacted ' + cvAnalysis.experience.metrics[0]}.`;
    }
  }

  // Add industry-specific context
  if (jobAnalysis.industry !== 'Technology') {
    coverLetter += `\n\nI'm particularly drawn to ${companyName}'s work in ${jobAnalysis.industry.toLowerCase()}, and I believe my experience can help drive innovation in this space.`;
  }

  // Add personal touch if provided
  if (personalTouch) {
    coverLetter += `\n\n${personalTouch}`;
  }

  coverLetter += `\n\nI would love the opportunity to discuss how my proven track record with ${matchingTechnologies.slice(0, 2).join(' and ')} can contribute to ${companyName}'s continued success. Thank you for your consideration.

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