import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import AdminLayout from '../AdminLayout';
import RichTextEditor from '../../components/admin/RichTextEditor';
import '../admin.css';

function ArticlesEditor() {
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
        body: '',
        image: '',
        image_alt: '',
        keywords: '',
        custom_css: '',
        published: 1,
        published_at: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (id && id !== 'new') {
            loadArticle();
        } else {
            setLoading(false);
        }
    }, [id]);

    const loadArticle = async () => {
        try {
            const response = await fetch(`http://localhost:8000/crud.php?t=articles&id=${id}`);
            const data = await response.json();
            if (data) {
                setFormData(data);
            }
        } catch (error) {
            setMessage('Failed to load article: ' + error.message);
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
            const token = localStorage.getItem('egc_token');
            const url = `http://localhost:8000/crud.php?t=articles${id && id !== 'new' ? `&id=${id}` : ''}`;
            const method = id && id !== 'new' ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success || data.id) {
                setMessage('Article saved successfully!');
                setTimeout(() => navigate('/admin/articles'), 1500);
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
                    <h1>{id && id !== 'new' ? 'Edit Article' : 'New Article'}</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate('/admin/articles')} className="btn-cancel">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn-save">
                            {saving ? 'Saving...' : 'Save Article'}
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
                                placeholder="article-slug"
                            />
                        </div>

                        <div className="form-group">
                            <label>Published Date</label>
                            <input
                                type="date"
                                value={formData.published_at}
                                onChange={(e) => handleChange('published_at', e.target.value)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Article Title"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows="3"
                                placeholder="Short description or excerpt"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Body (HTML)</label>
                            <RichTextEditor
                                value={formData.body}
                                onChange={(value) => handleChange('body', value)}
                                height={500}
                            />
                        </div>

                        <div className="form-group">
                            <label>Featured Image URL</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => handleChange('image', e.target.value)}
                                placeholder="/images/article.jpg"
                            />
                        </div>

                        <div className="form-group">
                            <label>Image Alt Text</label>
                            <input
                                type="text"
                                value={formData.image_alt}
                                onChange={(e) => handleChange('image_alt', e.target.value)}
                                placeholder="Description of image"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Keywords (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.keywords}
                                onChange={(e) => handleChange('keywords', e.target.value)}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Custom CSS (optional)</label>
                            <textarea
                                value={formData.custom_css}
                                onChange={(e) => handleChange('custom_css', e.target.value)}
                                rows="5"
                                placeholder=".article-content { /* custom styles */ }"
                                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.published === 1}
                                    onChange={(e) => handleChange('published', e.target.checked ? 1 : 0)}
                                />
                                {' '}Published
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ArticlesEditor;
