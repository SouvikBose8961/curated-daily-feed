import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [microcards, setMicrocards] = useState([]);

  const [newArticle, setNewArticle] = useState({ title: '', url: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(API_BASE + '/api/articles').then(r => r.json()).then(setArticles).catch(console.error);
    fetch(API_BASE + '/api/microcards').then(r => r.json()).then(setMicrocards).catch(console.error);
  }, []);

  const handleChange = (e) => setNewArticle(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      const created = await res.json();
      setArticles(prev => [created, ...prev]);
      setNewArticle({ title: '', url: '', content: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 1000, margin: '20px auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🌟 Curated Daily Feed</h1>

      {/* Add Article Form */}
      <section style={{ margin: '20px 0', padding: 16, border: '1px solid #ccc', borderRadius: 12, background: '#f9f9f9' }}>
        <h2>Add Article</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="title" value={newArticle.title} onChange={handleChange} placeholder="Title" required style={inputStyle} />
          <input name="url" value={newArticle.url} onChange={handleChange} placeholder="URL (optional)" style={inputStyle} />
          <textarea name="content" value={newArticle.content} onChange={handleChange} placeholder="Content" rows={4} required style={textareaStyle} />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Adding...' : 'Add Article'}
          </button>
        </form>
      </section>

      {/* Microcards Section */}
      <section>
        <h2>💡 Micro-learning Cards</h2>
        {microcards.length === 0 ? <p>No microcards yet. Add some from backend.</p> :
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {microcards.map(m => (
              <div key={m._id} style={microcardStyle}>
                <h4>{m.title}</h4>
                <p>{m.concept}</p>
              </div>
            ))}
          </div>}
      </section>

      {/* Articles Section */}
      <section>
        <h2>📰 Articles</h2>
        {articles.length === 0 ? <p>No articles yet. Add one above.</p> :
          articles.map(a => <ArticleCard key={a._id} article={a} />)}
      </section>
    </div>
  );
}

// Article card with collapsible summary + ELI5
function ArticleCard({ article }) {
  const [full, setFull] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);

  async function load() {
    try {
      // Fetch article summary + ELI5
      const res = await fetch(API_BASE + '/api/articles/' + article._id);
      const data = await res.json();
      setFull(data);

      // Ask user if they want an image
      const generateImage = window.confirm("Do you want to generate an image for this article?");
      if (generateImage) {
        setLoadingImg(true);
        const imgRes = await fetch(API_BASE + '/api/image/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: article.title })
        });
        const imgData = await imgRes.json();
        setImgUrl(imgData.url);
        setLoadingImg(false);
      }

      setExpanded(true);
    } catch (err) {
      console.error(err);
      setLoadingImg(false);
    }
  }

  return (
    <div style={articleCardStyle}>
      {imgUrl && <img src={imgUrl} alt={article.title} style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{article.title}</h3>
        {!full && <button style={buttonStyleSmall} onClick={load}>Load Summary</button>}
        {full && <button style={buttonStyleSmall} onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide' : 'Show'}</button>}
      </div>
      {article.url && <p style={{ fontStyle: 'italic', color: '#555' }}>{article.url}</p>}
      {expanded && full && (
        <div style={{ marginTop: 8 }}>
          <h4>Summary</h4>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 8, borderRadius: 6 }}>{full.summary}</pre>
          <h4>Explain like I'm 5</h4>
          <p style={{ background: '#f0f0f0', padding: 8, borderRadius: 6 }}>{full.simplified}</p>
        </div>
      )}
      {loadingImg && <p>Generating image...</p>}
    </div>
  );
}



// Styles
const inputStyle = { padding: 8, borderRadius: 6, border: '1px solid #ccc' };
const textareaStyle = { padding: 8, borderRadius: 6, border: '1px solid #ccc' };
const buttonStyle = { padding: '8px 16px', borderRadius: 6, border: 'none', background: '#3498db', color: '#fff', cursor: 'pointer' };
const buttonStyleSmall = { padding: '4px 8px', borderRadius: 4, border: 'none', background: '#2ecc71', color: '#fff', cursor: 'pointer', fontSize: 12 };
const microcardStyle = { border: '1px solid #ddd', padding: 12, borderRadius: 8, background: '#fff', boxShadow: '1px 1px 4px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', hover: { transform: 'scale(1.03)' } };
const articleCardStyle = { border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 16, background: '#fff', boxShadow: '1px 2px 5px rgba(0,0,0,0.05)' };
