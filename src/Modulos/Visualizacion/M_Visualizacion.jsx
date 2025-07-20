import React, { useState, useEffect } from 'react';
import { FiFile, FiImage, FiFileText, FiDownload, FiTrash2, FiEye } from 'react-icons/fi';
import './M_Visualizacion.css';

const FileViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [filterType, setFilterType] = useState('all');

  // Simular datos de archivos (en un proyecto real vendrían del servidor)
  useEffect(() => {
    const mockFiles = [
      {
        id: 1,
        name: 'documento.pdf',
        type: 'pdf',
        size: 2048576,
        uploadDate: '2024-01-15',
        url: '#',
        thumbnail: null
      },
      {
        id: 2,
        name: 'imagen.jpg',
        type: 'image',
        size: 1048576,
        uploadDate: '2024-01-14',
        url: '#',
        thumbnail: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: 'texto.txt',
        type: 'text',
        size: 512000,
        uploadDate: '2024-01-13',
        url: '#',
        thumbnail: null
      }
    ];
    setFiles(mockFiles);
  }, []);

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <FiImage className="file-icon" />;
      case 'pdf':
      case 'text':
        return <FiFileText className="file-icon" />;
      default:
        return <FiFile className="file-icon" />;
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para filtrar archivos
  const filteredFiles = files.filter(file => {
    if (filterType === 'all') return true;
    return file.type === filterType;
  });

  // Función para eliminar archivo
  const deleteFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile(null);
    }
  };

  // Función para descargar archivo
  const downloadFile = (file) => {
    // Aquí iría la lógica real de descarga
    console.log('Descargando:', file.name);
  };

  return (
    <div className="file-viewer-container">
      <div className="viewer-header">
        <h2>Visualizador de Archivos</h2>
        
        <div className="viewer-controls">
          <div className="filter-controls">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los archivos</option>
              <option value="image">Imágenes</option>
              <option value="pdf">PDFs</option>
              <option value="text">Textos</option>
            </select>
          </div>
          
          <div className="view-mode-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      <div className="files-container">
        {filteredFiles.length === 0 ? (
          <div className="no-files">
            <FiFile className="no-files-icon" />
            <p>No hay archivos para mostrar</p>
          </div>
        ) : (
          <div className={`files-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {filteredFiles.map((file) => (
              <div 
                key={file.id} 
                className={`file-card ${viewMode === 'list' ? 'list-item' : ''}`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="file-preview">
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="file-thumbnail" />
                  ) : (
                    <div className="file-icon-container">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                
                <div className="file-info">
                  <h4 className="file-name">{file.name}</h4>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                  <p className="file-date">{file.uploadDate}</p>
                </div>
                
                <div className="file-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(file);
                    }}
                    className="action-btn download-btn"
                    title="Descargar"
                  >
                    <FiDownload />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="action-btn delete-btn"
                    title="Eliminar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de vista previa */}
      {selectedFile && (
        <div className="preview-modal" onClick={() => setSelectedFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedFile.name}</h3>
              <button 
                onClick={() => setSelectedFile(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {selectedFile.type === 'image' && selectedFile.thumbnail ? (
                <img src={selectedFile.thumbnail} alt={selectedFile.name} />
              ) : (
                <div className="file-preview-placeholder">
                  {getFileIcon(selectedFile.type)}
                  <p>Vista previa no disponible</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => downloadFile(selectedFile)}
                className="download-btn"
              >
                <FiDownload /> Descargar
              </button>
              <button 
                onClick={() => deleteFile(selectedFile.id)}
                className="delete-btn"
              >
                <FiTrash2 /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileViewer; 