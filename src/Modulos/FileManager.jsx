import React, { useState } from 'react';
import FileUpload from './Subida/M_Subida';
import FileViewer from './Visualizacion/M_Visualizacion';
import { FiUpload, FiFolder } from 'react-icons/fi';
import './FileManager.css';

const FileManager = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="file-manager">
      <div className="manager-header">
        <h1>Gestor de Archivos PrintFlow</h1>
        <p>Sube y gestiona tus archivos de manera fácil y segura</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <FiUpload />
          Subir Archivos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          <FiFolder />
          Ver Archivos
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' && <FileUpload />}
        {activeTab === 'view' && <FileViewer />}
      </div>
    </div>
  );
};

export default FileManager; 