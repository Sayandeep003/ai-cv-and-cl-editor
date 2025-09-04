import * as mammoth from 'mammoth';

export interface FileParseResult {
  text: string;
  success: boolean;
  error?: string;
}

export const parseFile = async (file: File): Promise<FileParseResult> => {
  try {
    if (file.type === 'application/pdf') {
      return await parsePdf(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.name.endsWith('.docx')) {
      return await parseDocx(file);
    } else {
      return {
        text: '',
        success: false,
        error: 'Unsupported file format. Please upload a PDF or DOCX file.'
      };
    }
  } catch (error) {
    return {
      text: '',
      success: false,
      error: `Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

const parsePdf = async (file: File): Promise<FileParseResult> => {
  try {
    // For now, return a placeholder since pdf-parse requires Node.js
    // In a real implementation, this would be handled by a backend service
    return {
      text: `[PDF Content from ${file.name}]\n\nNote: PDF parsing is not yet implemented in the browser. Please copy and paste your CV content into the job description field as a workaround.`,
      success: false,
      error: 'PDF parsing requires backend processing. Please use DOCX format or copy/paste your content.'
    };
  } catch (error) {
    return {
      text: '',
      success: false,
      error: `Error parsing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

const parseDocx = async (file: File): Promise<FileParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      return {
        text: '',
        success: false,
        error: 'No text content found in the document.'
      };
    }
    
    return {
      text: result.value,
      success: true
    };
  } catch (error) {
    return {
      text: '',
      success: false,
      error: `Error parsing DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB.'
    };
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const allowedExtensions = ['.pdf', '.docx'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Please upload a PDF or DOCX file only.'
    };
  }

  return { valid: true };
};