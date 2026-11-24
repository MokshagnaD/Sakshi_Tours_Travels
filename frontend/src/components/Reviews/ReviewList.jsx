import { useState, useEffect } from 'react';
import { reviewAPI } from '../../services/api';

export const ReviewList = ({ packageId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = packageId 
          ? await reviewAPI.getByPackage(packageId)
          : await reviewAPI.getAll();
        setReviews(response.data);
      } catch (err) {
        console.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [packageId]);

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reviews.map((review) => (
            <div key={review._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>{review.user?.name || 'Anonymous'}</strong>
                <div>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p>{review.comment}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};