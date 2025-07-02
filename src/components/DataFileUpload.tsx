import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface FileUploadStatus {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error' | 'saved';
  error?: string;
  data?: any[];
  recordCount?: number;
}

interface DataFileUploadProps {
  onFileUpload?: (fileType: string, file: File) => void;
}

export const DataFileUpload: React.FC<DataFileUploadProps> = ({ onFileUpload }) => {
  const [pgGmvFile, setPgGmvFile] = useState<FileUploadStatus>({ file: null, status: 'idle' });
  const [baseFile, setBaseFile] = useState<FileUploadStatus>({ file: null, status: 'idle' });
  const [trackerFile, setTrackerFile] = useState<FileUploadStatus>({ file: null, status: 'idle' });
  const { toast } = useToast();

  // Parse file data based on file type
  const parseFileData = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          let jsonData: any[] = [];
          
          if (file.name.toLowerCase().endsWith('.csv')) {
            // Parse CSV
            const text = data as string;
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
              resolve([]);
              return;
            }
            
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            jsonData = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              return obj;
            });
          } else {
            // Parse XLSX/XLS
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
          }
          
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  // Save data to localStorage
  const saveDataToStorage = (fileType: string, data: any[]) => {
    const storageKey = `uploaded_${fileType.toLowerCase().replace(/\s+/g, '_')}_data`;
    const dataWithTimestamp = {
      data,
      timestamp: new Date().toISOString(),
      recordCount: data.length
    };
    localStorage.setItem(storageKey, JSON.stringify(dataWithTimestamp));
    return storageKey;
  };

  const handleFileChange = async (
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

    // Set file and start parsing
    setter({ file, status: 'uploading' });
    
    try {
      const parsedData = await parseFileData(file);
      setter({ 
        file, 
        status: 'success', 
        data: parsedData,
        recordCount: parsedData.length
      });
      
      onFileUpload?.(fileType, file);
      
      toast({
        title: 'File Parsed Successfully',
        description: `${file.name} has been parsed with ${parsedData.length} records`,
      });
    } catch (error) {
      setter({ 
        file: null, 
        status: 'error', 
        error: 'Failed to parse file. Please check the file format.' 
      });
      
      toast({
        title: 'Parsing Error',
        description: 'Failed to parse the file. Please check the file format.',
        variant: 'destructive',
      });
    }
  };

  // Handle saving data
  const handleSaveData = (fileType: string, fileState: FileUploadStatus, setter: React.Dispatch<React.SetStateAction<FileUploadStatus>>) => {
    if (!fileState.data) return;
    
    try {
      const storageKey = saveDataToStorage(fileType, fileState.data);
      setter(prev => ({ ...prev, status: 'saved' }));
      
      toast({
        title: 'Data Saved Successfully',
        description: `${fileType} data has been saved locally with ${fileState.recordCount} records`,
      });
      
      console.log(`Saved ${fileType} data to ${storageKey}:`, fileState.data);
    } catch (error) {
      toast({
        title: 'Save Error',
        description: 'Failed to save data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'saved':
        return <Save className="w-5 h-5 text-blue-600" />;
      case 'uploading':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
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
      case 'saved':
        return 'bg-blue-50 border-blue-200';
      case 'uploading':
        return 'bg-yellow-50 border-yellow-200';
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
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{upload.state.file.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Size: {(upload.state.file.size / 1024 / 1024).toFixed(2)} MB</div>
                    {upload.state.recordCount && (
                      <div>Records: {upload.state.recordCount}</div>
                    )}
                  </div>
                  
                  {upload.state.status === 'success' && upload.state.data && (
                    <Button
                      size="sm"
                      onClick={() => handleSaveData(upload.title, upload.state, upload.setter)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Data
                    </Button>
                  )}
                  
                  {upload.state.status === 'saved' && (
                    <div className="text-sm text-blue-600 font-medium">
                      ✓ Data saved successfully
                    </div>
                  )}
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
              <div>
                <span className="text-sm font-medium">PG GMV Data</span>
                {pgGmvFile.recordCount && (
                  <div className="text-xs text-gray-500">{pgGmvFile.recordCount} records</div>
                )}
              </div>
              <Badge variant={pgGmvFile.status === 'saved' ? "default" : pgGmvFile.file ? "secondary" : "outline"}>
                {pgGmvFile.status === 'saved' ? "Saved" : pgGmvFile.file ? "Ready" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium">Base File</span>
                {baseFile.recordCount && (
                  <div className="text-xs text-gray-500">{baseFile.recordCount} records</div>
                )}
              </div>
              <Badge variant={baseFile.status === 'saved' ? "default" : baseFile.file ? "secondary" : "outline"}>
                {baseFile.status === 'saved' ? "Saved" : baseFile.file ? "Ready" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium">Tracker File</span>
                {trackerFile.recordCount && (
                  <div className="text-xs text-gray-500">{trackerFile.recordCount} records</div>
                )}
              </div>
              <Badge variant={trackerFile.status === 'saved' ? "default" : trackerFile.file ? "secondary" : "outline"}>
                {trackerFile.status === 'saved' ? "Saved" : trackerFile.file ? "Ready" : "Pending"}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {[pgGmvFile, baseFile, trackerFile].filter(f => f.status === 'saved').length > 0 && (
                <span>Data saved to browser storage</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setPgGmvFile({ file: null, status: 'idle' });
                  setBaseFile({ file: null, status: 'idle' });
                  setTrackerFile({ file: null, status: 'idle' });
                  // Reset file inputs
                  const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
                  inputs.forEach(input => input.value = '');
                  
                  // Clear localStorage
                  ['pg_gmv_data_file', 'base_file', 'tracker_updation_file'].forEach(key => {
                    localStorage.removeItem(`uploaded_${key}_data`);
                  });
                  
                  toast({
                    title: 'All Data Cleared',
                    description: 'All uploaded files and saved data have been cleared.',
                  });
                }}
              >
                Clear All
              </Button>
              <Button 
                disabled={![pgGmvFile, baseFile, trackerFile].some(f => f.status === 'saved')}
                onClick={() => {
                  const savedData = {
                    pgGmvData: pgGmvFile.status === 'saved' ? pgGmvFile.data : null,
                    baseData: baseFile.status === 'saved' ? baseFile.data : null,
                    trackerData: trackerFile.status === 'saved' ? trackerFile.data : null,
                  };
                  console.log('All saved data:', savedData);
                  
                  toast({
                    title: 'Data Processing Complete',
                    description: 'All saved data is ready for analysis and processing.',
                  });
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Process All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};