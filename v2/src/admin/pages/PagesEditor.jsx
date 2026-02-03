import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import AdminLayout from '../AdminLayout';
import RichTextEditor from '../../components/admin/RichTextEditor';
import '../admin.css';

function PagesEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        description: '',
        content: '',
        meta_title: '',
        meta_desc: '',
        meta_keywords: '',
        active: 1
    });

    useEffect(() => {
        if (id) {
            loadPage();
        } else {
            setLoading(false);
        }
    }, [id]);

    const loadPage = async () => {
        try {
            const response = await fetch(`http://localhost:8000/pages.php?id=${id}`);
            const data = await response.json();
            if (data.success) {
                setFormData(data.data);
            }
        } catch (error) {
            setMessage('Failed to load page: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        
        try {
            const url = id 
                ? `http://localhost:8000/pages.php`
                : `http://localhost:8000/pages.php`;
            
            const method = id ? 'PUT' : 'POST';
            const body = id ? { ...formData, id } : formData;
            
            const token = localStorage.getItem('egc_token');
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            
            if (data.success) {
                setMessage('Page saved successfully!');
                setTimeout(() => navigate('/admin/pages'), 1500);
            } else {
                setMessage('Error: ' + (data.error || 'Failed to save'));
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <AdminLayout><div className="loading">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-header">
                    <h1>{id ? 'Edit Page' : 'New Page'}</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate('/admin/pages')} className="btn-cancel">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn-save">
                            {saving ? 'Saving...' : 'Save Page'}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <div className="editor-container">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Slug *</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                placeholder="homepage"
                            />
                        </div>

                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Page Title"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows="3"
                                placeholder="Short description of the page"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Content (HTML)</label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(value) => handleChange('content', value)}
                                height={400}
                            />
                        </div>

                        <div className="form-group">
                            <label>Meta Title</label>
                            <input
                                type="text"
                                value={formData.meta_title}
                                onChange={(e) => handleChange('meta_title', e.target.value)}
                                placeholder="SEO Title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Meta Keywords</label>
                            <input
                                type="text"
                                value={formData.meta_keywords}
                                onChange={(e) => handleChange('meta_keywords', e.target.value)}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Meta Description</label>
                            <textarea
                                value={formData.meta_desc}
                                onChange={(e) => handleChange('meta_desc', e.target.value)}
                                rows="2"
                                placeholder="SEO description"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.active === 1}
                                    onChange={(e) => handleChange('active', e.target.checked ? 1 : 0)}
                                />
                                {' '}Active
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default PagesEditor;
