import PostCard from '../components/PostCard';
import { Post } from '../models/Post';
import './FeedView.css';

const MOCK_POSTS: Post[] = [
    {
        id: 'post-1',
        author: {
            username: 'thepeakbrand',
            avatarUrl: ''
        },
        // Using unspalsh fitness placeholder
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
        likes: 12450,
        caption: 'Push your limits. The new collection is dropping soon.',
        overlayType: 'diagonal-green',
        overlayText: <span>READY<br />TO REACH<br />HIGHER?</span>
    },
    {
        id: 'post-2',
        author: {
            username: 'thepeakbrand',
            avatarUrl: ''
        },
        imageUrl: 'https://images.unsplash.com/photo-1556816723-1ce827b9ef96?q=80&w=1000&auto=format&fit=crop',
        likes: 8900,
        caption: 'Elevate your everyday. Link in bio to shop.',
        overlayType: 'bottom-gradient',
        overlayText: <><span className="highlight">/NEW/</span> HEIGHTS. <span className="highlight">/NEW/</span> GEAR</>
    },
    {
        id: 'post-3',
        author: {
            username: 'thepeakbrand',
            avatarUrl: ''
        },
        imageUrl: 'https://images.unsplash.com/photo-1552674605-171ff53544cb?q=80&w=1000&auto=format&fit=crop',
        likes: 21304,
        caption: 'Celebrate the wins. You earned it.',
        overlayType: 'diagonal-white',
        overlayText: <>YOUR<br />JOURNEY<br />INSPIRES<br />OURS</>
    }
];

export default function FeedView() {
    return (
        <div className="feed-view-container">
            <div className="feed-list">
                {MOCK_POSTS.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
