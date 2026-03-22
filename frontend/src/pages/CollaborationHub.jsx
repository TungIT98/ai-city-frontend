/**
 * Collaboration Hub
 * Shared dashboards, comments, reactions, @mentions, and team workspaces
 * Phase 10: Full reply threading, emoji reactions, @mentions, user presence
 */
import { useState, useEffect, useRef } from 'react';
import './CollaborationHub.css';

const EMOJIS = ['👍', '👎', '❤️', '🎉', '👀', '🚀'];

const TEAM_MEMBERS = [
  { id: 'minh.nguyen', name: 'Minh Nguyen', avatar: '👨‍💼', role: 'Manager', color: '#6366f1' },
  { id: 'lan.pham', name: 'Lan Pham', avatar: '👩‍🎨', role: 'Designer', color: '#8b5cf6' },
  { id: 'tu.nguyen', name: 'Tu Nguyen', avatar: '👨‍💻', role: 'Engineer', color: '#10b981' },
  { id: 'anh.ho', name: 'Anh Ho', avatar: '👩‍💼', role: 'CEO', color: '#ec4899' },
  { id: 'hung.tran', name: 'Hung Tran', avatar: '👨‍🔬', role: 'Analyst', color: '#f59e0b' },
  { id: 'thanh.nguyen', name: 'Thanh Nguyen', avatar: '👨‍💼', role: 'Agent', color: '#06b6d4' },
];

const ONLINE_MEMBERS = ['minh.nguyen', 'lan.pham', 'thanh.nguyen'];

export default function CollaborationHub() {
  const [activeTab, setActiveTab] = useState('dashboards');
  const [sharedDashboards, setSharedDashboards] = useState([]);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [activeReaction, setActiveReaction] = useState(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [reactions, setReactions] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '', visibility: 'team' });
  const [loading, setLoading] = useState(true);
  const commentInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setSharedDashboards([
        { id: 1, name: 'Q1 Sales Overview', description: 'Real-time sales metrics and pipeline', owner: 'minh.nguyen', visibility: 'team', sharedWith: ['hung.tran', 'lan.pham'], views: 234, lastViewed: '10 min ago', type: 'sales', color: '#6366f1' },
        { id: 2, name: 'Marketing Performance', description: 'Campaign ROI and lead attribution', owner: 'lan.pham', visibility: 'public', sharedWith: ['all'], views: 567, lastViewed: '1 hour ago', type: 'marketing', color: '#8b5cf6' },
        { id: 3, name: 'Engineering Health', description: 'API latency, error rates, uptime', owner: 'tu.nguyen', visibility: 'private', sharedWith: ['khoi.phan'], views: 89, lastViewed: '3 hours ago', type: 'engineering', color: '#10b981' },
        { id: 4, name: 'Customer Success', description: 'Churn risk, NPS, support tickets', owner: 'anh.ho', visibility: 'team', sharedWith: ['thanh.nguyen'], views: 156, lastViewed: '30 min ago', type: 'cs', color: '#f59e0b' },
      ]);
      setComments([
        { id: 1, target: 'Q1 Sales Overview', targetType: 'dashboard', user: 'hung.tran', avatar: '👨‍💼', content: '@minh.nguyen Should we add MRR breakdown by tier to this dashboard?', time: '2 hours ago', replies: [
          { id: 101, user: 'minh.nguyen', avatar: '👨‍💼', content: 'Good idea! Added to my list.', time: '1 hour ago', reactions: { '👍': 2 } }
        ], reactions: { '👍': 5, '🚀': 2 } },
        { id: 2, target: 'Q1 Sales Overview', targetType: 'dashboard', user: 'lan.pham', avatar: '👩‍🎨', content: 'The conversion funnel looks off — can we double check the data source?', time: '4 hours ago', replies: [], reactions: {} },
        { id: 3, target: 'Marketing Performance', targetType: 'dashboard', user: 'tu.nguyen', avatar: '👨‍💻', content: 'Facebook attribution data was delayed yesterday — might explain the dip.', time: '1 day ago', replies: [
          { id: 102, user: 'lan.pham', avatar: '👩‍🎨', content: 'Thanks for the heads up! Will update when data refreshes.', time: '20 hours ago', reactions: { '❤️': 1 } }
        ], reactions: { '👀': 3 } },
        { id: 4, target: 'MRR Dashboard', targetType: 'metric', user: 'anh.ho', avatar: '👩‍💼', content: '@minh.nguyen Can we add a trend comparison vs last quarter?', time: '30 min ago', replies: [], reactions: {} },
        { id: 5, target: 'Customer Success', targetType: 'dashboard', user: 'thanh.nguyen', avatar: '👨‍🔬', content: 'Churn rate improved 0.5% this week — great team effort!', time: '3 hours ago', replies: [
          { id: 103, user: 'anh.ho', avatar: '👩‍💼', content: 'Thank you! The proactive outreach is paying off.', time: '2 hours ago', reactions: { '🎉': 2 } }
        ], reactions: { '🎉': 4, '👍': 3 } },
      ]);
      setActivity([
        { id: 1, type: 'view', user: 'hung.tran', avatar: '👨‍💼', action: 'viewed', target: 'Q1 Sales Overview', time: '10 min ago' },
        { id: 2, type: 'comment', user: 'thanh.nguyen', avatar: '👨‍🔬', action: 'commented on', target: 'Customer Success', time: '3 hours ago' },
        { id: 3, type: 'share', user: 'lan.pham', avatar: '👩‍🎨', action: 'shared', target: 'Marketing Performance', time: '5 hours ago' },
        { id: 4, type: 'edit', user: 'minh.nguyen', avatar: '👨‍💼', action: 'edited', target: 'Q1 Sales Overview', time: '6 hours ago' },
        { id: 5, type: 'create', user: 'tu.nguyen', avatar: '👨‍💻', action: 'created', target: 'Engineering Health', time: '1 day ago' },
        { id: 6, type: 'view', user: 'anh.ho', avatar: '👩‍💼', action: 'viewed', target: 'Customer Success', time: '30 min ago' },
        { id: 7, type: 'comment', user: 'hung.tran', avatar: '👨‍💼', action: 'replied to comment on', target: 'Q1 Sales Overview', time: '1 hour ago' },
      ]);
      setWorkspaces([
        { id: 1, name: 'Sales Team', members: 8, dashboards: 3, color: '#6366f1' },
        { id: 2, name: 'Marketing Team', members: 5, dashboards: 2, color: '#8b5cf6' },
        { id: 3, name: 'Engineering', members: 4, dashboards: 1, color: '#10b981' },
        { id: 4, name: 'Customer Success', members: 6, dashboards: 2, color: '#f59e0b' },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  // Detect @mentions in comment text
  const detectMentions = (text) => {
    const matches = text.match(/@(\w+\.?\w*)/g) || [];
    return matches.map(m => m.slice(1));
  };

  const handleCommentChange = (text) => {
    setNewComment(text);
    const lastAt = text.lastIndexOf('@');
    if (lastAt >= 0 && (lastAt === 0 || text[lastAt - 1] === ' ')) {
      const query = text.slice(lastAt + 1);
      if (!query.includes(' ')) {
        setMentionQuery(query.toLowerCase());
        setShowMentionPicker(true);
        return;
      }
    }
    setShowMentionPicker(false);
    setMentionQuery('');
  };

  const insertMention = (member) => {
    const lastAt = newComment.lastIndexOf('@');
    const before = newComment.slice(0, lastAt);
    const newText = `${before}@${member.id} `;
    setNewComment(newText);
    setShowMentionPicker(false);
    setMentionQuery('');
    commentInputRef.current?.focus();
  };

  const highlightedComment = (text) => {
    const parts = text.split(/(@[\w.]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const memberId = part.slice(1);
        const member = TEAM_MEMBERS.find(m => m.id === memberId);
        return (
          <span
            key={i}
            style={{
              background: member ? `${member.color}22` : '#f0f0f0',
              color: member ? member.color : '#666',
              borderRadius: '4px',
              padding: '0 4px',
              fontWeight: 500,
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    const mentions = detectMentions(newComment);
    const comment = {
      id: Date.now(),
      target: 'Dashboard',
      targetType: 'dashboard',
      user: 'current.user',
      avatar: '👤',
      content: newComment,
      time: 'Just now',
      mentions,
      replies: [],
      reactions: {},
    };
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setShowMentionPicker(false);
  };

  const handleReply = (commentId) => {
    if (!replyText.trim()) return;
    const reply = {
      id: Date.now(),
      user: 'current.user',
      avatar: '👤',
      content: replyText,
      time: 'Just now',
      reactions: {},
    };
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : c
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleReaction = (commentId, emoji, replyId = null) => {
    setComments(prev => prev.map(c => {
      if (replyId !== null && c.id === commentId) {
        return {
          ...c,
          replies: c.replies.map(r =>
            r.id === replyId
              ? { ...r, reactions: toggleEmoji(r.reactions || {}, emoji) }
              : r
          ),
        };
      }
      if (c.id === commentId) {
        return { ...c, reactions: toggleEmoji(c.reactions || {}, emoji) };
      }
      return c;
    }));
  };

  const toggleEmoji = (reactions, emoji) => {
    const next = { ...reactions };
    if (next[emoji]) {
      delete next[emoji];
    } else {
      next[emoji] = 1;
    }
    return next;
  };

  const createDashboard = () => {
    if (!newDashboard.name) return;
    const dashboard = {
      id: Date.now(),
      ...newDashboard,
      owner: 'current.user',
      sharedWith: [],
      views: 0,
      lastViewed: 'Just created',
      type: 'custom',
      color: '#6366f1',
    };
    setSharedDashboards(prev => [dashboard, ...prev]);
    setNewDashboard({ name: '', description: '', visibility: 'team' });
    setShowCreateModal(false);
  };

  const filteredMentionMembers = TEAM_MEMBERS.filter(m =>
    m.id.toLowerCase().includes(mentionQuery) || m.name.toLowerCase().includes(mentionQuery)
  );

  const typeIcons = { view: '👁', comment: '💬', share: '🔗', edit: '✏', create: '➕' };

  if (loading) {
    return (
      <div className="collaboration-hub-page">
        <div className="loading-state">
          <div className="collab-icon">👥</div>
          <p>Loading collaboration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collaboration-hub-page">
      <div className="page-header">
        <div>
          <h1>Collaboration Hub</h1>
          <p className="subtitle">Shared dashboards, team discussions, and workspaces</p>
        </div>
        {/* Who's online indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{ONLINE_MEMBERS.length} online</span>
          </div>
          <div style={{ display: 'flex', marginLeft: '4px' }}>
            {ONLINE_MEMBERS.slice(0, 4).map((id, i) => {
              const member = TEAM_MEMBERS.find(m => m.id === id);
              if (!member) return null;
              return (
                <div
                  key={id}
                  title={`${member.name} (${member.role})`}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: member.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', border: '2px solid white',
                    marginLeft: i > 0 ? '-6px' : 0,
                    zIndex: 4 - i,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {member.avatar}
                </div>
              );
            })}
            {ONLINE_MEMBERS.length > 4 && (
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#e5e7eb', color: '#6b7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 600,
                border: '2px solid white', marginLeft: '-6px',
              }}>
                +{ONLINE_MEMBERS.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="collab-stats">
        <div className="stat-card">
          <div className="stat-value">{sharedDashboards.length}</div>
          <div className="stat-label">Shared Dashboards</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{comments.length}</div>
          <div className="stat-label">Comments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{comments.reduce((sum, c) => sum + (c.replies?.length || 0), 0)}</div>
          <div className="stat-label">Replies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.values(comments.reduce((acc, c) => {
            Object.keys(c.reactions || {}).forEach(e => { acc[e] = (acc[e] || 0) + c.reactions[e]; });
            c.replies?.forEach(r => Object.keys(r.reactions || {}).forEach(e => { acc[e] = (acc[e] || 0) + r.reactions[e]; }));
            return acc;
          }, {})).reduce((a, b) => a + b, 0)}</div>
          <div className="stat-label">Reactions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'dashboards' ? 'active' : ''}`} onClick={() => setActiveTab('dashboards')}>
          📊 Dashboards
        </button>
        <button className={`tab ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
          💬 Comments ({comments.length})
        </button>
        <button className={`tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
          📜 Activity
        </button>
        <button className={`tab ${activeTab === 'workspaces' ? 'active' : ''}`} onClick={() => setActiveTab('workspaces')}>
          🏢 Workspaces
        </button>
      </div>

      {activeTab === 'dashboards' && (
        <div className="dashboards-grid">
          {sharedDashboards.map(d => (
            <div key={d.id} className="dashboard-share-card" style={{ borderTopColor: d.color }}>
              <div className="card-header">
                <div className="card-type" style={{ background: d.color }}>{d.type}</div>
                <span className={`visibility-badge ${d.visibility}`}>{d.visibility}</span>
              </div>
              <h4>{d.name}</h4>
              <p>{d.description}</p>
              <div className="card-meta">
                <span>👤 {d.owner}</span>
                <span>👁 {d.views} views</span>
                <span>⏱ {d.lastViewed}</span>
              </div>
              {d.sharedWith.length > 0 && (
                <div className="shared-with">
                  <span className="shared-label">Shared with:</span>
                  <div className="avatar-stack">
                    {d.sharedWith.slice(0, 3).map((m, i) => {
                      const member = TEAM_MEMBERS.find(tm => tm.id === m);
                      return (
                        <div key={i} className="mini-avatar" style={member ? { background: member.color } : {}} title={m}>
                          {member?.avatar || m.charAt(0).toUpperCase()}
                        </div>
                      );
                    })}
                    {d.sharedWith.length > 3 && <div className="mini-avatar more">+{d.sharedWith.length - 3}</div>}
                  </div>
                </div>
              )}
              <div className="card-actions">
                <button className="btn-action">Open</button>
                <button className="btn-action secondary">Edit</button>
                <button className="btn-action secondary">Share</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="comments-section">
          {/* Comment compose with @mention support */}
          <div className="comment-compose">
            <div className="comment-avatar">👤</div>
            <div className="compose-input" style={{ position: 'relative', flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={commentInputRef}
                  type="text"
                  placeholder="Add a comment... use @ to mention teammates"
                  value={newComment}
                  onChange={e => handleCommentChange(e.target.value)}
                  className="input"
                  onKeyDown={e => e.key === 'Enter' && !showMentionPicker && handleComment()}
                />
                {/* Mention picker dropdown */}
                {showMentionPicker && filteredMentionMembers.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 100, marginTop: '4px',
                    maxHeight: '200px', overflow: 'auto',
                  }}>
                    {filteredMentionMembers.map(member => (
                      <button
                        key={member.id}
                        onClick={() => insertMention(member)}
                        style={{
                          width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center',
                          gap: '8px', background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <span style={{ fontSize: '18px' }}>{member.avatar}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{member.name}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>{member.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn-primary" onClick={handleComment} disabled={!newComment.trim()} style={{ flexShrink: 0 }}>
                Post
              </button>
            </div>
          </div>

          <div className="comments-list">
            {comments.map(c => (
              <div key={c.id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-avatar">{c.avatar}</div>
                  <div className="comment-meta">
                    <span className="comment-user">{c.user}</span>
                    <span className="comment-target"> on {c.target}</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                </div>
                <p className="comment-content">{highlightedComment(c.content)}</p>

                {/* Reactions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                  {Object.entries(c.reactions || {}).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(c.id, emoji)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '12px',
                        background: '#f0f9ff', border: '1px solid #dbeafe',
                        cursor: 'pointer', fontSize: '12px',
                      }}
                      title={`${emoji} (${count})`}
                    >
                      {emoji} {count}
                    </button>
                  ))}
                  {/* Reaction picker */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveReaction(activeReaction === c.id ? null : c.id)}
                      style={{
                        padding: '2px 6px', borderRadius: '12px',
                        background: '#f9fafb', border: '1px dashed #d1d5db',
                        cursor: 'pointer', fontSize: '11px', color: '#6b7280',
                      }}
                    >
                      + React
                    </button>
                    {activeReaction === c.id && (
                      <div style={{
                        position: 'absolute', bottom: '100%', left: 0, marginBottom: '4px',
                        display: 'flex', gap: '2px', background: 'white',
                        border: '1px solid #e5e7eb', borderRadius: '20px',
                        padding: '4px 6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}>
                        {EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => { toggleReaction(c.id, emoji); setActiveReaction(null); }}
                            style={{
                              padding: '2px 4px', background: 'none', border: 'none',
                              cursor: 'pointer', fontSize: '16px', borderRadius: '4px',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="comment-actions">
                  <button className="btn-action small" onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}>
                    💬 Reply
                  </button>
                  <button className="btn-action small">Resolve</button>
                </div>

                {/* Reply input */}
                {replyingTo === c.id && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingLeft: '16px' }}>
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="input"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                      onKeyDown={e => e.key === 'Enter' && handleReply(c.id)}
                      autoFocus
                    />
                    <button className="btn-action small" onClick={() => handleReply(c.id)} disabled={!replyText.trim()}>Send</button>
                    <button className="btn-action small" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</button>
                  </div>
                )}

                {/* Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div className="replies">
                    {c.replies.map(r => (
                      <div key={r.id} className="reply-card">
                        <div className="comment-avatar small">{r.avatar}</div>
                        <div className="reply-content">
                          <span className="reply-user">{r.user}</span>
                          <span className="reply-time">{r.time}</span>
                          <p>{highlightedComment(r.content)}</p>
                          {/* Reply reactions */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {Object.entries(r.reactions || {}).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => toggleReaction(c.id, emoji, r.id)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '2px',
                                  padding: '1px 6px', borderRadius: '10px',
                                  background: '#f0f9ff', border: '1px solid #dbeafe',
                                  cursor: 'pointer', fontSize: '11px',
                                }}
                              >
                                {emoji} {count}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="activity-feed">
          {activity.map(a => {
            const member = TEAM_MEMBERS.find(m => m.id === a.user);
            return (
              <div key={a.id} className="activity-item">
                <div className="activity-icon">{typeIcons[a.type]}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  {member && (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      {member.avatar}
                    </div>
                  )}
                  <span className="activity-user">{a.user}</span>
                  <span className="activity-action">{a.action}</span>
                  <span className="activity-target">{a.target}</span>
                </div>
                <span className="activity-time">{a.time}</span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'workspaces' && (
        <div className="workspaces-grid">
          {workspaces.map(w => (
            <div key={w.id} className="workspace-card" style={{ borderLeftColor: w.color }}>
              <div className="workspace-header">
                <div className="workspace-icon" style={{ background: w.color }}>🏢</div>
                <h4>{w.name}</h4>
              </div>
              <div className="workspace-stats">
                <div className="ws-stat">
                  <span className="ws-value">{w.members}</span>
                  <span className="ws-label">Members</span>
                </div>
                <div className="ws-stat">
                  <span className="ws-value">{w.dashboards}</span>
                  <span className="ws-label">Dashboards</span>
                </div>
              </div>
              {/* Online members */}
              <div style={{ display: 'flex', marginTop: '8px' }}>
                {ONLINE_MEMBERS.slice(0, 3).map(id => {
                  const member = TEAM_MEMBERS.find(m => m.id === id);
                  if (!member) return null;
                  return (
                    <div key={id} title={`${member.name} — online`} style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: '#22c55e', border: '2px solid white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', marginLeft: '-6px', position: 'relative', zIndex: 1,
                    }}>
                      {member.avatar}
                    </div>
                  );
                })}
              </div>
              <div className="workspace-actions">
                <button className="btn-action">Open</button>
                <button className="btn-action secondary">Manage</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dashboard Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Dashboard</h3>
              <button className="btn-icon" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Dashboard Name</label>
                <input type="text" className="input" placeholder="e.g., Weekly Sales Report"
                  value={newDashboard.name} onChange={e => setNewDashboard(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" placeholder="What does this dashboard show?"
                  value={newDashboard.description} onChange={e => setNewDashboard(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Visibility</label>
                <select className="input" value={newDashboard.visibility}
                  onChange={e => setNewDashboard(p => ({ ...p, visibility: e.target.value }))}>
                  <option value="private">Private - Only me</option>
                  <option value="team">Team - All team members</option>
                  <option value="public">Public - Anyone with link</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={createDashboard} disabled={!newDashboard.name}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
