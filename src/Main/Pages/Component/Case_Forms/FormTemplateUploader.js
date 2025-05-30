import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ApiEndPoint } from '../utils/utlis';

const FormTemplateUploader = () => {
    const [formName, setFormName] = useState('');
    const [documents, setDocuments] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [showFormCard, setShowFormCard] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    // Fetch existing templates
    useEffect(() => {
        fetchTemplates();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTemplates, setFilteredTemplates] = useState([]);

    // Add this useEffect to filter templates whenever searchQuery or templates change
    useEffect(() => {
        if (searchQuery) {
            const filtered = templates.filter(template =>
                template.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.documents.some(doc =>
                    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            setFilteredTemplates(filtered);
        } else {
            setFilteredTemplates(templates);
        }
    }, [searchQuery, templates]);

    const handleAddClick = () => {
        setShowFormCard(true);
    };


    const fetchSignedUrl = async (filePath) => {
        try {
            console.log(filePath)
            const response = await fetch(`${ApiEndPoint}/downloadFileByUrl/${encodeURIComponent(filePath)}`);
            const data = await response.json();

            console.log("data=", data)
            if (response.ok) {
                window.open(data.url, '_blank'); // <-- Open in new tab
                // return data.signedUrl;
                return data.url;
            } else {
                throw new Error(data.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching signed URL:", err);
            return null;
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(`${ApiEndPoint}form-templates`);
            setTemplates(response.data);
        } catch (err) {
            console.error('Error fetching templates:', err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!formName || documents.length === 0) return alert('Please enter form name and select files.');

        const formData = new FormData();
        formData.append('formName', formName);
        for (let i = 0; i < documents.length; i++) {
            formData.append('files', documents[i]);
        }

        try {
            await axios.post(`${ApiEndPoint}AddFormTemplete`, formData);
            setFormName('');
            setShowFormCard(false);
            setDocuments([]);
            fetchTemplates(); // refresh list
        } catch (err) {
            console.error('Error uploading:', err);
            alert('Failed to upload form template');
        }
    };

    //   const filteredTemplates = templates.filter(template =>
    //         template.formName.toLowerCase().includes(searchQuery.toLowerCase())
    //     );

    return (
        <div
            className="p-0 m-0 d-flex position-relative"
            style={{
                minHeight: "300px",
                height: "85vh",
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div className="container-fluid h-100 p-2 p-md-3 d-flex flex-column">
                {/* Add Button - Always visible at the top */}
                <div className="mb-2 mb-md-3">
                    <button
                        onClick={handleAddClick}
                        className="btn btn-sm btn-md-lg"
                        style={{ backgroundColor: '#18273e', color: 'white' }}
                        disabled={showFormCard || isLoading}
                    >
                        <i className="fas fa-plus me-1 me-md-2"></i>
                        <span className="d-none d-sm-inline">Add New Template</span>
                        <span className="d-inline d-sm-none">Add</span>
                    </button>
                </div>

                <div className="row flex-grow-1 g-2" style={{ overflow: 'hidden' }}>
                    {/* Upload Form Card - Only shows when showFormCard is true */}
                    {showFormCard && (
                        <div className="col-12 col-md-6 col-lg-4 h-100 d-flex flex-column">
                            <div className="card h-100" style={{ minHeight: '300px' }}>
                                <div className="card-header text-white d-flex justify-content-between align-items-center py-2 px-2 px-md-3"
                                    style={{ backgroundColor: '#18273e' }}>
                                    <h4 className="mb-0 fs-6 fs-md-5 fs-lg-4">Create Form Template</h4>
                                    <button
                                        className="btn btn-sm btn-light"
                                        onClick={() => setShowFormCard(false)}
                                        disabled={isLoading}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="card-body d-flex flex-column p-2 p-md-3">
                                    {isLoading ? (
                                        <div className="d-flex justify-content-center align-items-center h-100">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpload} encType="multipart/form-data" className="d-flex flex-column h-100">
                                            <div className="mb-2 mb-md-3">
                                                <label className="form-label small small-md">Form Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={formName}
                                                    onChange={(e) => setFormName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2 mb-md-3">
                                                <label className="form-label small small-md">Document Files</label>
                                                <input
                                                    type="file"
                                                    className="form-control form-control-sm"
                                                    multiple
                                                    onChange={(e) => setDocuments(e.target.files)}
                                                    required
                                                />
                                            </div>
                                            <div className="mt-auto pt-2">
                                                <button type="submit" className="btn btn-primary btn-sm w-100" disabled={isLoading}>
                                                    {isLoading ? 'Uploading...' : 'Upload'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Display Card - Always visible, adjusts width */}
                    <div
                        className={`d-flex flex-column ${showFormCard ? 'col-12 col-md-6 col-lg-8' : 'col-12'} h-100`}
                    >
                        <div className="card h-100 shadow-sm rounded-3">
                            {/* Header */}
                            <div
                                className="card-header text-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 gap-md-0 py-2 px-2 px-md-3"
                                style={{ backgroundColor: '#18273e' }}
                            >
                                <h4 className="mb-0 fs-6 fs-md-5 fs-lg-4">Uploaded Form Templates</h4>

                                {/* Search Box */}
                                <div className="search-box w-100 w-md-auto">
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search..."
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <button className="btn btn-outline-light" type="button" disabled={isLoading}>
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div
                                className="card-body px-1 px-md-3 py-2 py-md-3"
                                style={{ overflowY: 'auto', height: 'calc(100% - 56px)' }}
                            >
                                {isLoading && templates.length === 0 ? (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : filteredTemplates.length > 0 ? (
                                    <ul className="list-group">
                                        {filteredTemplates.map((template) => (
                                            <li
                                                key={template._id}
                                                className="list-group-item mb-2 mb-md-3 p-2 p-md-3 border border-light-subtle rounded-2"
                                            >
                                                <div className="d-flex flex-column flex-md-row justify-content-between">
                                                    <strong className="fs-6 fs-md-5 text-break">{template.formName}</strong>
                                                    <small className="text-muted mt-1 mt-md-0">
                                                        {new Date(template.createdAt).toLocaleString()}
                                                    </small>
                                                </div>

                                                <ul className="mt-2 ps-3 mb-0">
                                                    {template.documents.map((doc, idx) => (
                                                        <li key={idx} className="mb-1 small text-break">
                                                            <a
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    fetchSignedUrl(doc.path)
                                                                        .then(url => {
                                                                            window.open(url, '_blank', 'noopener,noreferrer');
                                                                        })
                                                                        .catch(error => {
                                                                            console.error('Error fetching signed URL:', error);
                                                                            // Optionally show an error message to the user
                                                                        });
                                                                }}
                                                                className="text-decoration-none text-primary"
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    textDecoration: 'underline',
                                                                    transition: 'color 0.2s',
                                                                    ':hover': {
                                                                        color: '#0056b3',
                                                                        textDecoration: 'underline'
                                                                    }
                                                                }}
                                                            >
                                                                <span className="fw-semibold">{doc.name}</span> <span className="text-muted">({doc.type})</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted small text-center mt-3">
                                        {searchQuery ? 'No matching templates found' : 'No form templates uploaded yet.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default FormTemplateUploader;
