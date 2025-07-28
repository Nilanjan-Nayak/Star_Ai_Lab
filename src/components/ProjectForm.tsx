import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { X, Upload, Plus, Minus, Image, Link, Tag, Calendar, Star, Save, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
  project?: any;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose }) => {
  const { createProject, updateProject, loading } = useContext(ProjectContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'AI/ML',
    status: 'In Progress',
    technologies: [''],
    tags: [''],
    githubUrl: '',
    liveUrl: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        shortDescription: project.shortDescription || '',
        category: project.category || 'AI/ML',
        status: project.status || 'In Progress',
        technologies: project.technologies?.length ? project.technologies : [''],
        tags: project.tags?.length ? project.tags : [''],
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured || false
      });
      
      if (project.imageUrl) {
        setImagePreview(project.imageUrl.startsWith('http') ? project.imageUrl : `http://localhost:5000${project.imageUrl}`);
      }
    }
  }, [project]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Detailed description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid demo URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field: 'technologies' | 'tags', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'technologies' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'technologies' | 'tags', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const projectData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'technologies' || key === 'tags') {
          projectData.append(key, JSON.stringify((value as string[]).filter(item => item.trim())));
        } else {
          projectData.append(key, value.toString());
        }
      });
      
      // Add image if selected
      if (imageFile) {
        projectData.append('image', imageFile);
      }
      
      if (project) {
        await updateProject(project._id, projectData);
      } else {
        await createProject(projectData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      setErrors({ submit: 'Failed to save project. Please try again.' });
    }
  };

  const categories = ['AI/ML', 'Web Development', 'Mobile App', 'Data Science', 'IoT', 'Blockchain', 'Other'];
  const statuses = ['Planning', 'In Progress', 'On Hold', 'Completed'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                {project ? <Save className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {project ? 'Edit Project' : 'Create New Project'}
                </h3>
                <p className="text-sm text-gray-600">
                  {project ? 'Update your project details' : 'Add a new project to your portfolio'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Close form"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="h-4 w-4 mr-2" />
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter an engaging project title"
                  maxLength={100}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
              </div>

              {/* Short Description */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.shortDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Brief description for project cards (shown on main page)"
                  maxLength={200}
                />
                {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
                <p className="mt-1 text-xs text-gray-500">{formData.shortDescription.length}/200 characters</p>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Link className="h-4 w-4 mr-2" />
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.githubUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="https://github.com/username/repository"
                  />
                  {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Link className="h-4 w-4 mr-2" />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.liveUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="https://your-project-demo.com"
                  />
                  {errors.liveUrl && <p className="mt-1 text-sm text-red-600">{errors.liveUrl}</p>}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
                />
                <label className="ml-3 flex items-center text-sm font-medium text-yellow-800">
                  <Star className="h-4 w-4 mr-2" />
                  Featured Project
                  <span className="ml-2 text-xs text-yellow-600">(Highlighted on main page)</span>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Image className="h-4 w-4 mr-2" />
                  Project Image
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : errors.image 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-40 w-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technologies Used
                </label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., React, Python, TensorFlow"
                    />
                    {formData.technologies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('technologies', index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('technologies')}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Technology
                </button>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Tags
                </label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., machine-learning, web-app, mobile"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('tags', index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('tags')}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Provide a comprehensive description of the project, its goals, challenges solved, and key achievements..."
              maxLength={1000}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/1000 characters</p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {project ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;