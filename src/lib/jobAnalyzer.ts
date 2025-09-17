export interface JobAnalysis {
  roleTitle: string;
  companyName: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  responsibilities: string[];
  requirements: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  industry: string;
  benefits: string[];
}

export function analyzeJobDescription(jobDescription: string): JobAnalysis {
  return {
    roleTitle: extractRoleTitle(jobDescription),
    companyName: extractCompanyName(jobDescription),
    requiredSkills: extractRequiredSkills(jobDescription),
    preferredSkills: extractPreferredSkills(jobDescription),
    keywords: extractKeywords(jobDescription),
    responsibilities: extractResponsibilities(jobDescription),
    requirements: extractRequirements(jobDescription),
    experienceLevel: determineExperienceLevel(jobDescription),
    industry: determineIndustry(jobDescription),
    benefits: extractBenefits(jobDescription)
  };
}

function extractRoleTitle(jobDescription: string): string {
  const patterns = [
    /(?:position|role|job title|title):\s*([A-Z][a-zA-Z\s-]+?)(?:\s|,|\.|\n|$)/i,
    /(?:hiring|seeking|looking for)\s+(?:a\s+)?([A-Z][a-zA-Z\s-]+?)(?:\s|,|\.|\n|$)/i,
    /^([A-Z][a-zA-Z\s-]+?)(?:\s-\s|\sat\s)/m
  ];
  
  for (const pattern of patterns) {
    const match = pattern.exec(jobDescription);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return 'Position';
}

function extractCompanyName(jobDescription: string): string {
  const patterns = [
    /(?:at|@|company:|employer:)\s+([A-Z][a-zA-Z\s&.,Inc-]+?)(?:\s|,|\.|\n|is|we|our)/i,
    /([A-Z][a-zA-Z\s&.,Inc-]+?)\s+(?:is looking|is seeking|is hiring)/i,
    /(?:join|work at|careers at)\s+([A-Z][a-zA-Z\s&.,Inc-]+?)(?:\s|,|\.|\n|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = pattern.exec(jobDescription);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, ' ');
    }
  }
  
  return 'Company';
}

function extractRequiredSkills(jobDescription: string): string[] {
  const skills = new Set<string>();
  
  // Technical skills pattern (comprehensive)
  const techPattern = /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Svelte|Node\.js|Express|Fastify|MongoDB|PostgreSQL|MySQL|SQLite|Redis|AWS|Azure|GCP|Google Cloud|Docker|Kubernetes|Git|GitHub|GitLab|HTML|CSS|SCSS|SASS|Tailwind|Bootstrap|PHP|Ruby|Rails|C\+\+|C#|\.NET|Swift|Kotlin|Flutter|Dart|Unity|TensorFlow|PyTorch|Pandas|NumPy|Django|Flask|FastAPI|Laravel|Spring|Hibernate|GraphQL|REST|API|Microservices|Agile|Scrum|Kanban|DevOps|CI\/CD|Jenkins|GitHub Actions|Terraform|Ansible|Linux|Ubuntu|CentOS|Windows|macOS|Android|iOS|React Native|Expo|Next\.js|Nuxt\.js|Gatsby|Webpack|Vite|Rollup|Babel|ESLint|Prettier|Jest|Cypress|Playwright|Selenium|Figma|Sketch|Adobe|Photoshop|Illustrator|InDesign|Blockchain|Solidity|Web3|Machine Learning|AI|Data Science|Big Data|Apache|Nginx|Elasticsearch|Kibana|Grafana|Prometheus|Kubernetes|Helm|Istio|Service Mesh|Event Sourcing|CQRS|Domain Driven Design|Clean Architecture|Test Driven Development|Behavior Driven Development|Pair Programming|Code Review|Continuous Integration|Continuous Deployment|Blue Green Deployment|Canary Deployment|Feature Flags|A\/B Testing|Performance Testing|Load Testing|Security Testing|Penetration Testing|OAuth|JWT|SAML|LDAP|Active Directory|Single Sign On|Multi Factor Authentication|Encryption|SSL|TLS|HTTPS|Firewall|VPN|Network Security|Cloud Security|Data Privacy|GDPR|HIPAA|SOC2|ISO27001|PCI DSS)\b/gi;
  
  const matches = jobDescription.match(techPattern);
  if (matches) {
    matches.forEach(skill => skills.add(skill));
  }
  
  // Look for skills in requirements sections
  const requirementsSections = extractSectionsContaining(jobDescription, ['required', 'must have', 'essential', 'minimum', 'qualifications']);
  requirementsSections.forEach(section => {
    const sectionMatches = section.match(techPattern);
    if (sectionMatches) {
      sectionMatches.forEach(skill => skills.add(skill));
    }
  });
  
  return Array.from(skills);
}

function extractPreferredSkills(jobDescription: string): string[] {
  const skills = new Set<string>();
  
  const techPattern = /\b(JavaScript|TypeScript|Python|Java|React|Angular|Vue|Node\.js|Express|MongoDB|PostgreSQL|MySQL|AWS|Azure|Docker|Kubernetes|Git|HTML|CSS|PHP|Ruby|C\+\+|C#|Swift|Kotlin|Flutter|Unity|TensorFlow|PyTorch|Django|Flask|Laravel|Spring|GraphQL|REST|API|Microservices|Agile|Scrum|DevOps|CI\/CD|Machine Learning|AI|Data Science|Cloud|Blockchain|Cybersecurity)\b/gi;
  
  const preferredSections = extractSectionsContaining(jobDescription, ['preferred', 'nice to have', 'bonus', 'plus', 'additional', 'desired']);
  preferredSections.forEach(section => {
    const matches = section.match(techPattern);
    if (matches) {
      matches.forEach(skill => skills.add(skill));
    }
  });
  
  return Array.from(skills);
}

function extractKeywords(jobDescription: string): string[] {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'a', 'an', 'this', 'that', 'these', 'those', 'our', 'your', 'their', 'we', 'you', 'they', 'i', 'me', 'my', 'us', 'him', 'her', 'his', 'its', 'who', 'what', 'when', 'where', 'why', 'how'];
  
  return jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .reduce((acc, word) => {
      const existing = acc.find(w => w.word === word);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ word, count: 1 });
      }
      return acc;
    }, [] as { word: string; count: number }[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map(item => item.word);
}

function extractResponsibilities(jobDescription: string): string[] {
  const responsibilitySections = extractSectionsContaining(jobDescription, ['responsibilities', 'duties', 'role', 'what you\'ll do', 'day to day', 'key tasks', 'primary functions']);
  
  const responsibilities: string[] = [];
  responsibilitySections.forEach(section => {
    const bulletPoints = extractBulletPointsFromText(section);
    responsibilities.push(...bulletPoints);
  });
  
  return responsibilities.slice(0, 10);
}

function extractRequirements(jobDescription: string): string[] {
  const requirementSections = extractSectionsContaining(jobDescription, ['requirements', 'qualifications', 'must have', 'essential', 'minimum', 'experience', 'skills', 'what we\'re looking for']);
  
  const requirements: string[] = [];
  requirementSections.forEach(section => {
    const bulletPoints = extractBulletPointsFromText(section);
    requirements.push(...bulletPoints);
  });
  
  return requirements.slice(0, 10);
}

function determineExperienceLevel(jobDescription: string): JobAnalysis['experienceLevel'] {
  const text = jobDescription.toLowerCase();
  
  if (text.includes('senior') || text.includes('sr.') || text.includes('lead') || text.includes('principal') || /\b(\d+)\+?\s*years?\s*(?:of\s*)?experience/.test(text) && parseInt(text.match(/\b(\d+)\+?\s*years?\s*(?:of\s*)?experience/)?.[1] || '0') >= 5) {
    return 'senior';
  }
  if (text.includes('lead') || text.includes('team lead') || text.includes('tech lead') || text.includes('technical lead')) {
    return 'lead';
  }
  if (text.includes('director') || text.includes('vp') || text.includes('cto') || text.includes('head of') || text.includes('chief')) {
    return 'executive';
  }
  if (text.includes('junior') || text.includes('jr.') || text.includes('entry') || text.includes('graduate') || text.includes('intern') || /\b[0-2]\s*years?\s*(?:of\s*)?experience/.test(text)) {
    return 'entry';
  }
  
  return 'mid';
}

function determineIndustry(jobDescription: string): string {
  const text = jobDescription.toLowerCase();
  
  const industries = [
    { keywords: ['fintech', 'financial', 'banking', 'payment', 'trading', 'cryptocurrency', 'blockchain'], name: 'Financial Technology' },
    { keywords: ['healthcare', 'medical', 'hospital', 'patient', 'clinical', 'pharma', 'biotech'], name: 'Healthcare' },
    { keywords: ['ecommerce', 'e-commerce', 'retail', 'shopping', 'marketplace', 'consumer'], name: 'E-commerce' },
    { keywords: ['saas', 'software as a service', 'b2b', 'enterprise', 'cloud'], name: 'SaaS' },
    { keywords: ['gaming', 'game', 'entertainment', 'media', 'streaming'], name: 'Gaming & Entertainment' },
    { keywords: ['education', 'learning', 'edtech', 'student', 'academic'], name: 'Education Technology' },
    { keywords: ['startup', 'early stage', 'series a', 'series b', 'venture'], name: 'Startup' },
    { keywords: ['consulting', 'agency', 'services', 'client work'], name: 'Consulting' }
  ];
  
  for (const industry of industries) {
    if (industry.keywords.some(keyword => text.includes(keyword))) {
      return industry.name;
    }
  }
  
  return 'Technology';
}

function extractBenefits(jobDescription: string): string[] {
  const benefitSections = extractSectionsContaining(jobDescription, ['benefits', 'perks', 'what we offer', 'compensation', 'package', 'rewards']);
  
  const benefits: string[] = [];
  benefitSections.forEach(section => {
    const bulletPoints = extractBulletPointsFromText(section);
    benefits.push(...bulletPoints);
  });
  
  return benefits.slice(0, 8);
}

function extractSectionsContaining(text: string, keywords: string[]): string[] {
  const sections: string[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    if (keywords.some(keyword => line.includes(keyword))) {
      // Found a section header, collect content until next major section
      const sectionLines: string[] = [];
      let j = i + 1;
      
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        
        // Stop if we hit another major section header
        if (nextLine.length > 0 && /^[A-Z]/.test(nextLine) && nextLine.endsWith(':') && !nextLine.includes('.')) {
          break;
        }
        
        if (nextLine.length > 0) {
          sectionLines.push(nextLine);
        }
        
        j++;
        
        // Limit section size
        if (sectionLines.length > 20) break;
      }
      
      if (sectionLines.length > 0) {
        sections.push(sectionLines.join('\n'));
      }
    }
  }
  
  return sections;
}

function extractBulletPointsFromText(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./))
    .map(line => line.replace(/^[•\-*\d\.]\s*/, '').trim())
    .filter(line => line.length > 10); // Filter out very short bullet points
}