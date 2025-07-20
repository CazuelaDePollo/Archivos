import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import './M_Subida.css';
import { v4 as uuidv4 } from 'uuid';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Configuración de la zona de drop
  const onDrop = useCallback((archivosdropeados) => {
    const nuevosarchivos = archivosdropeados.map(file => ({
      file,
      id: uuidv4(),
      status: 'pending' // pending, uploading, success, error
    }));
    
    setFiles(prev => [...prev, ...nuevosarchivos]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  // Función para eliminar un archivo
  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Función para subir archivos
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    
    for (const archivo of files) {
      if (archivo.status === 'pending') {
        try {
          // Marcar como subiendo
          setFiles(prev => prev.map(f => 
            f.id === archivo.id ? { ...f, status: 'uploading' } : f
          ));

          // Simular progreso de subida
          setUploadProgress(prev => ({ ...prev, [archivo.id]: 0 }));
          
          // Aquí iría la lógica real de subida
          // Por ahora simulamos con un timeout
          await new Promise(resolve => {
            const interval = setInterval(() => {
              setUploadProgress(prev => {
                const newProgress = prev[archivo.id] + 10;
                if (newProgress >= 100) {
                  clearInterval(interval);
                  resolve();
                }
                return { ...prev, [archivo.id]: newProgress };
              });
            }, 200);
          });

          // Marcar como exitoso
          setFiles(prev => prev.map(f => 
            f.id === archivo.id ? { ...f, status: 'success' } : f
          ));

        } catch (error) {
          console.error('Error uploading file:', error);
          setFiles(prev => prev.map(f => 
            f.id === archivo.id ? { ...f, status: 'error' } : f
          ));
        }
      }
    }
    
    setUploading(false);
  };

  return (
    <div className="file-upload-container">
      <h2>Subir Archivos</h2>
      
      {/* Zona de drop */}
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <FiUpload className="upload-icon" />
        <p>
          {isDragActive 
            ? 'Suelta los archivos aquí...' 
            : 'Arrastra archivos aquí o haz clic para seleccionar'
          }
        </p>
        <small>Formatos soportados: JPG, PNG, PDF, TXT, DOC, DOCX</small>
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="files-list">
          <h3>Archivos seleccionados ({files.length})</h3>
          {files.map((fileObj) => (
            <div key={fileObj.id} className={`file-item ${fileObj.status}`}>
              <div className="file-info">
                <FiFile className="file-icon" />
                <div className="file-details">
                  <span className="file-name">{fileObj.file.name}</span>
                  <span className="file-size">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              
              <div className="file-actions">
                {fileObj.status === 'pending' && (
                  <button 
                    onClick={() => removeFile(fileObj.id)}
                    className="remove-btn"
                  >
                    <FiX />
                  </button>
                )}
                
                {fileObj.status === 'uploading' && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress[fileObj.id] || 0}%` }}
                    ></div>
                  </div>
                )}
                
                {fileObj.status === 'success' && (
                  <FiCheck className="success-icon" />
                )}
                
                {fileObj.status === 'error' && (
                  <span className="error-text">Error</span>
                )}
              </div>
            </div>
          ))}
          
          <button 
            onClick={uploadFiles}
            disabled={uploading || files.every(f => f.status !== 'pending')}
            className="upload-btn"
          >
            {uploading ? 'Subiendo...' : 'Subir Archivos'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 