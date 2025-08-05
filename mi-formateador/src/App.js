import React, { useState } from 'react';

const App = () => {
    // Definimos el estado para manejar los archivos, mensajes y resultados.
    const [uploadedFile, setUploadedFile] = useState(null);
    const [formatText, setFormatText] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [htmlPreview, setHtmlPreview] = useState('');
    const [docxBase64, setDocxBase64] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // URL del backend en Render
    const API_URL = 'https://formateador-de-web-app.onrender.com/process-document';

    // Maneja la selección del archivo.
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.docx')) {
            setUploadedFile(file);
            setStatusMessage('');
            setIsError(false);
            setIsSuccess(false);
            setHtmlPreview('');
            setDocxBase64('');
        } else {
            setUploadedFile(null);
            setStatusMessage('Por favor, selecciona un archivo .docx válido.');
            setIsError(true);
            setIsSuccess(false);
        }
    };

    // Maneja el clic en el botón de procesamiento.
    const handleProcessClick = async () => {
        if (!uploadedFile) {
            setStatusMessage('Por favor, sube un archivo .docx primero.');
            setIsError(true);
            return;
        }

        setIsProcessing(true);
        setStatusMessage('Procesando, por favor espera...');
        setIsError(false);
        setIsSuccess(false);
        setHtmlPreview('');
        setDocxBase64('');

        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('format_text', formatText);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error desconocido del servidor.');
            }

            const result = await response.json();
            
            setHtmlPreview(result.html_content);
            setDocxBase64(result.docx_base64);
            setStatusMessage('¡Procesamiento completado!');
            setIsSuccess(true);
        } catch (error) {
            setStatusMessage(`Error: ${error.message}`);
            setIsError(true);
        } finally {
            setIsProcessing(false);
        }
    };

    // Maneja el clic en el botón de descarga.
    const handleDownloadClick = () => {
        if (!docxBase64) {
            setStatusMessage('No hay documento para descargar.');
            setIsError(true);
            return;
        }

        try {
            const byteCharacters = atob(docxBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'documento_corregido.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
            setStatusMessage('¡Descarga iniciada! Revisa tu carpeta de descargas.');
            setIsSuccess(true);
        } catch (error) {
            setStatusMessage(`Error al descargar el archivo: ${error.message}`);
            setIsError(true);
        }
    };

    // Estilos CSS-in-JS
    const styles = {
        mainContainer: {
            backgroundColor: '#111827',
            color: '#e5e7eb',
            padding: '2rem',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardContainer: {
            backgroundColor: '#1f2937',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            maxWidth: '48rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        },
        headerTitle: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        uploadSection: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
        },
        fileInputLabel: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            transition: 'background-color 0.3s',
        },
        fileInputLabelHover: {
            backgroundColor: '#2563eb',
        },
        fileInput: {
            display: 'none',
        },
        fileName: {
            fontStyle: 'italic',
            color: '#9ca3af',
        },
        textareaSection: {
            width: '100%',
        },
        textareaLabel: {
            display: 'block',
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
        },
        textarea: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#374151',
            borderRadius: '0.5rem',
            color: '#e5e7eb',
            outline: 'none',
            resize: 'vertical',
            border: '2px solid transparent',
            transition: 'border-color 0.2s',
        },
        button: {
            width: '100%',
            maxWidth: '50%',
            padding: '1rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, transform 0.3s',
        },
        processButton: {
            backgroundColor: '#10b981',
            color: 'white',
        },
        processButtonHover: {
            backgroundColor: '#059669',
            transform: 'scale(1.05)',
        },
        processButtonActive: {
            transform: 'scale(0.95)',
        },
        processButtonDisabled: {
            backgroundColor: '#4b5563',
            cursor: 'not-allowed',
            transform: 'none',
        },
        statusArea: {
            width: '100%',
            textAlign: 'center',
        },
        statusMessage: {
            fontSize: '1.125rem',
            fontWeight: '500',
            padding: '1rem',
            borderRadius: '0.5rem',
        },
        statusMessageError: {
            backgroundColor: '#b91c1c',
            color: '#fca5a5',
        },
        statusMessageSuccess: {
            backgroundColor: '#065f46',
            color: '#a7f3d0',
        },
        resultsArea: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        },
        resultsTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
        },
        previewContainer: {
            backgroundColor: '#1f2937',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            maxHeight: '50vh',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.5',
        },
        downloadButton: {
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '1rem 2.5rem',
        },
        downloadButtonHover: {
            backgroundColor: '#2563eb',
        },
        downloadButtonActive: {
            transform: 'scale(0.95)',
        },
        icon: {
            width: '1.5rem',
            height: '1.5rem',
            marginRight: '0.5rem',
            display: 'inline-block',
            verticalAlign: 'middle',
        },
        iconSpinner: {
            animation: 'spin 1s linear infinite',
        },
        '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
        },
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.cardContainer}>
                <div style={styles.header}>
                    <svg style={{width: '2.5rem', height: '2.5rem', color: '#3b82f6'}} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM12 11V13H8V11H12ZM16 15V17H8V15H16Z"/>
                    </svg>
                    <h1 style={styles.headerTitle}>Procesador de Documentos Word</h1>
                </div>

                <div style={styles.uploadSection}>
                    <label htmlFor="file-upload" style={styles.fileInputLabel}>
                        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Elegir Archivo .docx
                    </label>
                    <input id="file-upload" type="file" style={styles.fileInput} accept=".docx" onChange={handleFileChange} />
                    <span style={styles.fileName}>{uploadedFile ? uploadedFile.name : 'Ningún archivo seleccionado'}</span>
                </div>

                <div style={styles.textareaSection}>
                    <label htmlFor="format-text" style={styles.textareaLabel}>Ingresa el texto a remover (opcional):</label>
                    <textarea 
                        id="format-text" 
                        style={styles.textarea} 
                        rows="3" 
                        placeholder="Ej: Escribe 'Confidencial' para remover todos los párrafos que contengan esa palabra."
                        value={formatText}
                        onChange={(e) => setFormatText(e.target.value)}
                    ></textarea>
                </div>

                <button 
                    onClick={handleProcessClick}
                    style={{
                        ...styles.button,
                        ...styles.processButton,
                        ...(isProcessing ? styles.processButtonDisabled : styles.processButtonHover)
                    }}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <svg style={{...styles.icon, ...styles.iconSpinner}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path>
                            </svg>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2L14 9l-7 7-5 5L2 19l5-5 7-7 7-7z"></path>
                            </svg>
                            Procesar Documento
                        </>
                    )}
                </button>

                {statusMessage && (
                    <div style={styles.statusArea}>
                        <p style={{
                            ...styles.statusMessage,
                            ...(isError ? styles.statusMessageError : isSuccess ? styles.statusMessageSuccess : {})
                        }}>
                            {isError && (
                                <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            )}
                            {isSuccess && (
                                <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.66"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            )}
                            {statusMessage}
                        </p>
                    </div>
                )}
                
                {htmlPreview && (
                    <div style={styles.resultsArea}>
                        <div>
                            <h2 style={styles.resultsTitle}>Previsualización del Documento Procesado</h2>
                            <div style={styles.previewContainer}>
                                <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
                            </div>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <button 
                                onClick={handleDownloadClick}
                                style={{...styles.button, ...styles.downloadButton}}
                            >
                                <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Descargar Documento Procesado
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
