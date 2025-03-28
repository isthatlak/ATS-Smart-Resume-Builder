
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  PlusCircle, 
  Trash2, 
  ChevronRight, 
  GraduationCap, 
  Briefcase, 
  UserCircle, 
  Award, 
  Globe, 
  Code
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { FormData, WorkExperience, EducationItem } from '@/types';

interface ResumeFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onCompleted: () => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ 
  formData, 
  setFormData, 
  onCompleted 
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: value
      }
    });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      summary: e.target.value
    });
  };

  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  const handleAchievementChange = (expIndex: number, achIndex: number, value: string) => {
    const updatedExperience = [...formData.experience];
    const achievements = [...updatedExperience[expIndex].achievements];
    achievements[achIndex] = value;
    updatedExperience[expIndex] = {
      ...updatedExperience[expIndex],
      achievements
    };
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          id: uuidv4(),
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          achievements: ['']
        }
      ]
    });
  };

  const removeExperience = (index: number) => {
    if (formData.experience.length <= 1) return;
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  const addAchievement = (expIndex: number) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[expIndex] = {
      ...updatedExperience[expIndex],
      achievements: [...updatedExperience[expIndex].achievements, '']
    };
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    if (formData.experience[expIndex].achievements.length <= 1) return;
    const updatedExperience = [...formData.experience];
    const achievements = [...updatedExperience[expIndex].achievements];
    achievements.splice(achIndex, 1);
    updatedExperience[expIndex] = {
      ...updatedExperience[expIndex],
      achievements
    };
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  const handleEducationChange = (index: number, field: keyof EducationItem, value: string) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          id: uuidv4(),
          institution: '',
          degree: '',
          fieldOfStudy: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          achievements: []
        }
      ]
    });
  };

  const removeEducation = (index: number) => {
    if (formData.education.length <= 1) return;
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData({
      ...formData,
      skills: skillsArray
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleted();
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.personalInfo.firstName}
            onChange={handlePersonalInfoChange}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.personalInfo.lastName}
            onChange={handlePersonalInfoChange}
            placeholder="Doe"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.personalInfo.email}
          onChange={handlePersonalInfoChange}
          placeholder="john.doe@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.personalInfo.phone}
          onChange={handlePersonalInfoChange}
          placeholder="(123) 456-7890"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.personalInfo.location}
          onChange={handlePersonalInfoChange}
          placeholder="San Francisco, CA"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn (optional)</Label>
        <Input
          id="linkedin"
          name="linkedin"
          value={formData.personalInfo.linkedin || ''}
          onChange={handlePersonalInfoChange}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Personal Website (optional)</Label>
        <Input
          id="website"
          name="website"
          value={formData.personalInfo.website || ''}
          onChange={handlePersonalInfoChange}
          placeholder="johndoe.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary || ''}
          onChange={handleSummaryChange}
          placeholder="Briefly describe your professional background and key strengths..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderExperienceInfo = () => (
    <div className="space-y-8 animate-fade-in">
      {formData.experience.map((exp, index) => (
        <Card key={exp.id} className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
                Experience {index + 1}
              </CardTitle>
              {formData.experience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  placeholder="Google"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Title</Label>
                <Input
                  id={`title-${index}`}
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={exp.location || ''}
                  onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                  placeholder="Mountain View, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  placeholder="Jan 2020"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                  placeholder="Present"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Job Description</Label>
              <Textarea
                id={`description-${index}`}
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                placeholder="Describe your role and responsibilities..."
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Key Achievements</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addAchievement(index)}
                  className="h-8 text-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  Add Achievement
                </Button>
              </div>
              
              {exp.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, achIndex, e.target.value)}
                      placeholder="Describe a quantifiable achievement..."
                      required
                    />
                  </div>
                  {exp.achievements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAchievement(index, achIndex)}
                      className="h-8 w-8 text-destructive mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Another Experience
        </Button>
      </div>
    </div>
  );

  const renderEducationInfo = () => (
    <div className="space-y-8 animate-fade-in">
      {formData.education.map((edu, index) => (
        <Card key={edu.id} className="relative transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-muted-foreground" />
                Education {index + 1}
              </CardTitle>
              {formData.education.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="Harvard University"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                <Input
                  id={`fieldOfStudy-${index}`}
                  value={edu.fieldOfStudy || ''}
                  onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={edu.location || ''}
                  onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                  placeholder="Cambridge, MA"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                  placeholder="Sep 2018"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                  placeholder="May 2022"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`gpa-${index}`}>GPA (optional)</Label>
                <Input
                  id={`gpa-${index}`}
                  value={edu.gpa || ''}
                  onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Another Education
        </Button>
      </div>
    </div>
  );

  const renderSkillsInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Textarea
          id="skills"
          value={formData.skills.join(', ')}
          onChange={handleSkillsChange}
          placeholder="JavaScript, React, TypeScript, Node.js, Python..."
          rows={5}
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Enter your skills separated by commas
        </p>
      </div>
    </div>
  );

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'personal': return <UserCircle className="h-4 w-4" />;
      case 'experience': return <Briefcase className="h-4 w-4" />;
      case 'education': return <GraduationCap className="h-4 w-4" />;
      case 'skills': return <Code className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="w-full py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Create Your Resume</h2>
          <p className="text-muted-foreground">
            Fill in your details to generate an ATS-optimized resume
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-4 w-full max-w-xl">
                <TabsTrigger value="personal" className="flex items-center">
                  {getTabIcon('personal')}
                  <span className="ml-2 hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center">
                  {getTabIcon('experience')}
                  <span className="ml-2 hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center">
                  {getTabIcon('education')}
                  <span className="ml-2 hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center">
                  {getTabIcon('skills')}
                  <span className="ml-2 hidden sm:inline">Skills</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="personal" className="mt-0">
              {renderPersonalInfo()}
            </TabsContent>
            
            <TabsContent value="experience" className="mt-0">
              {renderExperienceInfo()}
            </TabsContent>
            
            <TabsContent value="education" className="mt-0">
              {renderEducationInfo()}
            </TabsContent>
            
            <TabsContent value="skills" className="mt-0">
              {renderSkillsInfo()}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (activeTab === 'experience') setActiveTab('personal');
                else if (activeTab === 'education') setActiveTab('experience');
                else if (activeTab === 'skills') setActiveTab('education');
              }}
              disabled={activeTab === 'personal'}
            >
              Previous
            </Button>
            
            <Button
              type={activeTab === 'skills' ? 'submit' : 'button'}
              onClick={() => {
                if (activeTab === 'personal') setActiveTab('experience');
                else if (activeTab === 'experience') setActiveTab('education');
                else if (activeTab === 'education') setActiveTab('skills');
              }}
            >
              {activeTab === 'skills' ? (
                'Generate Resume'
              ) : (
                <>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
