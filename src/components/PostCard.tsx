import React from 'react';
import type { Post } from '../models/Post';
import './PostCard.css';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-author-info">
                    <div className="post-avatar">
                        {/* If we have an avatar, use it. Otherwise placeholder */}
                        {post.author.avatarUrl ? (
                            <img src={post.author.avatarUrl} alt={post.author.username} />
                        ) : (
                            <div className="avatar-placeholder">peak</div>
                        )}
                    </div>
                    <span className="post-username brand-font">{post.author.username}</span>
                </div>
                <button className="post-options-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="12" r="2" fill="var(--text-dark)" />
                        <circle cx="12" cy="12" r="2" fill="var(--text-dark)" />
                        <circle cx="19" cy="12" r="2" fill="var(--text-dark)" />
                    </svg>
                </button>
            </div>

            <div className="post-media-container">
                <img src={post.imageUrl} alt={post.caption} className="post-image" />

                {/* Thematic Overlays based on the reference UI */}
                {(post.overlayTextLine1 || post.overlayType === 'bottom-gradient') && (
                    <div className={`post-overlay overlay-${post.overlayType}`}>
                        <div className="overlay-content brand-font">
                            {post.overlayType === 'bottom-gradient' ? (
                                <><span className="highlight">/NEW/</span> HEIGHTS. <span className="highlight">/NEW/</span> GEAR</>
                            ) : (
                                <>
                                    {post.overlayTextLine1 && <span>{post.overlayTextLine1}</span>}
                                    {post.overlayTextLine2 && <span>{post.overlayTextLine2}</span>}
                                    {post.overlayTextLine3 && <span>{post.overlayTextLine3}</span>}
                                    {post.overlayTextLine4 && <span>{post.overlayTextLine4}</span>}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="post-footer">
                <div className="post-actions">
                    <button className="action-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    <button className="action-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                    <button className="action-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
                <div className="post-likes">
                    <strong>{post.likes.toLocaleString()} likes</strong>
                </div>
                <div className="post-caption">
                    <strong>{post.author.username}</strong> {post.caption}
                </div>
            </div>
        </div>
    );
}
