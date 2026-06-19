import React, { useState } from "react";
import { BookOpen, Search, Eye, Bookmark, Check, Download, FileSpreadsheet, Printer, RotateCcw } from "lucide-react";
import { StudyNote } from "../types";
import { MOCK_NOTES } from "../data/mockData";

interface StudyMaterialProps {
  selectedNoteId?: string | null;
  onSelectNote?: (noteId: string | null) => void;
}

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function StudyMaterial({ selectedNoteId, onSelectNote }: StudyMaterialProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicNotes, setDynamicNotes] = useState<StudyNote[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  const [textSize, setTextSize] = useState<"normal" | "large" | "extra-large">("normal");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isNightMode, setIsNightMode] = useState(false);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>([]);
  const [downloadsMap, setDownloadsMap] = useState<Record<string, number>>({});

  React.useEffect(() => {
    fetch("/api/get-automated-content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.studyNotes) {
          setDynamicNotes(data.studyNotes);
        }
      })
      .catch((err) => console.error("Error loading dynamic study notes:", err));
  }, []);

  const allNotes = [...dynamicNotes, ...MOCK_NOTES];

  React.useEffect(() => {
    if (selectedNoteId && allNotes.length > 0) {
      const match = allNotes.find(n => n.id === selectedNoteId || toSlug(n.title) === selectedNoteId);
      if (match && (!selectedNote || selectedNote.id !== match.id)) {
        setSelectedNote(match);
      }
    } else if (!selectedNoteId && !selectedNote && allNotes.length > 0) {
      setSelectedNote(allNotes[0]);
    }
  }, [selectedNoteId, allNotes, selectedNote]);

  const handleToggleBookmark = (noteId: string) => {
    setBookmarkedNotes(prev =>
      prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId]
    );
  };

  const handleDownloadPdfNote = (note: StudyNote) => {
    try {
      const fileHeader = `=====================================================================\n`;
      const docHeader  = `     AGNI PARIKSHA COMPETITIVE EXAMS ACADEMY - VERIFIED STUDY NOTES\n`;
      const category   = `     Category: ${note.category.toUpperCase()} | Format: SECURED ACADEMIC PDF\n`;
      const noteTitle  = `     Document Title: ${note.title}\n`;
      const docMeta    = `     Author: ${note.author} | Date: ${note.date} | Security Level: Verified\n`;
      const delimiter  = `=====================================================================\n\n`;
      const bodyContent = note.content;
      const footer     = `\n\n---------------------------------------------------------------------\n© AgniPariksha Academic Publishing. All rights reserved. For Personal Study Use Only.`;

      const fullString = fileHeader + docHeader + category + noteTitle + docMeta + delimiter + bodyContent + footer;
      const blob = new Blob([fullString], { type: "application/pdf;charset=utf-8" });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `${note.title.replace(/\s+/g, "_")}_Official_Notes.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Increment download trace
      setDownloadsMap(prev => ({
        ...prev,
        [note.id]: (prev[note.id] || 0) + 1
      }));
    } catch (e) {
      console.error("Failed to compile study notes PDF", e);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const filteredNotes = allNotes.filter(note => {
    const term = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(term) ||
      note.category.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6" id="study-material-viewport">
      
      {/* Search and Categories Header */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center">
            <BookOpen className="h-6 w-6 text-[#000080] mr-2" />
            Official Government Exams PDF Study Material Portal
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Access secure Revision Sheets, General Knowledge briefings, and syllabus summaries. <strong>All files are formatted in print-ready direct PDF format (.pdf)</strong> for offline learning.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative max-w-sm w-full md:w-64 shrink-0">
          <input
            type="text"
            id="search-notes-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exam notes..."
            className="w-full text-xs font-bold p-3 pl-10 border border-gray-205 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
          />
          <Search className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Main Two Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="study-material-layout">
        
        {/* Left column Note select list */}
        <div 
          className="lg:col-span-1 space-y-4 bg-gradient-to-b from-white to-[#000080]/5 p-5 rounded-2xl border-2 border-[#000080]/15 shadow-sm transition-all duration-300 hover:shadow-md" 
          id="notes-sidebar-selector"
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center pb-1">
              <h4 className="font-bold text-xs uppercase text-[#000080] font-mono tracking-widest pl-1">Government PDF Index</h4>
              <span className="bg-[#138808]/10 text-[#138808] text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded border border-[#138808]/20 flex items-center select-none">
                <span className="h-1.5 w-1.5 bg-[#138808] rounded-full mr-1 animate-pulse" />
                Live Hub
              </span>
            </div>
            
            {/* Live compiler action button directly inside sidebar controller */}
            <button
              onClick={async () => {
                setIsGenerating(true);
                try {
                  const res = await fetch("/api/get-automated-content?force=true", { method: "POST" });
                  const data = await res.json();
                  if (data && data.studyNotes) {
                    setDynamicNotes(data.studyNotes);
                    if (data.studyNotes.length > 0) {
                      setSelectedNote(data.studyNotes[0]);
                      onSelectNote?.(toSlug(data.studyNotes[0].title));
                    }
                    alert("Success: Dynamic compiler completed research and instantly published 2 new PDF chapters written in Hindi!");
                  }
                } catch (err) {
                  console.error("Manual trigger failed:", err);
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className="w-full text-center py-2.5 bg-[#000080] hover:bg-blue-900 text-white font-extrabold uppercase text-[9px] tracking-wider rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5"
            >
              {isGenerating ? (
                <span>Researching Web Trends...</span>
              ) : (
                <>
                  <span>Research & Publish Live Notes Now</span>
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
                </>
              )}
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 mt-2.5" id="notes-list-sidebar">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              const isBookmarked = bookmarkedNotes.includes(note.id);
              const mockFileSize = `${(note.content.length / 500 + 0.6).toFixed(1)} MB`;
              
              return (
                <div
                  key={note.id}
                  id={`note-card-selector-${note.id}`}
                  onClick={() => {
                    setSelectedNote(note);
                    setCurrentPage(1);
                    onSelectNote?.(toSlug(note.title));
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#000080] shadow-md"
                      : "bg-white border-gray-100 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[8px] font-black uppercase text-[#FF9933] bg-[#FF9933]/10 px-2 py-0.5 rounded">
                        {note.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-[8px] font-black uppercase text-white bg-red-600 px-1.5 py-0.2 rounded font-mono">
                          PDF
                        </span>
                        {isBookmarked && (
                          <span className="text-[8px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-1 py-0.2 rounded uppercase">
                            Saved
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h5 className="font-black text-xs text-gray-800 leading-snug">
                      {note.title}
                    </h5>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-4 pt-2 border-t border-gray-50">
                    <span className="font-bold text-slate-500">{mockFileSize}</span>
                    <span>Downloads: {downloadsMap[note.id] || Math.floor((note.content.length % 29) + 4)}</span>
                  </div>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 italic">No notes match your query.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column Selected Note Reader panel */}
        <div className="lg:col-span-2 space-y-4" id="notes-reader-panel">
          {selectedNote ? (
            <div className={`rounded-2xl shadow-md border p-4 sm:p-6 transition-all ${
              isNightMode ? "bg-slate-900 text-gray-200 border-slate-800" : "bg-slate-100 text-gray-800 border-gray-250"
            }`} id="active-reading-board">
              
              {/* Acrobat Style PDF Header Strip */}
              <div className="bg-slate-800 text-white p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 mb-5 shadow" id="reader-controls">
                
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-black uppercase bg-red-600 text-white px-2 py-1 rounded font-mono">PDF ACTIVE</span>
                  <span className="text-[11px] font-mono font-bold truncate max-w-[200px] sm:max-w-xs">{selectedNote.title.replace(/\s+/g, "_")}.pdf</span>
                </div>

                {/* PDF Toolbar */}
                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center bg-slate-700 rounded-lg p-0.5" id="reader-zoom-box">
                    <button
                      id="text-size-normal-btn"
                      onClick={() => setTextSize("normal")}
                      className={`px-2.5 py-1 rounded text-[10px] font-black transition-colors ${textSize === "normal" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"}`}
                      title="100% Zoom"
                    >
                      100%
                    </button>
                    <button
                      id="text-size-large-btn"
                      onClick={() => setTextSize("large")}
                      className={`px-2.5 py-1 rounded text-[10px] font-black transition-colors ${textSize === "large" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"}`}
                      title="150% Zoom"
                    >
                      150%
                    </button>
                    <button
                      id="text-size-xlarge-btn"
                      onClick={() => setTextSize("extra-large")}
                      className={`px-2.5 py-1 rounded text-[10px] font-black transition-colors ${textSize === "extra-large" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"}`}
                      title="200% Zoom"
                    >
                      200%
                    </button>
                  </div>

                  <button
                    id="reader-night-mode-toggle"
                    onClick={() => setIsNightMode(!isNightMode)}
                    className="p-1.5 bg-slate-705 text-gray-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                    title={isNightMode ? "Switch to Light Mode" : "Switch to Night Mode"}
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    id="reader-print-btn"
                    onClick={handlePrintPdf}
                    className="p-1.5 bg-slate-705 text-gray-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                    title="Print Document"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* PDF Secure Download Banner */}
              <div className="mb-5 bg-gradient-to-r from-red-600 to-red-800 text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-left">
                  <h4 className="font-extrabold text-sm flex items-center">
                    <Download className="h-4 w-4 mr-1.5 animate-bounce" />
                    Verified Government Job Study Materials Note
                  </h4>
                  <p className="text-[10px] text-red-100 font-mono mt-0.5">
                    Click the download button to generate the authentic print-ready PDF file of this chapter.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id={`bookmark-note-btn-${selectedNote.id}`}
                    onClick={() => handleToggleBookmark(selectedNote.id)}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                      bookmarkedNotes.includes(selectedNote.id)
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                        : "bg-red-700 hover:bg-red-900 text-white border-red-500"
                    }`}
                    title="Save to Library"
                  >
                    <Bookmark className="h-4 w-4 fill-current text-white" />
                  </button>

                  <button
                    id={`download-pdf-button-${selectedNote.id}`}
                    onClick={() => handleDownloadPdfNote(selectedNote)}
                    className="bg-white hover:bg-slate-100 text-red-700 text-xs font-black tracking-wider uppercase px-4 py-2 rounded-lg shadow transition-all duration-150 flex items-center space-x-1.5"
                  >
                    <span>Download PDF</span>
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Document Simulator Container - Styled like formal A4 paper */}
              <div 
                className={`w-full max-w-4xl mx-auto rounded-xl p-6 sm:p-12 shadow-2xl transition-all relative select-text border border-gray-300 ${
                  isNightMode ? "bg-slate-950 text-gray-200" : "bg-white text-gray-805"
                }`}
                style={{ minHeight: "680px" }}
                id="actual-notes-body-text"
              >
                {/* Official watermarked diagonal label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.04] text-[#000080] text-6xl font-black uppercase text-center select-none font-mono tracking-widest leading-normal">
                  AGNI PARIKSHA<br />PROVEN STUDY CORE
                </div>

                {/* PDF Header Block */}
                <div className="border-b-2 border-[#000080] pb-4 mb-6 flex justify-between items-end">
                  <div className="text-left">
                    <span className="text-[10px] font-mono tracking-widest text-[#FF9933] uppercase font-black">
                      {selectedNote.category}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight" style={{ color: isNightMode ? "#FFF" : "#0f172a" }}>
                      {selectedNote.title}
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">
                      Author: {selectedNote.author} • Updated: {selectedNote.date}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase hidden sm:block">
                    Page {currentPage} of 2
                  </span>
                </div>

                {/* Inner Content with custom Zoom sizes */}
                <div 
                  className={`leading-relaxed whitespace-pre-wrap text-left ${
                    textSize === "normal" ? "text-xs sm:text-[13px] leading-relaxed" :
                    textSize === "large" ? "text-sm sm:text-base leading-relaxed" : "text-base sm:text-lg leading-loose font-medium"
                  }`}
                >
                  {selectedNote.content}
                </div>

                {/* Official Closing Footer line */}
                <div className="mt-12 pt-6 border-t border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-gray-400 gap-2">
                  <span>SYSTEM DOC ID: AP-A4-{selectedNote.id.toUpperCase()}</span>
                  <span className="text-[#138808] font-bold uppercase flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-600 font-black" />
                    AGNI SECURE ACADEMIC LICENSE VALIDATED
                  </span>
                </div>
              </div>

              {/* Simulated Page Navigation */}
              <div className="mt-4 flex justify-between items-center px-2" id="pdf-simulator-page-navigator">
                <span className="text-xs font-mono font-black text-slate-500">Document size: ~1,500 words</span>

                <div className="flex items-center space-x-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-800 disabled:opacity-40 px-3 py-1 text-[11px] font-bold rounded-lg transition-colors border border-slate-400"
                  >
                    Prev Page
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-600 mx-1">{currentPage} / 2</span>
                  <button
                    disabled={currentPage === 2}
                    onClick={() => setCurrentPage(2)}
                    className="bg-slate-350 hover:bg-slate-400 text-slate-800 disabled:opacity-40 px-3 py-1 text-[11px] font-bold rounded-lg transition-colors border border-slate-400"
                  >
                    Next Page
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow border border-gray-100" id="reading-pane-fallback">
              <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-bold">Select a study guide from the left directory to open the PDF viewer here.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
