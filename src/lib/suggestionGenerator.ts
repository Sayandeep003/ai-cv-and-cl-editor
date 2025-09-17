import type { CVAnalysis } from './cvAnalyzer';
import type { JobAnalysis } from './jobAnalyzer';

export interface SpecificSuggestion {
  category: string;
  original: string;
  suggested: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateSpecificSuggestions(
  cvAnalysis: CVAnalysis,
  jobAnalysis: JobAnalysis
): SpecificSuggestion[] {
  const suggestions: SpecificSuggestion[] = [];

  // Analyze experience section for specific improvements
  suggestions.push(...analyzeExperienceSection(cvAnalysis, jobAnalysis));
  
  // Analyze skills alignment
  suggestions.push(...analyzeSkillsAlignment(cvAnalysis, jobAnalysis));
  
  // Analyze summary/objective
  suggestions.push(...analyzeSummarySection(cvAnalysis, jobAnalysis));
  
  // Analyze achievements and quantification
  suggestions.push(...analyzeAchievements(cvAnalysis, jobAnalysis));

  // Sort by priority
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function analyzeExperienceSection(
  cvAnalysis: CVAnalysis,
  jobAnalysis: JobAnalysis
): SpecificSuggestion[] {
  const suggestions: SpecificSuggestion[] = [];
  const experienceSection = cvAnalysis.sections.find(s => s.type === 'experience');

  if (!experienceSection?.bulletPoints) return suggestions;

  // Check for weak action verbs in actual bullet points
  experienceSection.bulletPoints.forEach((bullet, index) => {
    const weakVerbs = ['responsible for', 'worked on', 'helped with', 'participated in', 'involved in', 'assisted with'];
    const weakVerb = weakVerbs.find(verb => bullet.toLowerCase().includes(verb));
    
    if (weakVerb) {
      const strongVerbs = getStrongVerbForContext(bullet, jobAnalysis.requiredSkills);
      suggestions.push({
        category: 'Action Verbs',
        original: `"${bullet}"`,
        suggested: `"${bullet.replace(new RegExp(weakVerb, 'gi'), strongVerbs[0])}"`,
        reasoning: `Replace weak verb "${weakVerb}" with stronger action verb "${strongVerbs[0]}" to show direct impact`,
        priority: 'high'
      });
    }
  });

  // Check for missing quantification in specific bullet points
  experienceSection.bulletPoints.forEach((bullet) => {
    if (!/\d+/.test(bullet)) {
      const context = identifyContext(bullet);
      const suggestedMetric = suggestMetricForContext(context);
      
      suggestions.push({
        category: 'Quantification',
        original: `"${bullet}"`,
        suggested: `"${bullet} (${suggestedMetric})"`,
        reasoning: 'Add specific metrics to demonstrate measurable impact',
        priority: 'high'
      });
    }
  });

  return suggestions;
}

function analyzeSkillsAlignment(
  cvAnalysis: CVAnalysis,
  jobAnalysis: JobAnalysis
): SpecificSuggestion[] {
  const suggestions: SpecificSuggestion[] = [];
  
  // Find missing critical skills that are mentioned in job but not in CV
  const missingCriticalSkills = jobAnalysis.requiredSkills.filter(skill => 
    !cvAnalysis.skills.technical.some(cvSkill => 
      cvSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  if (missingCriticalSkills.length > 0) {
    const skillsSection = cvAnalysis.sections.find(s => s.type === 'skills');
    if (skillsSection) {
      suggestions.push({
        category: 'Skills Alignment',
        original: `Current skills section: "${skillsSection.content.substring(0, 100)}..."`,
        suggested: `Add these job-critical skills if you have experience: ${missingCriticalSkills.slice(0, 3).join(', ')}`,
        reasoning: `These skills are specifically mentioned as requirements in the job posting`,
        priority: 'high'
      });
    }
  }

  // Suggest reordering skills to match job priorities
  const prioritizedSkills = jobAnalysis.requiredSkills.filter(skill =>
    cvAnalysis.skills.technical.some(cvSkill =>
      cvSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );

  if (prioritizedSkills.length > 0) {
    suggestions.push({
      category: 'Skills Priority',
      original: 'Current skills order',
      suggested: `Reorder skills to lead with: ${prioritizedSkills.slice(0, 5).join(', ')}`,
      reasoning: 'Place job-relevant skills first to catch recruiter attention',
      priority: 'medium'
    });
  }

  return suggestions;
}

function analyzeSummarySection(
  cvAnalysis: CVAnalysis,
  jobAnalysis: JobAnalysis
): SpecificSuggestion[] {
  const suggestions: SpecificSuggestion[] = [];
  const summarySection = cvAnalysis.sections.find(s => s.type === 'summary');

  if (!summarySection) {
    suggestions.push({
      category: 'Professional Summary',
      original: 'Missing professional summary',
      suggested: `Add a 2-3 line summary highlighting: ${jobAnalysis.roleTitle} experience, ${jobAnalysis.requiredSkills.slice(0, 2).join(' and ')}, and relevant achievements`,
      reasoning: 'A targeted summary immediately shows alignment with the role',
      priority: 'high'
    });
  } else {
    // Check if summary mentions job-relevant keywords
    const summaryText = summarySection.content.toLowerCase();
    const missingJobKeywords = jobAnalysis.keywords.filter(keyword => 
      !summaryText.includes(keyword.toLowerCase())
    ).slice(0, 3);

    if (missingJobKeywords.length > 0) {
      suggestions.push({
        category: 'Summary Keywords',
        original: `Current summary: "${summarySection.content}"`,
        suggested: `Incorporate these job-relevant terms: ${missingJobKeywords.join(', ')}`,
        reasoning: 'Including job-specific keywords helps pass ATS screening',
        priority: 'medium'
      });
    }
  }

  return suggestions;
}

function analyzeAchievements(
  cvAnalysis: CVAnalysis,
  jobAnalysis: JobAnalysis
): SpecificSuggestion[] {
  const suggestions: SpecificSuggestion[] = [];

  // Look for achievements that could be better quantified
  cvAnalysis.experience.achievements.forEach(achievement => {
    if (!/\d+/.test(achievement)) {
      const context = identifyContext(achievement);
      const suggestedMetric = suggestMetricForContext(context);
      
      suggestions.push({
        category: 'Achievement Quantification',
        original: `"${achievement}"`,
        suggested: `"${achievement.replace(/\.$/, '')} - ${suggestedMetric}"`,
        reasoning: 'Add specific numbers to make achievements more impactful',
        priority: 'medium'
      });
    }
  });

  return suggestions;
}

function getStrongVerbForContext(bullet: string, requiredSkills: string[]): string[] {
  const context = bullet.toLowerCase();
  
  if (context.includes('develop') || context.includes('build') || context.includes('create')) {
    return ['Architected', 'Engineered', 'Developed'];
  }
  if (context.includes('manage') || context.includes('lead') || context.includes('team')) {
    return ['Led', 'Directed', 'Managed'];
  }
  if (context.includes('improve') || context.includes('optimize') || context.includes('enhance')) {
    return ['Optimized', 'Enhanced', 'Improved'];
  }
  if (context.includes('implement') || context.includes('deploy')) {
    return ['Implemented', 'Deployed', 'Executed'];
  }
  if (context.includes('analyze') || context.includes('research')) {
    return ['Analyzed', 'Researched', 'Investigated'];
  }
  
  return ['Delivered', 'Achieved', 'Accomplished'];
}

function identifyContext(text: string): string {
  const context = text.toLowerCase();
  
  if (context.includes('performance') || context.includes('speed') || context.includes('load')) {
    return 'performance';
  }
  if (context.includes('user') || context.includes('customer') || context.includes('client')) {
    return 'users';
  }
  if (context.includes('team') || context.includes('people') || context.includes('member')) {
    return 'team';
  }
  if (context.includes('cost') || context.includes('budget') || context.includes('save')) {
    return 'cost';
  }
  if (context.includes('time') || context.includes('deadline') || context.includes('schedule')) {
    return 'time';
  }
  if (context.includes('revenue') || context.includes('sales') || context.includes('profit')) {
    return 'revenue';
  }
  
  return 'general';
}

function suggestMetricForContext(context: string): string {
  const metrics = {
    performance: 'reduced load time by 40%',
    users: 'impacting 10,000+ users',
    team: 'leading team of 5+ developers',
    cost: 'saving $50K annually',
    time: 'delivering 2 weeks ahead of schedule',
    revenue: 'contributing to 15% revenue increase',
    general: 'achieving 95% success rate'
  };
  
  return metrics[context as keyof typeof metrics] || metrics.general;
}