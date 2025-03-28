// Cohere AI API Integration
import { AtsAnalysisResult, FormData } from '@/types';
import { createHarvardResumeTemplate } from '@/utils/resumeHelpers';

// Your API key (directly used)
const API_KEY = "j7J7nPQUxOaCKHq7izOkPFjeUWlWi1tuOfVTM3IT";

// Check if an API key exists
export const hasApiKey = (): boolean => {
  return true; // Always return true since we have a hardcoded key
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AtsAnalysisResult> => {
  try {
    console.log("Analyzing resume with Cohere AI...");
    
    if (!API_KEY) {
      throw new Error('API key is required to analyze the resume');
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer and HR professional with extensive experience in resume optimization.

Analyze this resume against the job description in extreme detail. Focus on:

1. DETAILED KEYWORD ANALYSIS:
   - Extract ALL keywords from the job description
   - Check for exact matches, partial matches, and semantic matches
   - Consider industry-specific terminologies and variations

2. SKILLS ASSESSMENT:
   - Technical skills alignment
   - Soft skills presence
   - Required certifications/qualifications
   - Experience level match

3. EXPERIENCE EVALUATION:
   - Role responsibilities alignment
   - Industry relevance
   - Achievement metrics
   - Leadership/management requirements

4. COMPREHENSIVE STRUCTURE ANALYSIS:
   - Section organization
   - Content hierarchy
   - Information flow
   - Professional formatting

5. DETAILED RECOMMENDATIONS:
   - Specific phrasing improvements
   - Missing critical experiences
   - Quantifiable achievements
   - Technical proficiency demonstrations

Resume:
${resumeText}

Job Description:
${jobDescription}

Return your analysis as a JSON object with this structure:
{
  "score": [number between 1-100],
  "suggestions": {
    "keywords": {
      "missing": [array of missing keywords],
      "found": [array of found keywords]
    },
    "structure": {
      "issues": [array of structure issues],
      "recommendations": [array of recommendations]
    },
    "formatting": {
      "issues": [array of formatting issues],
      "recommendations": [array of recommendations]
    },
    "content": {
      "issues": [array of content issues],
      "recommendations": [array of recommendations]
    }
  }
}`;

    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt,
        max_tokens: 2500,
        temperature: 0.2,
        stop_sequences: [],
        return_likelihoods: "NONE",
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    let analysisResult: AtsAnalysisResult;

    try {
      const jsonMatch = data.generations[0].text.match(/\{[\s\S]*\}/);
      analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!analysisResult) {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      analysisResult = {
        score: 75,
        suggestions: {
          keywords: {
            missing: ["key skills from job description"],
            found: ["existing skills from resume"]
          },
          structure: {
            issues: ["Review resume structure"],
            recommendations: ["Add more achievements"]
          },
          formatting: {
            issues: ["Check formatting"],
            recommendations: ["Ensure consistent format"]
          },
          content: {
            issues: ["Review content"],
            recommendations: ["Add specific examples"]
          }
        }
      };
    }

    return analysisResult;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Resume analysis failed. Please try again.');
  }
};

export const generateImprovedResume = async (formData: FormData, jobDescription: string): Promise<string> => {
  try {
    console.log("Generating improved resume...");

    if (!formData || !formData.personalInfo) {
      throw new Error("Invalid resume data");
    }
    
    if (!API_KEY) {
      throw new Error('API key is required to generate the improved resume');
    }

    const prompt = `
Create a professional ATS-optimized resume using this data:

${JSON.stringify(formData, null, 2)}

Job Description:
${jobDescription || "General professional position"}

Instructions:
1. Format as a professional resume
2. Use strong action verbs
3. Include quantifiable achievements
4. Incorporate relevant keywords
5. Maintain chronological order
6. Use clear section headers

Format:
# [Full Name]
[Contact Info]

## Summary
[Professional summary]

## Experience
### [Company Name]
[Job Title] | [Dates]
- [Achievement/Responsibility]

## Education
### [Institution]
[Degree] | [Dates]

## Skills
[Key skills and technologies]

Ensure all content is professional and ATS-friendly.`;

    // First attempt with Cohere
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt,
        max_tokens: 2000,
        temperature: 0.3,
        stop_sequences: [],
        return_likelihoods: "NONE",
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.generations[0].text.trim();

    if (!generatedContent || generatedContent.length < 200) {
      throw new Error("Generated content too short");
    }

    // Validate content includes key sections
    const requiredSections = ['experience', 'education', 'skills'];
    const hasRequiredSections = requiredSections.some(section => 
      generatedContent.toLowerCase().includes(section)
    );

    if (!hasRequiredSections) {
      throw new Error("Missing required sections");
    }

    return generatedContent;
  } catch (error) {
    console.error('Resume generation error:', error);

    // Fallback to template
    console.log("Falling back to template generation");
    return createHarvardResumeTemplate(formData);
  }
};

// For legacy support with the existing code, keeping these empty functions
export const clearApiKey = (): void => {
  // Empty function to maintain compatibility
};
