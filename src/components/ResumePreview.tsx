
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, 
  FileText, 
  CheckCircle2,
  FileOutput,
  Edit,
  Save
} from 'lucide-react';
import { FormData, FileFormat } from '@/types';
import { exportResume, createHarvardResumeTemplate } from '@/utils/resumeHelpers';
import { generateImprovedResume, clearApiKey, hasApiKey } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

interface ResumePreviewProps {
  formData: FormData;
  jobDescription?: string;
  resumeText?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  formData, 
  jobDescription = '',
  resumeText = ''
}) => {
  const [fileFormat, setFileFormat] = useState<FileFormat>('docx');
  const [template, setTemplate] = useState<string>('harvard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [improvedContent, setImprovedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState<string>('');
  const { toast } = useToast();

  const handleGenerateImprovedResume = async () => {
    setIsGenerating(true);

    try {
      // First try to use the AI generated content
      const content = await generateImprovedResume(formData, jobDescription);
      setImprovedContent(content);
      setEditableContent(content);

      toast({
        title: "Resume Generated",
        description: "Your ATS-optimized resume has been created",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating improved resume:', error);

      // Fallback to using the template directly
      const fallbackContent = createHarvardResumeTemplate(formData);
      setImprovedContent(fallbackContent);
      setEditableContent(fallbackContent);

      toast({
        title: "Using Template",
        description: "Generated resume using Harvard template",
        variant: "default",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportResume = async () => {
    setIsExporting(true);
    try {
      // Use the edited content if in edit mode
      const contentToExport = isEditing ? editableContent : improvedContent;
      
      const blob = await exportResume(formData, 'docx', contentToExport);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.personalInfo.firstName || 'Resume'}_${formData.personalInfo.lastName || 'Template'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume Downloaded",
        description: `Your resume has been downloaded as DOCX file`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error exporting resume:', error);

      toast({
        title: "Download Failed",
        description: "There was an error downloading your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      setImprovedContent(editableContent);
      setIsEditing(false);
      
      toast({
        title: "Changes Saved",
        description: "Your edits have been applied to the resume",
        variant: "default",
      });
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value);
  };

  const resetApiKey = () => {
    clearApiKey();
    toast({
      title: "API Key Cleared",
      description: "Your Cohere API key has been removed from local storage",
      variant: "default",
    });
  };

  useEffect(() => {
    if (formData && !improvedContent) {
      handleGenerateImprovedResume();
    }
  }, [formData]);

  // Helper function to format markdown for display
  const formatMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-4 mb-2 text-primary">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-md font-medium mt-3 mb-1">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-5 list-disc">$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Your Resume</h2>
          <p className="text-muted-foreground">
            Preview, edit, and download your ATS-optimized resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Format & Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Choose Template</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={template === 'harvard' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTemplate('harvard')}
                      className="justify-start"
                    >
                      <CheckCircle2 className={`h-4 w-4 mr-2 ${
                        template === 'harvard' ? 'opacity-100' : 'opacity-0'
                      }`} />
                      Harvard Template
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Download Format</h4>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                  >
                    DOCX
                  </Button>
                </div>

                <Button 
                  onClick={handleExportResume} 
                  disabled={isExporting || !improvedContent}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Resume
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleGenerateImprovedResume}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <FileOutput className="mr-2 h-4 w-4" />
                      Regenerate Resume
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={toggleEditMode}
                  className="w-full"
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Resume
                    </>
                  )}
                </Button>

                {hasApiKey() && (
                  <Button 
                    variant="outline" 
                    onClick={resetApiKey}
                    className="w-full text-red-500 hover:text-red-600"
                  >
                    Reset API Key
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    {isEditing ? 'Edit Resume' : 'Resume Preview'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea 
                    value={editableContent}
                    onChange={handleContentChange}
                    className="min-h-[70vh] font-mono text-sm"
                    placeholder="Edit your resume content here..."
                  />
                ) : (
                  <div className="bg-white text-black border rounded-md p-6 shadow-sm min-h-[70vh] overflow-y-auto prose prose-sm max-w-none">
                    {isGenerating ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full mb-4" />
                          <p>Generating your resume...</p>
                        </div>
                      </div>
                    ) : improvedContent ? (
                      <div 
                        className="whitespace-pre-wrap" 
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(improvedContent) }} 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No content to preview</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
