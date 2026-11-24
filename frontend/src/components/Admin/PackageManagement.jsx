import { useState, useEffect } from 'react';
import { packageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    durationDays: '',
    categories: '',
    inclusions: '',
    images: ''
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchPackages();
    }
  }, [isAdmin]);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getAll();
      setPackages(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        durationDays: parseInt(formData.durationDays),
        categories: formData.categories.split(',').map(c => c.trim()),
        inclusions: formData.inclusions.split(',').map(i => i.trim()),
        availableDates: availableDates.map(d => new Date(d)),
        images: formData.images.split(/[,\n]/).map(i => i.trim()).filter(i => i)
      };

      if (editingPackage) {
        await packageAPI.update(editingPackage._id, packageData);
      } else {
        await packageAPI.create(packageData);
      }

      setShowForm(false);
      setEditingPackage(null);
      resetForm();
      setAvailableDates([]);
      fetchPackages();
    } catch (err) {
      alert('Failed to save package');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      destination: pkg.destination,
      price: pkg.price.toString(),
      durationDays: pkg.durationDays.toString(),
      categories: pkg.categories?.join(', ') || '',
      inclusions: pkg.inclusions?.join(', ') || '',
      images: pkg.images?.join('\n') || ''
    });
    setAvailableDates(pkg.availableDates?.map(d => new Date(d).toISOString().split('T')[0]) || []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageAPI.delete(id);
        fetchPackages();
      } catch (err) {
        alert('Failed to delete package');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach(file => {
      uploadData.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:5001/api/packages/upload-images', {
        method: 'POST',
        body: uploadData
      });

      if (response.ok) {
        const data = await response.json();
        const currentImages = formData.images ? formData.images.split(/[,\n]/).filter(img => img.trim()) : [];
        const newImages = [...currentImages, ...data.images];
        setFormData(prev => ({ ...prev, images: newImages.join(',') }));
      } else {
        alert('Failed to upload images');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload images');
    }
  };

  const removeImage = (index) => {
    const images = formData.images.split(/[,\n]/).filter(img => img.trim());
    images.splice(index, 1);
    setFormData(prev => ({ ...prev, images: images.join(',') }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      destination: '',
      price: '',
      durationDays: '',
      categories: '',
      inclusions: '',
      images: ''
    });
    setSelectedDate('');
    setAvailableDates([]);
  };

  if (!isAdmin) {
    return <div style={{ padding: '2rem' }}>Access denied. Admin privileges required.</div>;
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Package Management</h1>
        <button
          onClick={() => { setShowForm(true); setEditingPackage(null); resetForm(); }}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add New Package
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                name="title"
                placeholder="Package Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ padding: '0.5rem' }}
              />
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
                style={{ padding: '0.5rem' }}
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                style={{ padding: '0.5rem' }}
              />
              <input
                type="number"
                name="durationDays"
                placeholder="Duration (days)"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                required
                style={{ padding: '0.5rem' }}
              />
            </div>
            <input
              type="text"
              name="categories"
              placeholder="Categories (comma separated)"
              value={formData.categories}
              onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <textarea
              placeholder="Inclusions (comma separated)"
              value={formData.inclusions}
              onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
              rows="2"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Available Dates</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="date"
                  name="datePicker"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDate && !availableDates.includes(selectedDate)) {
                      setAvailableDates([...availableDates, selectedDate]);
                      setSelectedDate('');
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add Date
                </button>
              </div>

              {availableDates.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Selected Dates:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {availableDates.map((date, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#e3f2fd',
                        color: '#1976d2',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem'
                      }}>
                        {new Date(date).toLocaleDateString()}
                        <button
                          type="button"
                          onClick={() => setAvailableDates(availableDates.filter((_, i) => i !== index))}
                          style={{
                            marginLeft: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#d32f2f',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Package Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ width: '100%', padding: '0.5rem', border: '2px dashed #ccc', borderRadius: '8px' }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>Select multiple images for the package (max 5 images, 5MB each)</p>
              {formData.images && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.images.split(/[,\n]/).filter(img => img.trim()).map((img, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={img.startsWith('http') ? img.trim() : `http://localhost:5001${img.trim()}`}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                {editingPackage ? 'Update' : 'Create'} Package
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingPackage(null); resetForm(); }}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {packages.map((pkg) => {
          console.log('Package images:', pkg.images); // Debug log
          return (
            <div key={pkg._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{pkg.title}</h3>
                  <p><strong>Destination:</strong> {pkg.destination}</p>
                  <p><strong>Price:</strong> ₹{pkg.price} | <strong>Duration:</strong> {pkg.durationDays} days</p>
                  <p><strong>Categories:</strong> {pkg.categories?.join(', ') || 'None'}</p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{pkg.description}</p>
                  {pkg.images && pkg.images.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <p><strong>Images:</strong></p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {pkg.images.slice(0, 3).map((img, index) => (
                          <img
                            key={index}
                            src={img.startsWith('/uploads') ? `http://localhost:5001${img}` : img}
                            alt={`Package ${index + 1}`}
                            style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                            onError={(e) => { e.target.style.border = '2px solid red'; console.log('Image error:', img); }}
                          />
                        ))}
                        {pkg.images.length > 3 && (
                          <div style={{ width: '60px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '4px', fontSize: '0.7rem', color: '#666' }}>
                            +{pkg.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(pkg)}
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};