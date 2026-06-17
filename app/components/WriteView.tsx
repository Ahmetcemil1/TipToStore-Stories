'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Story } from '../types';

type Page = 'home' | 'about' | 'write' | 'story' | 'author';

interface WriteViewProps {
  onPublish: (story: Story) => void;
  onNavigate: (page: Page, id?: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const TAG_SUGGESTIONS = ['sci-fi', 'archive', 'web3', 'philosophy', 'culture', 'poetry', 'history', 'music', 'ocean', 'survival', 'filecoin', 'ipfs'];

const COVER_GRADIENTS = [
  'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
  'linear-gradient(135deg,#0d0d0d,#1a1a2e,#16213e)',
  'linear-gradient(135deg,#0b0c10,#1f2833,#45a29e)',
  'linear-gradient(135deg,#10002b,#240046,#3c096c)',
  'linear-gradient(135deg,#0a0a0a,#1c1c1c,#2d6a4f)',
  'linear-gradient(135deg,#03071e,#370617,#6a040f)',
  'linear-gradient(135deg,#023e8a,#0077b6,#00b4d8)',
];

function shortenAddr(addr?: string) {
  if (!addr) return '0xYou';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WriteView({ onPublish, onNavigate, showToast }: WriteViewProps) {
  const { isConnected, address } = useAccount();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(COVER_GRADIENTS[0]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'write' | 'preview'>('write');

  const fileRef = useRef<HTMLInputElement>(null);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 5) setTags([...tags, t]);
    setTagInput('');
  }
  function removeTag(tag: string) { setTags(tags.filter(t => t !== tag)); }

  function handleCoverUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handlePublish() {
    if (!isConnected) { showToast('Connect your wallet first!', 'error'); return; }
    if (!title.trim()) { showToast('Please add a title', 'error'); return; }
    if (content.trim().split(/\s+/).length < 30) { showToast('Story must be at least 30 words', 'error'); return; }

    setIsUploading(true);
    showToast('📡 Pinning to IPFS & opening Filecoin deal…', 'info');

    // Simulate upload
    await new Promise(r => setTimeout(r, 2500));

    const fakeCID = `bafybei${Math.random().toString(36).slice(2,20)}${Math.random().toString(36).slice(2,18)}`;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      coverImage: coverPreview ?? selectedGradient,
      author: shortenAddr(address),
      authorFull: address ?? '0x0000',
      authorAvatar: '✍️',
      authorBio: 'TipToStore author',
      status: 'ACTIVE',
      hoursRemaining: 168,
      maxHours: 168,
      likes: 0,
      views: 1,
      tipsReceived: 0,
      tipsUSDFC: 0,
      filecoinCID: fakeCID,
      tags: tags.length > 0 ? tags : ['story'],
      publishedAt: new Date().toISOString().slice(0, 10),
      wordCount,
      readMinutes,
    };

    setIsUploading(false);
    onPublish(newStory);
    showToast('🎉 Story published! Storage deal opened for 7 days.', 'success');
    onNavigate('story', newStory.id);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">✍️ Publish a Story</h1>
        <p className="text-slate-400 text-sm">Your story will be pinned to IPFS and registered as a Filecoin dataset. Community tips extend its storage lease.</p>
      </div>

      {!isConnected && (
        <div className="rounded-2xl p-6 mb-8 border border-amber-500/20 text-center" style={{background:'rgba(245,158,11,0.07)'}}>
          <p className="text-amber-300 font-semibold mb-3">Connect your wallet to publish</p>
          <ConnectButton />
        </div>
      )}

      {/* Step tabs */}
      <div className="flex gap-2 mb-8">
        {(['write', 'preview'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
              step === s
                ? 'border-emerald-500/30 text-emerald-300'
                : 'border-white/7 text-slate-500 hover:text-white hover:border-white/15'
            }`}
            style={{ background: step === s ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}
          >
            {s === 'write' ? '📝 Write' : '👁 Preview'}
          </button>
        ))}
      </div>

      {step === 'write' ? (
        <div className="space-y-6">
          {/* Cover image */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
              {COVER_GRADIENTS.map(g => (
                <button
                  key={g}
                  onClick={() => { setSelectedGradient(g); setCoverPreview(null); }}
                  className={`h-12 rounded-xl border-2 transition-all ${selectedGradient === g && !coverPreview ? 'border-emerald-400 scale-105' : 'border-transparent hover:border-white/20'}`}
                  style={{ background: g }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 text-sm rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                📷 Upload custom image (max 5MB)
              </button>
              {coverPreview && (
                <button onClick={() => setCoverPreview(null)} className="text-xs text-red-400 hover:text-red-300">✕ Remove</button>
              )}
            </div>
            {/* Preview */}
            <div
              className="h-32 rounded-xl mt-3 overflow-hidden relative"
              style={{ background: coverPreview ? undefined : selectedGradient }}
            >
              {coverPreview && <img src={coverPreview} alt="" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-2 left-3 text-xs text-white/60">Cover preview</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Story Title *</label>
            <input
              type="text"
              placeholder="Give your story a compelling title…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 border border-white/7 focus:outline-none focus:border-emerald-500/40 transition-all"
              style={{ background: 'rgba(2,8,16,0.8)' }}
            />
            <p className="text-xs text-slate-700 mt-1 text-right">{title.length}/120</p>
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Story Content *</label>
              <span className="text-xs text-slate-600">{wordCount} words · ~{readMinutes} min read</span>
            </div>
            <textarea
              placeholder="Write your story here. There's no page limit — the longer the story, the more Filecoin data is stored, adding real value to the network…"
              rows={16}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 placeholder-slate-600 border border-white/7 focus:outline-none focus:border-emerald-500/40 transition-all resize-none leading-relaxed"
              style={{ background: 'rgba(2,8,16,0.8)' }}
            />
            <div className="rounded-xl px-4 py-2 mt-2 border border-white/5 text-xs text-slate-500" style={{background:'rgba(2,8,16,0.5)'}}>
              💡 Longer stories = more Filecoin data stored = more value to the network + more community attachment to preserve them
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags (max 5)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/25" style={{background:'rgba(16,185,129,0.1)'}}>
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-emerald-600 hover:text-red-400 ml-0.5">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag…"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }}
                className="flex-1 px-3 py-2 rounded-xl text-sm text-slate-200 placeholder-slate-600 border border-white/7 focus:outline-none focus:border-emerald-500/40 transition-all"
                style={{ background: 'rgba(2,8,16,0.8)' }}
                disabled={tags.length >= 5}
              />
              <button onClick={() => addTag(tagInput)} className="px-4 py-2 rounded-xl text-sm border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TAG_SUGGESTIONS.filter(t => !tags.includes(t)).map(t => (
                <button key={t} onClick={() => addTag(t)} className="px-2 py-0.5 rounded-full text-[11px] text-slate-600 border border-white/5 hover:text-slate-300 hover:border-white/10 transition-all" style={{background:'rgba(255,255,255,0.02)'}}>
                  +{t}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep('preview')}
              className="flex-1 py-3 rounded-xl font-bold text-sm border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
            >
              👁 Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={!isConnected || isUploading || !title.trim() || wordCount < 30}
              className="flex-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#059669,#0ea5e9)', flex: 2 }}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Uploading to Filecoin…
                </span>
              ) : '🚀 Publish to Filecoin'}
            </button>
          </div>
        </div>
      ) : (
        /* Preview */
        <div>
          <div
            className="h-48 rounded-2xl overflow-hidden mb-6 relative"
            style={{ background: coverPreview ? undefined : selectedGradient }}
          >
            {coverPreview && <img src={coverPreview} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map(t => (
                  <span key={t} className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm">#{t}</span>
                ))}
              </div>
              <h1 className="text-2xl font-black text-white drop-shadow">{title || 'Untitled Story'}</h1>
              <p className="text-xs text-white/60 mt-1">by {shortenAddr(address)} · {wordCount} words · {readMinutes} min read</p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none rounded-2xl p-6 border border-white/5" style={{background:'rgba(8,15,28,0.85)'}}>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">{content || 'Nothing written yet…'}</p>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep('write')} className="flex-1 py-3 rounded-xl font-bold text-sm border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all">
              ← Back to Edit
            </button>
            <button
              onClick={handlePublish}
              disabled={!isConnected || isUploading || !title.trim() || wordCount < 30}
              className="flex-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#059669,#0ea5e9)', flex: 2 }}
            >
              {isUploading ? 'Uploading…' : '🚀 Publish to Filecoin'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
