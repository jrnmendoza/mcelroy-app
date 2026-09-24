import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function ArticleViewer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const pageParam = searchParams.get('page');
  const returnUrl = searchParams.get('return') || '/';
  
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (pageParam) {
      setPageNumber(parseInt(pageParam, 10));
    }
  }, [pageParam]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200">
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shadow-md z-10 sticky top-0">
        <button 
          onClick={() => navigate(returnUrl)}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Tillbaka till granskningen</span>
          <span className="sm:hidden">Tillbaka</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            Sida {pageNumber} av {numPages || '--'}
          </div>
          
          <div className="flex bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
            <button onClick={zoomOut} className="p-2 hover:bg-slate-600 transition-colors" title="Zooma ut">
              <ZoomOut size={18} />
            </button>
            <div className="px-2 py-2 text-xs font-semibold bg-slate-800 w-12 text-center flex items-center justify-center">
              {Math.round(scale * 100)}%
            </div>
            <button onClick={zoomIn} className="p-2 hover:bg-slate-600 transition-colors" title="Zooma in">
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-slate-900 flex justify-center p-4 sm:p-8">
        <Document 
          file={`${import.meta.env.BASE_URL}mcelroy2023.pdf`} 
          onLoadSuccess={onDocumentLoadSuccess}
          className="shadow-2xl rounded-sm"
          loading={
            <div className="flex h-64 items-center justify-center text-slate-400">
              Laddar PDF...
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="rounded-sm overflow-hidden"
          />
        </Document>
      </div>
      
      <div className="bg-slate-800 border-t border-slate-700 p-3 flex justify-center gap-4">
        <button 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
        >
          Föregående sida
        </button>
        <button 
          disabled={numPages === 0 || pageNumber >= numPages}
          onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
        >
          Nästa sida
        </button>
      </div>
    </div>
  );
}
