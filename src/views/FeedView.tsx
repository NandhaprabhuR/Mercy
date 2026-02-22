import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import type { Post } from '../models/Post';
import './FeedView.css';

export default function FeedView() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/posts`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch posts', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="feed-loading">Loading Peak Feed...</div>;
    }

    return (
        <div className="feed-view-container">
            <div className="feed-list">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
