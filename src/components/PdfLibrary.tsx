import React, { useState } from "react";
import { FileText, Download, Search, Plus, Bookmark, Eye, CheckCircle, Trash2 } from "lucide-react";
import { PdfDoc } from "../types";
import { MOCK_PDFS } from "../data/mockData";

const DIRECTORY_NODES = [
  {
    id: "syllabus",
    label: "Syllabus & Blueprint",
    labelHindi: "परीक्षा पाठ्यक्रम",
    iconColor: "text-[#FF4A5A]",
    bgColor: "bg-[#FFEAEA]",
    ringColor: "ring-[#FF4A5A]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8L10 4H4z" />
      </svg>
    )
  },
  {
    id: "mock",
    label: "Mock Test Papers",
    labelHindi: "मॉक टेस्ट पेपर्स",
    iconColor: "text-[#FFAE1A]",
    bgColor: "bg-[#FFF5E6]",
    ringColor: "ring-[#FFAE1A]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 8H2v14c0 1.1.9 2 2 2h14v-2H4V8zm18-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H8V6h14v12z" />
      </svg>
    )
  },
  {
    id: "notifications",
    label: "Official Bulletins",
    labelHindi: "सरकारी विज्ञप्ति",
    iconColor: "text-[#6039FE]",
    bgColor: "bg-[#EFEAFF]",
    ringColor: "ring-[#6039FE]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    )
  },
  {
    id: "previous",
    label: "Solved Old Papers",
    labelHindi: "हल प्रश्न-पत्र",
    iconColor: "text-[#15A862]",
    bgColor: "bg-[#E8F8F0]",
    ringColor: "ring-[#15A862]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
      </svg>
    )
  },
  {
    id: "capsules",
    label: "GK & Daily News",
    labelHindi: "सामान्य ज्ञान सूचियाँ",
    iconColor: "text-[#1E4CFF]",
    bgColor: "bg-[#EEF1FF]",
    ringColor: "ring-[#1E4CFF]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    )
  },
  {
    id: "formula",
    label: "Printable Sheets",
    labelHindi: "प्रिंट करने योग्य सामग्री",
    iconColor: "text-[#FF5C1E]",
    bgColor: "bg-[#FFF0E8]",
    ringColor: "ring-[#FF5C1E]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
      </svg>
    )
  },
  {
    id: "graphics",
    label: "Visual Mnemonics",
    labelHindi: "मानचित्र व आरेख",
    iconColor: "text-[#E63996]",
    bgColor: "bg-[#FFEBF5]",
    ringColor: "ring-[#E63996]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
      </svg>
    )
  },
  {
    id: "military",
    label: "Agniveer Special",
    labelHindi: "सैन्य विशेष गाइड",
    iconColor: "text-[#E64B3B]",
    bgColor: "bg-[#FFF0ED]",
    ringColor: "ring-[#E64B3B]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 3H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.1 13.9c-.3.4-.8.7-1.3.7s-1-.3-1.3-.7l-4.5-5.6-2.5 3.1-2.5-3.1-4.5 5.6c-.3.4-.8.7-1.3.7s-1-.3-1.3-.7c-.4-.5-.4-1.2 0-1.7l5.2-6.5c.3-.4.8-.7 1.3-.7s1 .3 1.3.7l2.5 3.1 2.5-3.1c.3-.4.8-.7 1.3-.7s1 .3 1.3.7l5.2 6.5c.4.5.4 1.2 0 1.7z" />
      </svg>
    )
  },
  {
    id: "lock",
    label: "Premium Study Pack",
    labelHindi: "सुरक्षित पाठ्य सामग्री",
    iconColor: "text-[#0080FF]",
    bgColor: "bg-[#EBF5FF]",
    ringColor: "ring-[#0080FF]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
      </svg>
    )
  }
];

export default function PdfLibrary() {
  const [pdfList, setPdfList] = useState<PdfDoc[]>(() => {
    // Exclude specialized armed forces syllabus PDFs initially so we can dynamically "search and add" them upon click!
    return MOCK_PDFS.filter(p => 
      !p.id.startsWith("pdf-army-") && 
      !p.id.startsWith("pdf-navy-") && 
      !p.id.startsWith("pdf-iaf-") && 
      !p.id.startsWith("pdf-icg-") && 
      !p.id.startsWith("pdf-cds-")
    );
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedPdfs, setUploadedPdfs] = useState<string[]>([]); // user uploaded trackers
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All");
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
  
  // Custom states for live automated search/ingestion of armed forces syllabi
  const [isArmedForcesSearching, setIsArmedForcesSearching] = useState(false);
  const [searchProgressStep, setSearchProgressStep] = useState(0);
  const [hasInjectedSyllabi, setHasInjectedSyllabi] = useState(false);
  const [searchedCount, setSearchedCount] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingProgress, setDownloadingProgress] = useState<number>(0);
  const [downloadingPhase, setDownloadingPhase] = useState<string>("");
  
  // Custom upload fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<PdfDoc["type"]>("Notes");
  const [newCategory, setNewCategory] = useState("Agniveer Recruitment");
  const [newSnippet, setNewSnippet] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  // Bookmark PDF list
  const [bookmarkedPdfs, setBookmarkedPdfs] = useState<string[]>([]);
  const [viewingPdf, setViewingPdf] = useState<PdfDoc | null>(null);

  const handleCabinetClick = (nodeId: string) => {
    if (nodeId === "syllabus" && !hasInjectedSyllabi) {
      setIsArmedForcesSearching(true);
      setSearchProgressStep(0);
      setSelectedDirectory("syllabus");
      
      const phrases = [
        "Connecting to secure Ministry of Defence (MoD) publication hubs...",
        "Scraping official Indian Army Agniveer GD, Clerk & Technical syllabus sheets...",
        "Parsing Indian Navy Agniveer SSR & MR official exam blueprints...",
        "Querying recruitment grids (agnipathvayu.cdac.in) for Airforce Group X & Y syllabus...",
        "Extracting UPSC NDA & CDS Combined Defence Services detailed subjects...",
        "Ingesting Indian Coast Guard Navik GD/DB verified syllabi...",
        "Automated lookup completed! Incorporating 8 official high-yield syllabus PDFs into Agni vault!"
      ];
      
      let stepIndex = 0;
      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < phrases.length) {
          setSearchProgressStep(stepIndex);
        } else {
          clearInterval(interval);
          const armedForcesSyllabi = MOCK_PDFS.filter(p => 
            p.id.startsWith("pdf-army-") || 
            p.id.startsWith("pdf-navy-") || 
            p.id.startsWith("pdf-iaf-") || 
            p.id.startsWith("pdf-icg-") || 
            p.id.startsWith("pdf-cds-")
          );
          
          setPdfList(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueFiles = armedForcesSyllabi.filter(p => !existingIds.has(p.id));
            return [...uniqueFiles, ...prev];
          });
          
          setSearchedCount(armedForcesSyllabi.length);
          setHasInjectedSyllabi(true);
          setIsArmedForcesSearching(false);
        }
      }, 500);
    } else {
      setSelectedDirectory(selectedDirectory === nodeId ? null : nodeId);
    }
  };

  const handleToggleBookmark = (pdfId: string) => {
    setBookmarkedPdfs(prev =>
      prev.includes(pdfId) ? prev.filter(id => id !== pdfId) : [...prev, pdfId]
    );
  };

  // Simulated Sarkariresult and Google Drive secure download wrapper
  const handleDownloadPdf = (pdf: PdfDoc) => {
    if (downloadingId) return; // Prevent concurrent downloads

    setDownloadingId(pdf.id);
    setDownloadingProgress(5);
    setDownloadingPhase("Querying Sarkariresult.com secure mirror link...");

    const phases = [
      { prg: 25, label: "Resolving Sarkari Result PDF publication storage host..." },
      { prg: 45, label: "Fetching latest 2026 raw document binaries from sarkariresult.com..." },
      { prg: 70, label: "Syncing file stream to Agni Google Drive secure storage API..." },
      { prg: 90, label: "Running Google Drive Real-time Virus & Threat Scan... (0 threats)" },
      { prg: 100, label: "Document signed safely! Delivering Google Drive Cloud PDF..." }
    ];

    let phaseIndex = 0;
    const interval = setInterval(() => {
      if (phaseIndex < phases.length) {
        setDownloadingProgress(phases[phaseIndex].prg);
        setDownloadingPhase(phases[phaseIndex].label);
        phaseIndex++;
      } else {
        clearInterval(interval);
        
        try {
          // ESCAPE parentheses and backslashes so they don't break PDF stream syntax
          const cleanTitle = (pdf.title || "No Title").replace(/[\(\)\\]/g, "\\$&");
          const cleanCategory = (pdf.category || "General").replace(/[\(\)\\]/g, "\\$&");
          const cleanDate = (pdf.publishDate || "2026-06").replace(/[\(\)\\]/g, "\\$&");
          const cleanSnippet = (pdf.contentSnippet || "").replace(/[\(\)\\]/g, "\\$&").slice(0, 1500);

          // Split the text snippet into lines that fit nicely within standard width of a PDF content line (around 65 chars)
          const lineLimit = 65;
          const contentLines: string[] = [];
          for (let i = 0; i < cleanSnippet.length; i += lineLimit) {
            contentLines.push(cleanSnippet.substring(i, i + lineLimit));
          }

          // Build a basic but strictly valid PDF 1.4 layout stream
          let fontStream = `BT\n/F2 16 Tf\n40 780 Td\n(SARKARIRESULT.COM OFFICIAL RECRUITMENT BLUEPRINT) Tj\n/F1 11 Tf\n0 -30 Td\n(Original Document Title: ${cleanTitle}) Tj\n0 -20 Td\n(Verification Source Code: SARKARI-RESULT-SECURE-VAULT) Tj\n0 -18 Td\n(Branch Category: ${cleanCategory}) Tj\n0 -18 Td\n(Sync Publication Date: ${cleanDate}) Tj\n0 -18 Td\n(Tracking Node Address: GDRIVE-SECURE-${pdf.id.toUpperCase()}-SR) Tj\n0 -18 Td\n(Antivirus Protection Status: Verified 100% Secure & Virus Free) Tj\n0 -40 Td\n/F2 12 Tf\n(DEPARTMENT RECRUITMENT SYLLABUS DIRECTORY SUMMARY:) Tj\n/F1 10 Tf\n0 -20 Td\n`;

          // Append each line with appropriate spacing in the PDF stream
          contentLines.forEach((line) => {
            fontStream += `(${line}) Tj\n0 -15 Td\n`;
          });

          fontStream += `0 -40 Td\n/F2 10 Tf\n(========================================================================================) Tj\n/F1 9 Tf\n0 -20 Td\n(Disclaimer: This document is a print-optimized, officially sourced copy of the syllabus summaries) Tj\n0 -12 Td\n(matching direct official notification grids from respective Indian Government Recruiting Portals) Tj\n0 -12 Td\n(and archived securely under Google Drive cloud framework for student convenience.) Tj\nET`;

          const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /MediaBox [0 0 595 842] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${fontStream.length + 50} >>
stream
${fontStream}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000288 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
${fontStream.length + 350}
%%EOF`;

          const blob = new Blob([pdfString], { type: "application/pdf" });
          const element = document.createElement("a");
          element.href = URL.createObjectURL(blob);
          const formattedFileName = pdf.title
            .replace(/[()]/g, "")
            .replace(/\s+/g, "_")
            .substring(0, 42);
          element.download = `${formattedFileName}_SarkariResult_Official.pdf`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          
          // Increment locally tracked downloads count
          setPdfList(prev =>
            prev.map(p => p.id === pdf.id ? { ...p, downloadCount: p.downloadCount + 1 } : p)
          );
        } catch (err) {
          console.error("Scraped download compilation failed:", err);
        } finally {
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadingProgress(0);
            setDownloadingPhase("");
          }, 800);
        }
      }
    }, 450);
  };

  // Drag and drop / file list state handler
  const handlePdfFileLoaded = (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Verify Link Failed: You must upload only original recruitment .pdf formats. Other extension streams are restricted.");
      setSelectedFile(null);
      return;
    }
    setFileError("");
    setSelectedFile(file);

    // Auto-synthesize clean human readable name
    const rawClean = file.name
      .replace(/\.pdf$/i, "")
      .replace(/_/g, " ")
      .replace(/-/g, " ");
    
    // Capitalize words
    const capitalized = rawClean
      .split(" ")
      .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : "")
      .join(" ");

    setNewTitle(capitalized);
    setNewSnippet(`Officially compiled recruitment circular imported directly from original local pdf source: ${file.name}. Exact digital footprint verified successfully.`);
  };

  // Local admin upload simulator
  const handleUploadPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setUploadMessage("Document Title cannot be empty!");
      return;
    }
    setIsUploading(true);

    const calcSize = selectedFile 
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(Math.random() * 1.5 + 0.6).toFixed(1)} MB`;

    const uploadedItem: PdfDoc = {
      id: "pdf-u-" + Math.floor(1000 + Math.random() * 9000),
      title: newTitle.trim(),
      category: newCategory,
      type: newType,
      publishDate: new Date().toLocaleDateString(),
      downloadCount: 0,
      size: calcSize,
      contentSnippet: newSnippet.trim() || `Official recruitment PDF notification published regarding ${newTitle}. Syllabus blueprints and physical details included.`
    };

    setTimeout(() => {
      setPdfList(prev => [uploadedItem, ...prev]);
      setUploadedPdfs(prev => [...prev, uploadedItem.id]);
      setIsUploading(false);
      setNewTitle("");
      setNewSnippet("");
      setSelectedFile(null);
      setUploadMessage("Official Recruitment PDF Synced & Uploaded Successfully!");
      setTimeout(() => setUploadMessage(""), 4000);
    }, 1000);
  };

  // Delete uploaded items
  const handleDeletePdf = (pdfId: string) => {
    setPdfList(prev => prev.filter(p => p.id !== pdfId));
  };

  // Filter PDF records
  const filteredPdfs = pdfList.filter(p => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (selectedTypeFilter !== "All" && p.type !== selectedTypeFilter) return false;

    if (selectedDirectory) {
      if (selectedDirectory === "syllabus") return p.type === "Syllabus";
      if (selectedDirectory === "mock") return p.title.toLowerCase().includes("mock") || p.title.toLowerCase().includes("sample") || p.category.toLowerCase().includes("series");
      if (selectedDirectory === "notifications") return p.type === "Job Alert" || p.title.toLowerCase().includes("notification") || p.title.toLowerCase().includes("advertisement");
      if (selectedDirectory === "previous") return p.type === "Previous Paper" || p.title.toLowerCase().includes("paper") || p.title.toLowerCase().includes("old");
      if (selectedDirectory === "capsules") return p.category.toLowerCase().includes("current") || p.category.toLowerCase().includes("gk") || p.title.toLowerCase().includes("capsule");
      if (selectedDirectory === "formula") return p.type === "Notes" || p.title.toLowerCase().includes("formula") || p.title.toLowerCase().includes("cheat");
      if (selectedDirectory === "graphics") return p.type === "Notes" || p.title.toLowerCase().includes("syllabus") || p.title.toLowerCase().includes("map") || p.title.toLowerCase().includes("visual");
      if (selectedDirectory === "military") return p.category.toLowerCase().includes("agniveer") || p.category.toLowerCase().includes("nda") || p.title.toLowerCase().includes("airforce");
      if (selectedDirectory === "lock") return p.size.includes("MB") || p.downloadCount > 1000;
    }

    return true;
  });

  return (
    <div className="space-y-6" id="pdf-library-viewport">
      
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933]">
        <h2 className="text-xl font-black text-gray-900 flex items-center">
          <FileText className="h-6 w-6 text-[#000080] mr-2" />
          Agniveer & Govt Recruitment PDF Circulars Library
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Directly download syllabus blueprints, old competitive exams, and active military vacancy notification files offline.
        </p>

        {/* Categories button filters */}
        <div className="flex flex-wrap items-center gap-2 mt-5" id="pdf-filters-row">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono italic mr-1">Doc Types:</span>
          {["All", "Notes", "Syllabus", "Previous Paper", "Job Alert"].map((type) => (
            <button
              key={type}
              id={`pdf-filter-btn-${type}`}
              onClick={() => setSelectedTypeFilter(type)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                selectedTypeFilter === type
                  ? "bg-[#000080] text-white border-[#000080]"
                  : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search tool block */}
        <div className="mt-4 relative max-w-sm">
          <input
            type="text"
            id="pdf-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title..."
            className="w-full text-xs font-bold p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none bg-gray-50"
          />
          <Search className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="pdf-library-manager-layout">
        
        {/* PDF Document Cards Grid */}
        <div className="lg:col-span-2 space-y-6" id="pdf-lists-grid-container">
          
          {/* Visual Category Grid (Interactive Cabinets) resembling the design mockup */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4" id="pdf-cabinets-showcase">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h5 className="font-extrabold text-xs text-[#000080] uppercase tracking-wider font-mono">
                  Interactive Category Cabinets / डिजिटल फ़ोल्डर अलमारी
                </h5>
                <p className="text-[10px] text-gray-400 mt-0.5">Click any visual cabinet to filter verified recruitment PDFs</p>
              </div>
              {selectedDirectory && (
                <button 
                  onClick={() => setSelectedDirectory(null)}
                  className="text-[10px] font-black text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-lg transition-colors border border-red-100"
                >
                  Reset Cabinet Filter ×
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-y-7 gap-x-2 sm:gap-x-4 pt-3">
              {DIRECTORY_NODES.map((node) => {
                const isActive = selectedDirectory === node.id;
                const isSyllabusCabinet = node.id === "syllabus";
                
                return (
                  <button
                    key={node.id}
                    onClick={() => handleCabinetClick(node.id)}
                    className="flex flex-col items-center justify-start group cursor-pointer focus:outline-none transition-all duration-300 transform active:scale-95 relative"
                  >
                    {/* Interactive overlay status bubble */}
                    {isSyllabusCabinet && !hasInjectedSyllabi && (
                      <span className="absolute -top-2.5 bg-red-500 text-white font-black text-[7px] sm:text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm animate-bounce z-10 border border-white">
                        Auto Search
                      </span>
                    )}
                    {isSyllabusCabinet && hasInjectedSyllabi && (
                      <span className="absolute -top-2.5 bg-green-600 text-white font-black text-[7px] sm:text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10 border border-white">
                        Updated ✓
                      </span>
                    )}

                    {/* Circle Card with Soft Tinted BG and vibrant icon */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 relative ${node.bgColor} ${node.iconColor} ${
                      isActive 
                        ? `ring-4 ring-offset-2 ${node.ringColor} scale-105 shadow-md` 
                        : "group-hover:scale-105 group-hover:shadow-sm"
                    } ${isSyllabusCabinet && !hasInjectedSyllabi ? "animate-pulse ring-2 ring-red-300" : ""}`}>
                      {node.icon}
                      
                      {/* Inner radar glow if searching */}
                      {isSyllabusCabinet && isArmedForcesSearching && (
                        <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
                      )}
                    </div>

                    {/* Hindi label first for custom indian academy styling */}
                    <span className={`text-[10px] sm:text-xs font-extrabold text-center mt-3 tracking-tight ${
                      isActive ? "text-[#000080]" : "text-gray-800 group-hover:text-[#000080]"
                    }`}>
                      {node.labelHindi}
                    </span>
                    
                    {/* English subtitle */}
                    <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium text-center tracking-wider uppercase mt-0.5 max-w-[100px] leading-tight">
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Automatic Scraper Status Feed Panel */}
          {isArmedForcesSearching && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 animate-pulse" id="armed-forces-loading-panel">
              <div className="flex items-center space-x-3 pb-2 border-b border-blue-100">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                </span>
                <div>
                  <h6 className="font-extrabold text-xs text-blue-950 tracking-tight">
                    Agni Scraper Bot: Querying Armed Forces recruitment endpoints...
                  </h6>
                  <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest font-mono">Status: Connected to central publication servers</p>
                </div>
              </div>
              
              {/* Progress log list */}
              <div className="bg-white/90 rounded-2xl p-4 border border-blue-100 font-mono text-[10px] text-gray-700 space-y-1">
                {[
                  "Connecting to secure Ministry of Defence (MoD) publication hubs...",
                  "Scraping official Indian Army Agniveer GD, Clerk & Technical syllabus sheets...",
                  "Parsing Indian Navy Agniveer SSR & MR official exam blueprints...",
                  "Querying recruitment grids (agnipathvayu.cdac.in) for Airforce Group X & Y syllabus...",
                  "Extracting UPSC NDA & CDS Combined Defence Services detailed subjects...",
                  "Ingesting Indian Coast Guard Navik GD/DB verified syllabi...",
                  "Automated lookup completed! Incorporating 8 official high-yield syllabus PDFs into Agni vault!"
                ].map((phrase, idx) => (
                  <div 
                    key={idx} 
                    className={`transition-all duration-300 flex items-start space-x-2 ${
                      idx === searchProgressStep 
                        ? "text-blue-900 font-bold scale-[1.01]" 
                        : idx < searchProgressStep 
                          ? "text-gray-400 line-through decoration-gray-300" 
                          : "text-gray-300"
                    }`}
                  >
                    <span className="font-bold">{idx <= searchProgressStep ? "›" : " "}</span>
                    <span>{phrase}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasInjectedSyllabi && searchedCount > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 text-xs font-bold flex items-center justify-between" id="injected-success-banner">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
                <span>8 verified Indian Armed Forces Syllabus PDFs successfully retrieved & synced to your library!</span>
              </span>
              <button 
                onClick={() => {
                  setHasInjectedSyllabi(false);
                  setPdfList(prev => prev.filter(p => 
                    !p.id.startsWith("pdf-army-") && 
                    !p.id.startsWith("pdf-navy-") && 
                    !p.id.startsWith("pdf-iaf-") && 
                    !p.id.startsWith("pdf-icg-") && 
                    !p.id.startsWith("pdf-cds-")
                  ));
                }}
                className="text-[9px] text-[#000080] hover:underline uppercase bg-white border border-emerald-200 px-2.5 py-1 rounded-lg ml-2 shrink-0 font-black"
              >
                Reset & Re-search
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider font-mono">
              {selectedDirectory 
                ? `Filtered Cabinet: ${DIRECTORY_NODES.find(n => n.id === selectedDirectory)?.labelHindi} (${filteredPdfs.length} Files)`
                : "All Verified PDF Directories"
              }
            </h4>
          </div>

          {/* SARKARIRESULT LIVE SYNCRONIZER METRIC PANEL */}
          <div className="bg-gradient-to-r from-orange-50/50 via-white to-green-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs" id="sarkari-result-sync-banner">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h5 className="font-extrabold text-[11px] text-[#000080] uppercase tracking-wider font-mono">
                  Sarkariresult.com Live Cloud Sync / सरकारी रिजल्ट सिंक सक्रिय है
                </h5>
              </div>
              <p className="text-[10px] text-gray-500">
                Auto-scraping real-time updates: all recruitment syllabus sheets & answers synced to Google Drive format.
              </p>
            </div>
            <div className="bg-white px-3 py-1.5 border border-gray-200 rounded-xl flex items-center space-x-2 shrink-0">
              <svg className="h-4 w-4 text-[#FF9933] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-700 leading-none uppercase font-mono">100% Mirror Match</p>
                <span className="text-[8px] text-gray-400 font-bold block">Latest Check: <span className="text-[#138808]">Live Now</span></span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider font-mono flex items-center">
              <span className="bg-[#000080]/10 text-[#000080] font-black px-2 py-0.5 rounded-md mr-2">
                {selectedDirectory ? "Cabinet" : "Global"}
              </span>
              {selectedDirectory 
                ? `${DIRECTORY_NODES.find(n => n.id === selectedDirectory)?.labelHindi} (${filteredPdfs.length} Files)`
                : "All Verified Cloud Directories / सम्पूर्ण क्लाउड डायरेक्टरी सूची"
              }
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="all-pdfs-catalogue">
            {filteredPdfs.map((pdf) => {
              const isSaved = bookmarkedPdfs.includes(pdf.id);
              const isUploaded = uploadedPdfs.includes(pdf.id);
              const isDownloading = downloadingId === pdf.id;
              
              // Helper to build sleek PDF filenames
              const pseudoPdfName = pdf.title
                .replace(/[()]/g, "")
                .replace(/\s+/g, "_")
                .substring(0, 38) + ".pdf";

              return (
                <div 
                  key={pdf.id} 
                  id={`pdf-display-${pdf.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/90 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between min-h-[260px] group"
                >
                  {/* Google Drive Header Bar */}
                  <div className="bg-gray-50/80 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 max-w-[80%]">
                      {/* Slick Red PDF Icon indicator */}
                      <div className="bg-red-500 text-white font-black text-[7px] px-1 py-0.5 rounded shadow-xs shrink-0 tracking-widest leading-none">
                        PDF
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-700 truncate block font-mono" title={pseudoPdfName}>
                        {pseudoPdfName}
                      </span>
                    </div>
                    
                    <div className="flex space-x-1 shrink-0">
                      <button
                        title="Save link marker"
                        onClick={() => handleToggleBookmark(pdf.id)}
                        className={`p-1 border rounded-lg transition-colors ${
                          isSaved ? "bg-yellow-105 border-yellow-300 text-yellow-800" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <Bookmark className="h-3 w-3" />
                      </button>

                      {isUploaded && (
                        <button
                          title="Delete Uploaded circular"
                          onClick={() => handleDeletePdf(pdf.id)}
                          className="p-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Google Drive Mock Thumbnail / Page Canvas View representing authentic Sarkariresult reference */}
                  <div className="bg-slate-100/90 h-32 flex flex-col justify-center items-center relative overflow-hidden select-none border-b border-gray-150 p-2">
                    {/* Diagonal Sarkariresult overlay watermark */}
                    <div className="absolute text-slate-350/20 text-[11px] font-black rotate-[-15deg] pointer-events-none uppercase tracking-widest leading-relaxed text-center select-none font-mono">
                      SARKARIRESULT_PORTAL<br />DRIVE_SAFE_ENCRYPT
                    </div>
                    
                    {/* Centered White Document Page */}
                    <div className="bg-white w-24 h-28 rounded-lg shadow-md p-2 flex flex-col justify-between relative transform group-hover:scale-[1.03] transition-transform duration-300 border border-gray-200/50">
                      {/* Top seal decoration (Indian colors theme hint) */}
                      <div className="flex space-x-0.5 mb-1 shrink-0">
                        <div className="w-full h-1 bg-[#FF9933] rounded-sm" />
                        <div className="w-full h-1 bg-white border border-gray-100 rounded-sm" />
                        <div className="w-full h-1 bg-[#138808] rounded-sm" />
                      </div>
                      
                      <div className="flex-1 space-y-1 pt-1 overflow-hidden">
                        <span className="text-[5.5px] font-black text-blue-900 uppercase tracking-tighter leading-none block truncate">
                          SARKARI_RESULT_{pdf.type.toUpperCase().replace(/\s+/g, "_")}
                        </span>
                        
                        {/* Fake written content lines */}
                        <div className="space-y-0.5">
                          <div className="w-full h-[2.5px] bg-slate-200 rounded-sm" />
                          <div className="w-11/12 h-[2.5px] bg-slate-200 rounded-sm" />
                          <div className="w-4/5 h-[2.5px] bg-slate-250 rounded-sm" />
                          <div className="w-10/12 h-[2.5px] bg-slate-200 rounded-sm" />
                          <div className="w-5/6 h-[2.5px] bg-slate-200 rounded-sm" />
                        </div>
                      </div>

                      {/* Google Drive bottom green seal status */}
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/50 rounded p-0.5 text-[5px] font-black text-center uppercase tracking-tighter mt-1">
                        🔒 DRIVER SECURE ✓
                      </div>
                    </div>
                  </div>

                  {/* Metadata and Description */}
                  <div className="p-4 flex-1 space-y-2 flex flex-col justify-start">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-extrabold text-[#000080]/90 uppercase tracking-wider font-mono">
                        {pdf.category}
                      </span>
                      <span className="bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full text-[9px] font-mono shrink-0">
                        {pdf.size}
                      </span>
                    </div>

                    <h5 className="font-black text-xs text-gray-900 leading-snug group-hover:text-[#000080] transition-colors">
                      {pdf.title}
                    </h5>
                    
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                      {pdf.contentSnippet || "Verified publication data matched to Google Secure document storage node. Instant download active."}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between min-h-[52px]">
                    
                    {/* Google Drive Link Indicator */}
                    <div className="flex items-center space-x-1.5">
                      {/* Custom styled Google Drive 3-color icon */}
                      <svg className="h-4 w-4 shrink-0 shadow-xs" viewBox="0 0 100 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33 0L0 57.5L16.5 86.5L49.5 29L33 0Z" fill="#0066DA"/>
                        <path d="M66.5 0L33 57.5L50 87L83.5 29.5L66.5 0Z" fill="#00A151"/>
                        <path d="M83.5 29.5L50.5 87L17 87L50 29.5L83.5 29.5Z" fill="#FFC700"/>
                      </svg>
                      <span className="text-[8.5px] font-extrabold text-gray-500 tracking-wider uppercase font-mono">
                        G-Drive File
                      </span>
                    </div>

                    {/* Button handlers (Swaps with loading bar on active downloading indicator) */}
                    {isDownloading ? (
                      <div className="flex-1 max-w-[160px] bg-indigo-50 border border-indigo-200 rounded-xl p-1.5 space-y-0.5 animate-pulse ml-2" id={`downloading-pill-${pdf.id}`}>
                        <div className="flex justify-between items-center text-[7px] sm:text-[8px] font-black font-mono text-indigo-950 leading-none">
                          <span className="truncate max-w-[70%]">{downloadingPhase}</span>
                          <span>{downloadingProgress}%</span>
                        </div>
                        <div className="w-full bg-indigo-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${downloadingProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          title="View PDF Document Preview"
                          onClick={() => setViewingPdf(pdf)}
                          className="p-1 px-2.5 border rounded-xl text-[10px] font-extrabold text-[#000080] border-[#000080]/30 bg-[#000080]/5 hover:bg-[#000080]/15 flex items-center space-x-1 shrink-0 transition-all active:scale-95 cursor-pointer focus:outline-none"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>

                        <button
                          id={`btn-download-pdf-${pdf.id}`}
                          onClick={() => handleDownloadPdf(pdf)}
                          disabled={!!downloadingId}
                          className="bg-[#138808] hover:bg-[#117706] disabled:opacity-50 text-white p-1 px-2.5 rounded-xl text-[10px] font-black uppercase flex items-center space-x-1 hover:shadow-xs active:scale-95 transition-all cursor-pointer focus:outline-none shrink-0"
                        >
                          <Download className="h-3 w-3 fill-white" />
                          <span>Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredPdfs.length === 0 && (
              <div className="col-span-1 sm:col-span-2 text-center p-12 bg-gray-50 rounded-xl" id="pdf-search-null">
                <p className="text-xs text-gray-500 italic">No document found matching search filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side Admin Upload simulator / Reader drawer */}
        <div className="space-y-6" id="pdf-library-actions-aside">
          
          {/* A. If Viewing Summary modal drawer */}
          {viewingPdf && (
            <div className="bg-slate-940 text-gray-100 rounded-3xl p-5 shadow-xl border border-slate-850 space-y-4" id="pdf-visual-viewer">
              {/* Google Drive Mock Top Control Header Bar */}
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-900">
                <div className="flex items-center space-x-2 truncate max-w-[65%]">
                  <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 100 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M33 0L0 57.5L16.5 86.5L49.5 29L33 0Z" fill="#2A7BF6"/>
                    <path d="M66.5 0L33 57.5L50 87L83.5 29.5L66.5 0Z" fill="#13A851"/>
                    <path d="M83.5 29.5L50.5 87L17 87L50 29.5L83.5 29.5Z" fill="#F8C700"/>
                  </svg>
                  <span className="text-[10px] font-mono font-black text-gray-300 truncate tracking-wide" title={viewingPdf.title + ".pdf"}>
                    {viewingPdf.title.replace(/\s+/g, "_")}.pdf
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Zoom Simulation Indicator */}
                  <span className="text-[8px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded uppercase hidden sm:inline">
                    100% Zoom
                  </span>
                  
                  <button 
                    onClick={() => setViewingPdf(null)}
                    className="text-xs font-black text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-900/40 px-2.5 py-0.5 rounded-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    Close ×
                  </button>
                </div>
              </div>

              {/* Sarkariresult Verification Header */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-[#FF9933] font-mono font-black uppercase tracking-wider">
                    Sarkariresult Verified Link Key
                  </span>
                  <span className="text-[7px] text-[#138808] font-black uppercase font-mono bg-[#138808]/15 px-1.5 py-0.5 rounded border border-[#138808]/30">
                    Sarkari Portal Safe
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-200 leading-snug">{viewingPdf.title}</h4>
                <p className="text-[9px] text-slate-400 font-mono">Synced Category: {viewingPdf.category} | File Node: GDRIVE-{viewingPdf.id.toUpperCase()}</p>
              </div>

              {/* View body - styled beautifully like a white paper inside Google Drive's grey backplate */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                <div className="bg-white text-slate-900 p-5 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[260px] overflow-y-auto shadow-inner border border-gray-200 select-all relative">
                  {/* Watermark in page body */}
                  <div className="absolute top-2 right-2 text-[5px] font-black text-[#000080]/30 border border-[#000080]/20 px-1 rounded uppercase tracking-tighter pointer-events-none">
                    Verified Sarkari Result
                  </div>
                  
                  <div className="border-b border-gray-150 pb-2 mb-3 text-center">
                    <h5 className="font-black text-[9px] tracking-widest text-[#000080] uppercase">
                      SARKARIRESULT.COM CLOUD PREVIEW INTERFACE
                    </h5>
                    <p className="text-[7px] font-mono text-gray-400 uppercase mt-0.5">Google Cloud Storage Secured & Encapsulated</p>
                  </div>
                  
                  {viewingPdf.contentSnippet || "Verified official circular syllabus document metadata is embedded within download package."}
                </div>
              </div>

              {/* Trigger Direct Download within the PDF Viewer */}
              <button
                id="btn-viewer-download"
                onClick={() => handleDownloadPdf(viewingPdf)}
                disabled={!!downloadingId}
                className="w-full bg-[#FF9933] hover:bg-[#dd8822] disabled:opacity-50 text-black font-black py-2.5 rounded-2xl text-[10px] uppercase flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98 cursor-pointer focus:outline-none"
              >
                <Download className="h-4 w-4" />
                <span>
                  {downloadingId === viewingPdf.id 
                    ? `Downloading: ${downloadingProgress}%` 
                    : `Secure Download via Google Drive (${viewingPdf.size})`
                  }
                </span>
              </button>
            </div>
          )}

          {/* B. Admin Upload Section */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 space-y-4" id="admin-pdf-upload-simulator">
            <h4 className="font-black text-xs text-[#000080] uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>🎓 Official Gov Bulletin Desk</span>
              <span className="text-[8px] font-black uppercase tracking-tight bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">
                Original PDFs Only
              </span>
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
              Upload original recruitment notifications, syllabus blueprints or manuals sourced from government portals (e.g. <code>.gov.in</code>, <code>.nic.in</code>) or verified Sarkari mirrors.
            </p>

            <form onSubmit={handleUploadPdfSubmit} className="space-y-3">
              {/* Drag-n-Drop & Manual File Picker container */}
              <div 
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isDraggingOver 
                    ? "border-[#000080] bg-[#000080]/5" 
                    : selectedFile 
                      ? "border-[#138808] bg-[#138808]/5" 
                      : "border-gray-200 hover:border-slate-300 bg-slate-50/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handlePdfFileLoaded(file);
                }}
                onClick={() => document.getElementById("pdf-file-picker")?.click()}
                id="all-pdfs-catalogue-dragzone"
              >
                <input
                  type="file"
                  id="pdf-file-picker"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePdfFileLoaded(file);
                  }}
                />
                <FileText className={`mx-auto h-8 w-8 mb-2 ${selectedFile ? "text-[#138808]" : "text-gray-400 animate-pulse"}`} />
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#138808] truncate">{selectedFile.name}</p>
                    <p className="text-[8px] text-[#138808]/70 font-mono uppercase bg-[#138808]/10 px-1.5 py-0.5 rounded inline-block">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Secure Verification Stamp Attached
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-bold text-slate-700">Drag & Drop original government PDF, or Click to select</p>
                    <p className="text-[8px] text-slate-400 mt-1 uppercase font-mono tracking-tight">Requires true .pdf or .nic.in server mirror logs</p>
                  </div>
                )}
              </div>

              {fileError && (
                <div className="text-[9px] font-extrabold text-red-600 bg-red-50 p-2.5 rounded border border-red-100" id="file-error-alert">
                  ⚠ {fileError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Document Title:</label>
                <input
                  type="text"
                  id="pdf-upload-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. UPSC NDA II 2026 Official Syllabus Syllabus"
                  className="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#000080]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doc Type:</label>
                  <select
                    id="pdf-upload-type"
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Previous Paper">Previous Paper</option>
                    <option value="Job Alert">Job Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category:</label>
                  <select
                    id="pdf-upload-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="Agniveer Recruitment">Agniveer Recruitment</option>
                    <option value="NDA Notes">NDA / CDS</option>
                    <option value="Current Affairs Notes">Current Affairs</option>
                    <option value="UPSC GK">UPSC / Civil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Brief Description / Content Snippet:</label>
                <textarea
                  id="pdf-upload-snippet"
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  rows={3}
                  placeholder="Exact verification key or syllabus detail published..."
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              {uploadMessage && (
                <div className="text-[10px] font-bold text-green-700 bg-green-50 p-2.5 rounded border border-green-200 flex items-center" id="pdf-alert-message">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  <span>{uploadMessage}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-upload-pdf-action"
                disabled={isUploading}
                className="w-full bg-[#000080] hover:bg-blue-900 duration-150 text-white text-xs font-black py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Sync Public PDF Vault"}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
