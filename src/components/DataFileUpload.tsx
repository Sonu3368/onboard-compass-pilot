import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadStatus {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface DataFileUploadProps {
  onFileUpload?: (fileType: string, file: File) => void;
}

export const DataFileUpload: React.FC<DataFileUploadProps> = ({ onFileUpload }) => {
  const [pgGmvFile, setPgGmvFile] = useState<FileUploadStatus>({ file: null, status: 'idle' });
  const [baseFile, setBaseFile] = useState<FileUploadStatus>({ file: null, status: 'idle' });
  const [trackerFile, setTrackerFile] = useState<FileUploadStatus>({ file: null, status: 'idle' });
  const { toast } = useToast();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    fileType: string,
    setter: React.Dispatch<React.SetStateAction<FileUploadStatus>>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file format
    const allowedFormats = ['.xlsx', '.csv', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedFormats.includes(fileExtension)) {
      setter({ file: null, status: 'error', error: 'Please upload XLSX, CSV, or XLS files only' });
      toast({
        title: 'Invalid File Format',
        description: 'Please upload XLSX, CSV, or XLS files only',
        variant: 'destructive',
      });
      return;
    }

    setter({ file, status: 'success' });
    onFileUpload?.(fileType, file);
    
    toast({
      title: 'File Selected',
      description: `${file.name} has been selected for ${fileType}`,
    });
  };

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const fileUploads = [
    {
      id: 'pg-gmv',
      title: 'PG GMV Data File',
      description: 'Upload Payment Gateway Gross Merchandise Volume data',
      state: pgGmvFile,
      setter: setPgGmvFile,
    },
    {
      id: 'base',
      title: 'Base File',
      description: 'Upload base merchant data file',
      state: baseFile,
      setter: setBaseFile,
    },
    {
      id: 'tracker',
      title: 'Tracker Updation File',
      description: 'Upload tracking and update information file',
      state: trackerFile,
      setter: setTrackerFile,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data File Upload</h2>
          <p className="text-gray-600">Upload your data files in XLSX, CSV, or XLS format</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Supported formats: XLSX, CSV, XLS
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fileUploads.map((upload) => (
          <Card key={upload.id} className={`transition-colors ${getStatusColor(upload.state.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(upload.state.status)}
                <CardTitle className="text-lg">{upload.title}</CardTitle>
              </div>
              <p className="text-sm text-gray-600">{upload.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={upload.id}>Select File</Label>
                <Input
                  id={upload.id}
                  type="file"
                  accept=".xlsx,.csv,.xls"
                  onChange={(e) => handleFileChange(e, upload.title, upload.setter)}
                  className="cursor-pointer"
                />
              </div>
              
              {upload.state.file && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{upload.state.file.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Size: {(upload.state.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              )}
              
              {upload.state.status === 'error' && upload.state.error && (
                <div className="text-sm text-red-600">
                  {upload.state.error}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">PG GMV Data</span>
              <Badge variant={pgGmvFile.file ? "default" : "secondary"}>
                {pgGmvFile.file ? "Ready" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Base File</span>
              <Badge variant={baseFile.file ? "default" : "secondary"}>
                {baseFile.file ? "Ready" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Tracker File</span>
              <Badge variant={trackerFile.file ? "default" : "secondary"}>
                {trackerFile.file ? "Ready" : "Pending"}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={() => {
                setPgGmvFile({ file: null, status: 'idle' });
                setBaseFile({ file: null, status: 'idle' });
                setTrackerFile({ file: null, status: 'idle' });
                // Reset file inputs
                const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
                inputs.forEach(input => input.value = '');
              }}
            >
              Clear All
            </Button>
            <Button 
              disabled={!pgGmvFile.file && !baseFile.file && !trackerFile.file}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Process Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};