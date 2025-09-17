export interface CVSection {
  type: 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'achievements';
  content: string;
  bulletPoints?: string[];
}

export interface CVAnalysis {
  sections: CVSection[];
  experience: {
    roles: string[];
    companies: string[];
    achievements: string[];
    technologies: string[];
    metrics: string[];
  };
  skills: {
    technical: string[];
    soft: string[];
    certifications: string[];
  };
  weaknesses: string[];
}

export function analyzeCV(cvText: string): CVAnalysis {
  const sections = extractSections(cvText);
  const experience = extractExperience(cvText);
  const skills = extractSkills(cvText);
  const weaknesses = identifyWeaknesses(cvText, sections);

  return {
    sections,
    experience,
    skills,
    weaknesses
  };
}

function extractSections(cvText: string): CVSection[] {
  const sections: CVSection[] = [];
  const lines = cvText.split('\n').map(line => line.trim()).filter(Boolean);
  
  let currentSection: CVSection | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if this line is a section header
    const sectionType = identifySectionType(line);
    
    if (sectionType) {
      // Save previous section if exists
      if (currentSection) {
        currentSection.content = currentContent.join('\n');
        currentSection.bulletPoints = extractBulletPoints(currentContent);
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        type: sectionType,
        content: '',
        bulletPoints: []
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Add final section
  if (currentSection) {
    currentSection.content = currentContent.join('\n');
    currentSection.bulletPoints = extractBulletPoints(currentContent);
    sections.push(currentSection);
  }

  return sections;
}

function identifySectionType(line: string): CVSection['type'] | null {
  const normalizedLine = line.toLowerCase().replace(/[^\w\s]/g, '');
  
  if (normalizedLine.includes('summary') || normalizedLine.includes('profile') || normalizedLine.includes('objective')) {
    return 'summary';
  }
  if (normalizedLine.includes('experience') || normalizedLine.includes('employment') || normalizedLine.includes('work history')) {
    return 'experience';
  }
  if (normalizedLine.includes('skill') || normalizedLine.includes('technical') || normalizedLine.includes('competenc')) {
    return 'skills';
  }
  if (normalizedLine.includes('education') || normalizedLine.includes('qualification') || normalizedLine.includes('academic')) {
    return 'education';
  }
  if (normalizedLine.includes('project') || normalizedLine.includes('portfolio')) {
    return 'projects';
  }
  if (normalizedLine.includes('achievement') || normalizedLine.includes('award') || normalizedLine.includes('accomplishment')) {
    return 'achievements';
  }
  
  return null;
}

function extractBulletPoints(content: string[]): string[] {
  return content
    .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./))
    .map(line => line.replace(/^[•\-*\d\.]\s*/, '').trim());
}

function extractExperience(cvText: string): CVAnalysis['experience'] {
  const roles: string[] = [];
  const companies: string[] = [];
  const achievements: string[] = [];
  const technologies: string[] = [];
  const metrics: string[] = [];

  // Extract job titles/roles
  const rolePattern = /(Software Engineer|Developer|Manager|Lead|Senior|Junior|Analyst|Consultant|Designer|Architect|Director|VP|CTO|CEO|Intern|Coordinator|Specialist|Technician)[\w\s]*/gi;
  roles.push(...(cvText.match(rolePattern) || []).map(role => role.trim()));

  // Extract company names (typically after "at", before years)
  const companyPattern = /(?:at|@)\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s*\(|\s*-|\s*\d{4}|\s*$)/g;
  let match;
  while ((match = companyPattern.exec(cvText)) !== null) {
    companies.push(match[1].trim());
  }

  // Extract metrics and numbers
  const metricsPattern = /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(%|percent|users|customers|revenue|sales|projects|teams|people|hours|days|months|years|million|billion|thousand|k|m|b)/gi;
  while ((match = metricsPattern.exec(cvText)) !== null) {
    metrics.push(match[0].trim());
  }

  // Extract technologies
  const techPattern = /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes|Git|HTML|CSS|PHP|Ruby|C\+\+|C#|Swift|Kotlin|Flutter|Unity|TensorFlow|PyTorch|Django|Flask|Laravel|Spring|Bootstrap|Tailwind|GraphQL|REST|API|Microservices|Agile|Scrum|DevOps|CI\/CD|Machine Learning|AI|Data Science|SQL|NoSQL|Redis|Elasticsearch|Jenkins|Terraform|Ansible|Linux|Windows|macOS|Android|iOS|React Native|Next\.js|Nuxt\.js|Svelte|Webpack|Vite|Babel|ESLint|Prettier|Jest|Cypress|Selenium|Figma|Sketch|Adobe|Photoshop|Illustrator)\b/gi;
  technologies.push(...(cvText.match(techPattern) || []).map(tech => tech.trim()));

  // Extract achievement-related sentences
  const achievementPattern = /(achieved|increased|reduced|improved|led|managed|developed|implemented|created|built|designed|optimized|automated|streamlined|delivered|launched|established|initiated|coordinated|supervised|mentored|trained)[^.!?]*[.!?]/gi;
  achievements.push(...(cvText.match(achievementPattern) || []).map(achievement => achievement.trim()));

  return {
    roles: [...new Set(roles)],
    companies: [...new Set(companies)],
    achievements: [...new Set(achievements)].slice(0, 10),
    technologies: [...new Set(technologies)],
    metrics: [...new Set(metrics)]
  };
}

function extractSkills(cvText: string): CVAnalysis['skills'] {
  const technical: string[] = [];
  const soft: string[] = [];
  const certifications: string[] = [];

  // Technical skills (expanded pattern)
  const techPattern = /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes|Git|HTML|CSS|PHP|Ruby|C\+\+|C#|Swift|Kotlin|Flutter|Unity|TensorFlow|PyTorch|Django|Flask|Laravel|Spring|Bootstrap|Tailwind|GraphQL|REST|API|Microservices|Agile|Scrum|DevOps|CI\/CD|Machine Learning|AI|Data Science|SQL|NoSQL|Redis|Elasticsearch|Jenkins|Terraform|Ansible|Linux|Windows|macOS|Android|iOS|React Native|Next\.js|Nuxt\.js|Svelte|Webpack|Vite|Babel|ESLint|Prettier|Jest|Cypress|Selenium|Figma|Sketch|Adobe|Photoshop|Illustrator|Kubernetes|Blockchain|Cybersecurity|Cloud Computing|Big Data|IoT|AR|VR)\b/gi;
  technical.push(...(cvText.match(techPattern) || []));

  // Soft skills
  const softSkillsPattern = /\b(leadership|communication|teamwork|problem.solving|analytical|creative|innovative|collaborative|adaptable|organized|detail.oriented|time.management|project.management|critical.thinking|decision.making|negotiation|presentation|mentoring|coaching|strategic|planning|multitasking|customer.service|interpersonal|emotional.intelligence|conflict.resolution|flexibility|reliability|initiative|self.motivated|results.driven|goal.oriented|performance.driven)\b/gi;
  soft.push(...(cvText.match(softSkillsPattern) || []));

  // Certifications
  const certPattern = /\b(AWS|Azure|Google Cloud|Certified|Certification|PMP|Scrum Master|CompTIA|Cisco|Microsoft|Oracle|Salesforce|HubSpot|Google Analytics|Adobe Certified|PMI|CISSP|CISM|Security\+|Network\+|A\+|Linux\+|CCNA|CCNP|CCIE|Red Hat|Docker|Kubernetes)\b[^.]*(?:Certified|Certification|Certificate)/gi;
  certifications.push(...(cvText.match(certPattern) || []));

  return {
    technical: [...new Set(technical)],
    soft: [...new Set(soft)],
    certifications: [...new Set(certifications)]
  };
}

function identifyWeaknesses(cvText: string, sections: CVSection[]): string[] {
  const weaknesses: string[] = [];
  
  // Check for missing quantification
  const hasMetrics = /\d+(?:,\d{3})*(?:\.\d+)?\s*(%|percent|users|customers|revenue|sales|projects|teams|people)/i.test(cvText);
  if (!hasMetrics) {
    weaknesses.push('Missing quantifiable achievements and metrics');
  }

  // Check for weak action verbs
  const weakVerbs = ['responsible for', 'worked on', 'helped with', 'participated in', 'involved in'];
  const hasWeakVerbs = weakVerbs.some(verb => cvText.toLowerCase().includes(verb));
  if (hasWeakVerbs) {
    weaknesses.push('Using weak action verbs instead of strong impact-focused verbs');
  }

  // Check for missing summary
  const hasSummary = sections.some(section => section.type === 'summary');
  if (!hasSummary) {
    weaknesses.push('Missing professional summary or objective section');
  }

  // Check for generic descriptions
  const genericPhrases = ['hard worker', 'team player', 'detail oriented', 'fast learner'];
  const hasGenericPhrases = genericPhrases.some(phrase => cvText.toLowerCase().includes(phrase));
  if (hasGenericPhrases) {
    weaknesses.push('Contains generic phrases that lack specificity');
  }

  return weaknesses;
}