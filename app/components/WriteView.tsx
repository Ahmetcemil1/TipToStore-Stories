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

interface ChapterInput {
  title: string;
  content: string;
}

const TAG_SUGGESTIONS = ['sci-fi', 'archive', 'web3', 'philosophy', 'culture', 'poetry', 'history', 'music', 'ocean', 'survival', 'filecoin', 'ipfs'];

const COVER_GRADIENTS = [
  'linear-gradient(135deg,#2B5A44,#5E7A68)', /* Forest Sage */
  'linear-gradient(135deg,#BF5D38,#E59073)', /* Terracotta Peach */
  'linear-gradient(135deg,#C27A28,#E8BE80)', /* Ochre Sand */
  'linear-gradient(135deg,#3A506B,#5BC0BE)', /* Ocean Teal */
  'linear-gradient(135deg,#4A2E35,#8C5F66)', /* Burgundy Rose */
  'linear-gradient(135deg,#1E2A38,#495867)', /* Slate Charcoal */
  'linear-gradient(135deg,#4F5D75,#8D99AE)', /* Arctic Blue */
  'linear-gradient(135deg,#323232,#6B6B6B)', /* Clean Ink */
];

function shortenAddr(addr?: string) {
  if (!addr) return '0xYou';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WriteView({ onPublish, onNavigate, showToast }: WriteViewProps) {
  const { isConnected, address } = useAccount();

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(COVER_GRADIENTS[0]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'write' | 'preview'>('write');

  // Book/Novel Mode State
  const [isMultiChapter, setIsMultiChapter] = useState(false);
  const [chapters, setChapters] = useState<ChapterInput[]>([]);
  const [chapTitle, setChapTitle] = useState('');
  const [chapContent, setChapContent] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Single Page Mode State
  const [singleContent, setSingleContent] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  // Calculate total word counts
  const getWordCount = (txt: string) => txt.trim().split(/\s+/).filter(Boolean).length;
  
  const totalWordCount = isMultiChapter
    ? chapters.reduce((acc, c) => acc + getWordCount(c.content), 0) + getWordCount(chapContent)
    : getWordCount(singleContent);

  const readMinutes = Math.max(1, Math.ceil(totalWordCount / 200));

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

  // Chapter Management functions
  const saveChapter = () => {
    if (!chapContent.trim()) {
      showToast('Chapter content cannot be empty.', 'error');
      return;
    }
    const finalTitle = chapTitle.trim() || `Chapter ${chapters.length + 1}`;

    if (editingIndex !== null) {
      // Update existing
      const updated = [...chapters];
      updated[editingIndex] = { title: finalTitle, content: chapContent.trim() };
      setChapters(updated);
      setEditingIndex(null);
      showToast('Chapter updated.', 'success');
    } else {
      // Add new
      setChapters([...chapters, { title: finalTitle, content: chapContent.trim() }]);
      showToast(`Chapter ${chapters.length + 1} added.`, 'success');
    }

    setChapTitle('');
    setChapContent('');
  };

  const editChapter = (index: number) => {
    setEditingIndex(index);
    setChapTitle(chapters[index].title);
    setChapContent(chapters[index].content);
  };

  const deleteChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setChapTitle('');
      setChapContent('');
    }
    showToast('Chapter deleted.', 'info');
  };

  async function handlePublish() {
    if (!isConnected) { showToast('Connect your wallet first!', 'error'); return; }
    if (!title.trim()) { showToast('Please add a book title', 'error'); return; }

    let finalChapters: ChapterInput[] = [];
    let finalContent = '';

    if (isMultiChapter) {
      if (chapters.length === 0 && !chapContent.trim()) {
        showToast('Please add at least one chapter.', 'error');
        return;
      }
      // If there's unsaved text in the current fields, auto-save or warn
      let currentChapters = [...chapters];
      if (chapContent.trim()) {
        const finalTitle = chapTitle.trim() || `Chapter ${chapters.length + 1}`;
        currentChapters.push({ title: finalTitle, content: chapContent.trim() });
      }
      finalChapters = currentChapters;
      finalContent = finalChapters.map(c => `## ${c.title}\n\n${c.content}`).join('\n\n');
    } else {
      if (getWordCount(singleContent) < 30) {
        showToast('Story must be at least 30 words', 'error');
        return;
      }
      finalChapters = [{ title: 'Chapter 1', content: singleContent.trim() }];
      finalContent = singleContent.trim();
    }

    setIsUploading(true);
    showToast('📡 Pinning dataset to IPFS & opening Filecoin deal…', 'info');

    // Simulate upload
    await new Promise(r => setTimeout(r, 2500));

    const fakeCID = `bafybei${Math.random().toString(36).slice(2,20)}${Math.random().toString(36).slice(2,18)}`;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: title.trim(),
      content: finalContent,
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
      tags: tags.length > 0 ? tags : ['book'],
      publishedAt: new Date().toISOString().slice(0, 10),
      wordCount: totalWordCount,
      readMinutes,
      chapters: finalChapters,
    };

    setIsUploading(false);
    onPublish(newStory);
    showToast('🎉 Book published! Filecoin storage deal successfully created.', 'success');
    onNavigate('story', newStory.id);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-[var(--text-primary)] mb-2">✍️ Publish a Story or Book</h1>
        <p className="text-[var(--text-secondary)] text-sm">Your work will be pinned to IPFS and registered as a Filecoin dataset. Tips extend its storage lease dynamically.</p>
      </div>

      {!isConnected && (
        <div className="rounded-2xl p-6 mb-8 border border-[var(--accent-ochre)]/20 text-center bg-[var(--accent-ochre)]/5">
          <p className="text-[var(--accent-ochre)] font-bold mb-3 text-sm">Connect your wallet to publish</p>
          <div className="inline-block">
            <ConnectButton />
          </div>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="rounded-2xl p-4 mb-6 border border-[var(--border-strong)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Select Format Type</p>
          <p className="text-xs text-[var(--text-secondary)]">Choose whether you are publishing a short story or a multi-page book/novel.</p>
        </div>
        <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-strong)] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsMultiChapter(false)}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isMultiChapter ? 'bg-[var(--accent-forest)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            📄 Short Story (Single Page)
          </button>
          <button
            type="button"
            onClick={() => setIsMultiChapter(true)}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${isMultiChapter ? 'bg-[var(--accent-forest)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            📚 Book / Novel (Multi-Chapter)
          </button>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 mb-8">
        {(['write', 'preview'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
              step === s
                ? 'bg-[var(--accent-forest)]/10 border-[var(--accent-forest)]/30 text-[var(--accent-forest)]'
                : 'border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]'
            }`}
          >
            {s === 'write' ? '📝 Write' : '👁️ Preview'}
          </button>
        ))}
      </div>

      {step === 'write' ? (
        <div className="space-y-6">
          {/* Cover design */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Cover Design</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
              {COVER_GRADIENTS.map(g => (
                <button
                  key={g}
                  onClick={() => { setSelectedGradient(g); setCoverPreview(null); }}
                  className={`h-12 rounded-xl border-2 transition-all ${selectedGradient === g && !coverPreview ? 'border-[var(--accent-forest)] scale-105 shadow-sm' : 'border-transparent hover:border-black/20'}`}
                  style={{ background: g }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 transition-all bg-[var(--bg-card)]"
              >
                📷 Upload custom image (max 5MB)
              </button>
              {coverPreview && (
                <button onClick={() => setCoverPreview(null)} className="text-xs text-[var(--accent-clay)] hover:underline">✕ Remove</button>
              )}
            </div>
            {/* Preview */}
            <div
              className="h-36 rounded-xl mt-4 overflow-hidden relative shadow-inner"
              style={{ background: coverPreview ? undefined : selectedGradient }}
            >
              {coverPreview && <img src={coverPreview} alt="" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-2 left-3 text-xs text-white/80 font-medium">Cover preview</span>
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              {isMultiChapter ? 'Book / Novel Title *' : 'Story Title *'}
            </label>
            <input
              type="text"
              placeholder={isMultiChapter ? "Enter book or novel title…" : "Give your story a compelling title…"}
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl text-sm border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-card)] font-serif text-lg"
            />
            <p className="text-[10px] text-[var(--text-muted)] mt-1 text-right font-medium">{title.length}/120</p>
          </div>

          {/* CONTENT SECTION */}
          {isMultiChapter ? (
            /* Multi-chapter writing flow */
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Chapter Manager</label>
                <span className="text-xs text-[var(--text-muted)] font-semibold">{chapters.length} chapters · {totalWordCount} total words</span>
              </div>

              {/* Saved chapters list */}
              {chapters.length > 0 && (
                <div className="border border-[var(--border-strong)] rounded-xl bg-[var(--bg-secondary)] p-4 space-y-2.5">
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Saved Chapters</p>
                  <div className="space-y-2">
                    {chapters.map((ch, i) => (
                      <div key={i} className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-strong)] p-3 rounded-lg text-sm shadow-sm">
                        <div className="truncate pr-4">
                          <span className="font-bold text-[var(--accent-forest)] mr-1.5">{i + 1}.</span>
                          <span className="font-serif font-bold text-[var(--text-primary)]">{ch.title}</span>
                          <span className="text-[10px] text-[var(--text-muted)] ml-2 font-medium">({getWordCount(ch.content)} words)</span>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => editChapter(i)}
                            className="text-xs font-semibold text-[var(--accent-forest)] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteChapter(i)}
                            className="text-xs font-semibold text-[var(--accent-clay)] hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add/Edit chapter form */}
              <div className="border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--bg-card)] space-y-3 shadow-sm">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {editingIndex !== null ? `✏️ Edit Chapter ${editingIndex + 1}` : `➕ Add Chapter / Page ${chapters.length + 1}`}
                </p>
                <input
                  type="text"
                  placeholder="Chapter Title (e.g., Chapter 1: The Beginning)"
                  value={chapTitle}
                  onChange={e => setChapTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] bg-[var(--bg-primary)] font-serif"
                />
                <textarea
                  placeholder="Write chapter content here. You can add as many chapters as you want. Perfect for 99-page books or 400-page novels. Filecoin will store the entire compiled manuscript securely…"
                  rows={10}
                  value={chapContent}
                  onChange={e => setChapContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] bg-[var(--bg-primary)] resize-none serif-body"
                />
                <div className="flex gap-2 justify-end">
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={() => { setEditingIndex(null); setChapTitle(''); setChapContent(''); }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-black/5 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={saveChapter}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white btn-primary transition-all"
                  >
                    {editingIndex !== null ? 'Update Chapter' : 'Save Chapter'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Single chapter flow */
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Story Content *</label>
                <span className="text-xs text-[var(--text-muted)] font-medium">{totalWordCount} words · ~{readMinutes} min read</span>
              </div>
              <textarea
                placeholder="Write your story here. There's no page limit — the longer the story, the more Filecoin data is stored, adding real value to the network…"
                rows={16}
                value={singleContent}
                onChange={e => setSingleContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-card)] resize-none serif-body"
              />
            </div>
          )}

          {/* Value Highlight info box */}
          <div className="rounded-xl px-4 py-3 mt-4 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] leading-relaxed">
            💡 <strong>Filecoin Dataset Capacity:</strong> Whether you write a short 1-page article or compile a 400-page historical novel with 99 chapters, the system packages your content into a secure, encrypted folder structure. Decentalized Filecoin providers store the entire metadata set. Larger works add real, meaningful transaction size to the Filecoin ecosystem.
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Tags (max 5)</label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-[var(--accent-forest)] border border-[var(--accent-forest)]/20 bg-[var(--accent-forest)]/5">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="text-[var(--accent-forest)] hover:text-[var(--accent-clay)] ml-0.5 font-bold">✕</button>
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
                className="flex-1 px-3 py-2 rounded-xl text-sm border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-card)]"
                disabled={tags.length >= 5}
              />
              <button onClick={() => addTag(tagInput)} className="px-4 py-2 rounded-xl text-sm border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 bg-[var(--bg-card)] transition-all font-semibold">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {TAG_SUGGESTIONS.filter(t => !tags.includes(t)).map(t => (
                <button key={t} onClick={() => addTag(t)} className="px-2.5 py-0.5 rounded-full text-[11px] text-[var(--text-secondary)] border border-[var(--border-strong)] hover:border-[var(--text-secondary)] bg-[var(--bg-card)] transition-all">
                  +{t}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep('preview')}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 bg-[var(--bg-card)] transition-all"
            >
              👁 Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={!isConnected || isUploading || !title.trim() || totalWordCount < 30}
              className="flex-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
              style={{ flex: 2 }}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Uploading to Filecoin…
                </span>
              ) : (
                isMultiChapter ? '🚀 Publish Book to Filecoin' : '🚀 Publish Story to Filecoin'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Preview */
        <div>
          <div
            className="h-48 rounded-2xl overflow-hidden mb-6 relative shadow-md"
            style={{ background: coverPreview ? undefined : selectedGradient }}
          >
            {coverPreview && <img src={coverPreview} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-sm">#{t}</span>
                ))}
              </div>
              <h1 className="text-2xl font-bold font-serif text-white drop-shadow">{title || 'Untitled Book'}</h1>
              <p className="text-xs text-white/80 mt-1">
                by {shortenAddr(address)} · {isMultiChapter ? `${chapters.length} chapters` : '1 page'} · {totalWordCount} words · {readMinutes} min read
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)] bg-[var(--bg-card)]">
            {isMultiChapter ? (
              <div className="space-y-6">
                {chapters.map((ch, idx) => (
                  <div key={idx} className="border-b border-black/5 last:border-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-3">{idx + 1}. {ch.title}</h3>
                    <p className="serif-body text-[var(--text-secondary)] whitespace-pre-line text-sm">{ch.content}</p>
                  </div>
                ))}
                {chapters.length === 0 && chapContent.trim() && (
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[var(--text-primary)] mb-3">{chapTitle || 'Chapter 1'}</h3>
                    <p className="serif-body text-[var(--text-secondary)] whitespace-pre-line text-sm">{chapContent}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="serif-body text-[var(--text-primary)] whitespace-pre-line text-sm">{singleContent || 'Nothing written yet…'}</p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep('write')} className="flex-1 py-3 rounded-xl font-semibold text-sm border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 bg-[var(--bg-card)] transition-all">
              ← Back to Edit
            </button>
            <button
              onClick={handlePublish}
              disabled={!isConnected || isUploading || !title.trim() || totalWordCount < 30}
              className="flex-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
              style={{ flex: 2 }}
            >
              {isUploading ? 'Uploading…' : '🚀 Publish to Filecoin'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
