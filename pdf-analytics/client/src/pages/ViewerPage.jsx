import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


// ViewerPage component to display the PDF and track user interactions
const ViewerPage = () => {
  const { shareToken } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [viewerId, setViewerId] = useState(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));

  const pageTimeAccumulator = useRef({});
  const pageStartTime = useRef(Date.now());
  const scrollDepth = useRef(0);
//using useEffect
  useEffect(() => {
    let id = localStorage.getItem('viewerId');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('viewerId', id);
    }
    setViewerId(id);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber > 0 && newPageNumber <= numPages) {
      const timeSpent = Date.now() - pageStartTime.current;
      pageTimeAccumulator.current[pageNumber] = (pageTimeAccumulator.current[pageNumber] || 0) + timeSpent;
      pageStartTime.current = Date.now();
      setPageNumber(newPageNumber);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight > clientHeight) {
      const depth = (scrollTop / (scrollHeight - clientHeight)) * 100;
      scrollDepth.current = Math.max(scrollDepth.current, depth);
    } else {
      scrollDepth.current = 100;
    }
  };

  const sendTrackingData = useCallback(() => {
    if (!viewerId) return;
    // Add time for the currently active page before creating the payload
    const timeSpentOnCurrentPage = Date.now() - pageStartTime.current;
    if (pageNumber) {
      pageTimeAccumulator.current[pageNumber] = (pageTimeAccumulator.current[pageNumber] || 0) + timeSpentOnCurrentPage;
    }
    pageStartTime.current = Date.now(); // Reset start time for the next interval

    const events = Object.keys(pageTimeAccumulator.current).map(page => ({
      page: parseInt(page),
      timeSpentMs: pageTimeAccumulator.current[page],
      scrollDepth: scrollDepth.current
    }));

    if (events.length > 0) {
      const payload = { shareToken, viewerId, sessionId, events };
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true, // Keep request alive even if tab is closed
      });
      
      // Clear accumulator after flushing
      pageTimeAccumulator.current = {};
      scrollDepth.current = 0; // Also reset scroll depth
    }
  }, [shareToken, viewerId, sessionId, pageNumber]);

  useEffect(() => {
    const interval = setInterval(sendTrackingData, 5000);
    window.addEventListener('beforeunload', sendTrackingData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', sendTrackingData);
      sendTrackingData(); // Final send on component unmount
    };
  }, [sendTrackingData]);
//
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <div onScroll={handleScroll} className="w-full max-w-4xl h-[calc(100vh-100px)] overflow-auto">
        <Document file={`/api/pdf/${shareToken}`} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card p-4 flex justify-center items-center shadow-lg">
        <button onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="px-4 py-2 font-bold text-white bg-primary rounded disabled:bg-gray-500">
          Previous
        </button>
        <p className="mx-4">Page {pageNumber} of {numPages}</p>
        <button onClick={() => changePage(1)} disabled={pageNumber >= numPages} className="px-4 py-2 font-bold text-white bg-primary rounded disabled:bg-gray-500">
          Next
        </button>
      </div>
    </div>
  );
};
// Export the ViewerPage component as default
export default ViewerPage;
