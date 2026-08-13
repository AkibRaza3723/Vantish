import React, { useState } from 'react';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { Image, Video, Calendar, FileText } from 'lucide-react';
import './Home.css';

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Anonymous 🦊',
    role: 'Software Engineer @ BigTech',
    time: '2h',
    content: 'Just had my 1-on-1. Manager said I need to "increase my visibility." I guess I\'ll start wearing neon green to the office? 🤷‍♂️',
    likes: 342,
    comments: 45,
    shares: 12,
    avatarEmoji: '🦊'
  },
  {
    id: 2,
    author: 'Secret Founder 🦄',
    role: 'CEO @ Stealth Startup',
    time: '5h',
    content: 'Unpopular opinion: If your startup depends on people working 80 hours a week for average pay, you don\'t have a viable business model. You have a cult.',
    likes: 8901,
    comments: 1205,
    shares: 432,
    avatarEmoji: '🦄'
  },
  {
    id: 3,
    author: 'Tired CS Student 🦉',
    role: 'CS Undergrad @ State Uni',
    time: '1d',
    content: 'Professor: "The exam will be exactly like the practice problems."\nThe Exam: Calculate the mass of the sun using only a linked list and a string of spaghetti.',
    likes: 1204,
    comments: 89,
    shares: 210,
    avatarEmoji: '🦉'
  }
];

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid-layout">
      <LeftSidebar />
      
      <div className="feed-column">
        <div className="card create-post-card">
          <div className="create-post-input-container">
            <div className="avatar" style={{ width: 48, height: 48, flexShrink: 0 }}>
              <span style={{ fontSize: 24 }}>👻</span>
            </div>
            <button 
              className="create-post-input"
              onClick={() => setIsModalOpen(true)}
            >
              Start a post
            </button>
          </div>
          
          <div className="create-post-actions">
            <button className="btn-action" onClick={() => setIsModalOpen(true)}>
              <Image size={24} color="#70B5F9" />
              <span className="text-secondary font-semibold">Media</span>
            </button>
            <button className="btn-action" onClick={() => setIsModalOpen(true)}>
              <Calendar size={24} color="#E7A33E" />
              <span className="text-secondary font-semibold">Event</span>
            </button>
            <button className="btn-action" onClick={() => setIsModalOpen(true)}>
              <FileText size={24} color="#F5987E" />
              <span className="text-secondary font-semibold">Write article</span>
            </button>
          </div>
        </div>

        <div className="feed-divider">
          <hr />
          <span className="text-secondary">Sort by: <strong>Top</strong></span>
        </div>

        <div className="feed-posts">
          {MOCK_POSTS.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      
      <RightSidebar />
      
      {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;
