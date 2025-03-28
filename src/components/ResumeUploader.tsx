import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { parseResumeFromFile } from '@/utils/resumeHelpers';
import { FileIcon, UploadCloudIcon, FileText } from 'lucide-react';

interface ResumeUploaderProps {
  onResumeExtracted: (text: string) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type - Only accept DOCX files
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a DOCX file only.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const extractedText = await parseResumeFromFile(file);
      onResumeExtracted(extractedText);
      
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been parsed and is ready for analysis.",
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Upload Your Resume</h2>
          <p className="text-muted-foreground">
            Upload your resume (.docx) for AI-powered ATS analysis and optimization
          </p>
        </div>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-6 relative transition-all duration-200 ease-in-out ${
            isDragging ? 'scale-[1.02]' : 'scale-100'
          }`}
        >
          <Card className={`border-2 border-dashed p-6 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
          }`}>
            <CardContent className="flex flex-col items-center justify-center py-12 px-0">
              <div className="mb-6 rounded-full bg-secondary p-4">
                <UploadCloudIcon className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-lg font-medium mb-2">
                {file ? file.name : 'Drag & drop your resume here'}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
                Supported format: DOCX only (Max 5MB)
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-file-input"
                />
                <Button variant="outline" onClick={handleBrowseClick} type="button">
                  <FileIcon className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isUploading}
                  className="relative overflow-hidden"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      {file ? 'Upload Resume' : 'Select a File'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {file && (
          <div className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
            Selected file: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;
