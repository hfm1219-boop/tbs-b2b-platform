import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  ChevronRight, 
  Search, 
  Filter, 
  X,
  MessageSquare,
  ArrowLeft,
  Calendar,
  DollarSign,
  Plus,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ProviderPriceImportBatch, 
  ProviderPriceImportRow, 
  ProviderPriceImportStatus,
  ProviderPriceImportRowStatus
} from '../../types';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ProviderPriceImportPageProps {
  currentUser: User | null;
  existingBatches: ProviderPriceImportBatch[];
  onBackToProviderDashboard: () => void;
  onSubmitPriceImport: (batch: ProviderPriceImportBatch) => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onCreateNotification?: (notification: any) => void;
}

export function ProviderPriceImportPage({
  currentUser,
  existingBatches: initialBatches,
  onBackToProviderDashboard,
  onSubmitPriceImport,
  onGoAdvisorChat,
  onCreateNotification
}: ProviderPriceImportPageProps) {
  const analytics = useAnalytics(currentUser);
  const [batches, setBatches] = useState<ProviderPriceImportBatch[]>(initialBatches);
  const [view, setView] = useState<'index' | 'import' | 'history' | 'detail' | 'success'>('index');
  const [selectedBatch, setSelectedBatch] = useState<ProviderPriceImportBatch | null>(null);
  
  // Import state
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<ProviderPriceImportRow[]>([]);
  const [importSummary, setImportSummary] = useState({
    total: 0,
    valid: 0,
    warnings: 0,
    errors: 0,
    effectiveFrom: ''
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [tabFilter, setTabFilter] = useState<'all' | 'valid' | 'warning' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const templateColumns = [
    'Nombre del producto',
    'SKU interno',
    'Código de barras',
    'Marca',
    'Categoría',
    'Presentación',
    'Embalaje',
    'Unidades por caja',
    'Costo base',
    'IVA %',
    'Impuesto al consumo',
    'Precio sugerido',
    'Precio mínimo autorizado',
    'Moneda',
    'Fecha efectiva',
    'Observaciones'
  ];

  const handleDownloadTemplate = () => {
    const csvContent = templateColumns.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla-importacion-precios-tbs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    analytics.track('provider_price_template_downloaded', 'provider');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      alert('En este prototipo se puede validar archivo CSV compatible con Excel. Descarga la plantilla, diligénciala y guárdala como CSV para importarla.');
      return;
    }

    setFile(selectedFile);
    processFile(selectedFile);
    
    analytics.track('provider_price_file_uploaded', 'provider', {
      metadata: {
        fileExtension: selectedFile.name.split('.').pop() || '',
        fileSizeRange: selectedFile.size < 1000000 ? '<1MB' : '>1MB'
      }
    });
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      // Basic CSV parsing (assuming simple comma, not handling quoted strings for this prototype)
      const rows: ProviderPriceImportRow[] = [];
      let valid = 0;
      let warnings = 0;
      let errors = 0;
      let earliestDate = '';

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const rowData: Partial<ProviderPriceImportRow> = {
          id: `row-${i}`,
          rowNumber: i + 1,
          productName: values[0] || '',
          internalSku: values[1] || '',
          barcode: values[2] || '',
          brandName: values[3] || '',
          category: values[4] || '',
          presentation: values[5] || '',
          packaging: values[6] || '',
          unitsPerPackage: parseInt(values[7]) || 0,
          baseCost: parseFloat(values[8]) || 0,
          taxRate: parseFloat(values[9]) || 0,
          exciseTax: parseFloat(values[10]) || 0,
          suggestedPrice: parseFloat(values[11]) || 0,
          minimumPrice: parseFloat(values[12]) || 0,
          currency: (values[13] as any) === 'USD' ? 'USD' : 'COP',
          effectiveFrom: values[14] || '',
          notes: values[15] || '',
          errors: [],
          warnings: []
        };

        // VALDATIONS
        if (!rowData.productName) rowData.errors?.push('Nombre del producto es obligatorio');
        if (!rowData.barcode) rowData.errors?.push('Código de barras es obligatorio');
        if (!rowData.brandName) rowData.errors?.push('Marca es obligatoria');
        if (!rowData.category) rowData.errors?.push('Categoría es obligatoria');
        if (!rowData.presentation) rowData.errors?.push('Presentación es obligatoria');
        if (!rowData.packaging) rowData.errors?.push('Embalaje es obligatorio');
        if (!rowData.unitsPerPackage || rowData.unitsPerPackage <= 0) rowData.errors?.push('Unidades por caja debe ser mayor a 0');
        if (!rowData.baseCost || rowData.baseCost <= 0) rowData.errors?.push('Costo base debe ser mayor a 0');
        if (rowData.taxRate === undefined || rowData.taxRate < 0 || rowData.taxRate > 100) rowData.errors?.push('IVA % debe estar entre 0 y 100');
        if (!rowData.effectiveFrom) rowData.errors?.push('Fecha efectiva es obligatoria');
        
        // Date validation (15 days rule)
        if (rowData.effectiveFrom) {
          const effDate = new Date(rowData.effectiveFrom);
          const today = new Date();
          const diffTime = effDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (isNaN(effDate.getTime())) {
            rowData.errors?.push('Formato de fecha inválido (usar AAAA-MM-DD)');
          } else if (diffDays < 15) {
            rowData.errors?.push('La fecha efectiva debe ser mínimo con 15 días de anticipación');
          }

          if (!earliestDate || (effDate.getTime() < new Date(earliestDate).getTime())) {
            earliestDate = rowData.effectiveFrom;
          }
        }

        // Warnings
        if (rowData.suggestedPrice && rowData.baseCost && rowData.suggestedPrice < rowData.baseCost) {
          rowData.warnings?.push('El precio sugerido es menor al costo base');
        }
        if (rowData.minimumPrice && rowData.baseCost && rowData.minimumPrice < rowData.baseCost) {
          rowData.warnings?.push('El precio mínimo autorizado es menor al costo base');
        }

        // Status
        if (rowData.errors && rowData.errors.length > 0) {
          rowData.status = 'error';
          errors++;
        } else if (rowData.warnings && rowData.warnings.length > 0) {
          rowData.status = 'advertencia';
          warnings++;
          valid++;
        } else {
          rowData.status = 'valido';
          valid++;
        }

        rows.push(rowData as ProviderPriceImportRow);
      }

      setPreviewRows(rows);
      setImportSummary({
        total: rows.length,
        valid,
        warnings,
        errors,
        effectiveFrom: earliestDate
      });
      setIsProcessing(false);
      
      analytics.track('provider_price_import_validated', 'provider', {
        metadata: {
          totalRows: rows.length,
          validRows: valid,
          warningRows: warnings,
          errorRows: errors
        }
      });
    };
    reader.readAsText(file);
  };

  const handleSubmitImport = () => {
    if (!file || importSummary.errors > 0 || !disclaimerAccepted || importSummary.valid === 0) return;

    const newBatch: ProviderPriceImportBatch = {
      id: `price-batch-${Date.now()}`,
      batchNumber: `IMP-PRE-${Date.now().toString().slice(-6)}`,
      providerId: currentUser?.id || 'provider-demo',
      providerName: currentUser?.businessName || 'Proveedor Demo',
      brandName: previewRows[0]?.brandName || 'Marca Demo',
      fileName: file.name,
      createdAt: new Date().toISOString().split('T')[0],
      effectiveFrom: importSummary.effectiveFrom,
      status: 'enviado',
      totalRows: importSummary.total,
      validRows: importSummary.valid,
      warningRows: importSummary.warnings,
      errorRows: importSummary.errors,
      rows: previewRows,
      disclaimerAccepted: true,
      submittedAt: new Date().toISOString().split('T')[0]
    };

    onSubmitPriceImport(newBatch);
    setBatches(prev => [newBatch, ...prev]);
    setView('success');
    setSelectedBatch(newBatch);
    
    if (onCreateNotification) {
      onCreateNotification({
        type: "proveedor",
        title: "Actualización de precios enviada",
        message: "Tu solicitud de actualización de precios fue recibida y está pendiente de revisión por TBS.",
        priority: "media",
        actionTarget: "providerDashboard"
      });
    }

    // Analytics
    const effDate = new Date(importSummary.effectiveFrom);
    const today = new Date();
    const diffTime = effDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    analytics.track('provider_price_import_submitted', 'provider', {
      success: true,
      metadata: {
        totalRows: importSummary.total,
        validRows: importSummary.valid,
        warningRows: importSummary.warnings,
        effectiveDaysAhead: diffDays
      }
    });
  };

  const filteredPreviewRows = previewRows.filter(r => {
    let matchesTab = true;
    if (tabFilter === 'valid') matchesTab = r.status === 'valido';
    if (tabFilter === 'warning') matchesTab = r.status === 'advertencia';
    if (tabFilter === 'error') matchesTab = r.status === 'error';
    
    if (!matchesTab) return false;
    
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.productName.toLowerCase().includes(q) ||
      r.barcode.toLowerCase().includes(q) ||
      r.internalSku?.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Back button only if not in index index view */}
      {view !== 'index' && (
        <button 
          onClick={() => {
            if (view === 'success') {
              setView('index');
            } else {
              setView('index');
              // Reset if canceled import
              if (view === 'import') {
                setFile(null);
                setPreviewRows([]);
              }
            }
          }}
          className="flex items-center gap-2 text-gris hover:text-rojo font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Volver a opciones de portafolio
        </button>
      )}

      {view === 'index' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-texto">Importar precios</h2>
              <p className="text-sm font-medium text-gris">Descarga la plantilla, diligencia los precios de tus productos y envía la actualización para revisión de TBS.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setView('import')}
                className="bg-rojo text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-texto transition-all flex items-center gap-2 tbs-shadow"
              >
                <Plus size={16} /> Nueva importación
              </button>
              <button 
                onClick={() => setView('history')}
                className="bg-white border border-borde text-texto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <History size={16} /> Historial
              </button>
            </div>
          </div>

          {/* Policy Card */}
          <div className="bg-white rounded-[32px] border border-borde overflow-hidden transition-all hover:shadow-xl group">
            <div className="bg-[#303844] p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rojo rounded-lg">
                  <AlertCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-black">Política para actualización de precios</h3>
              </div>
              <p className="text-white/80 font-medium leading-relaxed max-w-3xl">
                Las actualizaciones de precios deben enviarse con mínimo <span className="text-white font-black underline underline-offset-4 decoration-rojo decoration-2">15 días de anticipación</span> a la fecha en la que la marca espera empezar a facturar con los nuevos valores. TBS revisará la información, validará impuestos, condiciones comerciales, vigencias y consistencia del portafolio antes de habilitar cualquier cambio.
              </p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "La importación no actualiza precios automáticamente.",
                "La solicitud queda enviada para revisión de TBS.",
                "Los cambios están sujetos a validación comercial, tributaria y operativa.",
                "Los precios deben enviarse antes de iniciar facturación con los nuevos valores.",
                "TBS puede solicitar correcciones antes de aprobar.",
                "No se deben enviar precios retroactivos sin autorización."
              ].map((point, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-rojo/10 flex items-center justify-center text-rojo shrink-0 mt-0.5">
                    <CheckCircle2 size={12} />
                  </div>
                  <p className="text-xs font-bold text-gris-oscuro leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-borde relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gris group-hover:bg-rojo transition-colors" />
              <div className="text-[40px] font-black text-gray-50 mb-4">01</div>
              <h4 className="text-lg font-black text-texto mb-2">Descarga</h4>
              <p className="text-xs font-medium text-gris mb-6">Obtén la plantilla oficial en formato compatible con Excel (.csv).</p>
              <button 
                onClick={handleDownloadTemplate}
                className="text-rojo font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline"
              >
                <Download size={14} /> Descargar plantilla
              </button>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-borde relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gris group-hover:bg-rojo transition-colors" />
              <div className="text-[40px] font-black text-gray-50 mb-4">02</div>
              <h4 className="text-lg font-black text-texto mb-2">Diligencia</h4>
              <p className="text-xs font-medium text-gris mb-6">Completa la información de tus productos siguiendo las reglas de validación.</p>
              <div className="text-[10px] font-black text-gris uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Usa columnas oficiales
              </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-borde relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gris group-hover:bg-rojo transition-colors" />
              <div className="text-[40px] font-black text-gray-50 mb-4">03</div>
              <h4 className="text-lg font-black text-texto mb-2">Carga</h4>
              <p className="text-xs font-medium text-gris mb-6">Sube el archivo y revisa la vista previa antes de enviar a TBS.</p>
              <button 
                onClick={() => setView('import')}
                className="text-rojo font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline"
              >
                <Upload size={14} /> Cargar archivo
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'import' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-texto">Cargar actualización</h2>
              <p className="text-sm font-medium text-gris">Paso 3: Carga tu archivo CSV y revisa los datos detectados.</p>
            </div>
          </div>

          {!file ? (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                   if (droppedFile.name.endsWith('.csv')) {
                     setFile(droppedFile);
                     processFile(droppedFile);
                   } else {
                     alert('Por favor carga un archivo CSV compatible con Excel.');
                   }
                }
              }}
              className="bg-white border-2 border-dashed border-borde p-20 rounded-[40px] flex flex-col items-center justify-center text-center hover:border-rojo/30 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-gray-50 text-gris group-hover:bg-rojo/10 group-hover:text-rojo rounded-full flex items-center justify-center mb-6 transition-colors">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-black text-texto mb-2">Arrastra tu archivo aquí</h3>
              <p className="text-sm font-medium text-gris max-w-sm mb-8">O haz clic para seleccionar un archivo CSV desde tu computadora.</p>
              <div className="flex gap-4">
                <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded text-gris uppercase tracking-widest">Formatos: .csv</span>
                <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded text-gris uppercase tracking-widest">Máximo: 5MB</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden" 
              />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Summary Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-borde shadow-sm">
                  <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Total filas</p>
                  <p className="text-2xl font-black text-texto">{importSummary.total}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-borde shadow-sm">
                  <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Filas Válidas</p>
                  <p className="text-2xl font-black text-green-600">{importSummary.valid}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-borde shadow-sm">
                  <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Con Advertencias</p>
                  <p className="text-2xl font-black text-orange-500">{importSummary.warnings}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-borde shadow-sm border-l-4 border-l-rojo">
                  <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Con Errores</p>
                  <p className="text-2xl font-black text-rojo">{importSummary.errors}</p>
                </div>
                <div className="bg-texto text-white p-6 rounded-3xl border border-borde shadow-sm">
                  <p className="text-[10px] font-black uppercase text-white/60 tracking-widest mb-2">Fecha Efectiva</p>
                  <p className="text-lg font-black">{importSummary.effectiveFrom || 'N/A'}</p>
                </div>
              </div>

              {/* Toolbar & Filters */}
              <div className="bg-white rounded-[32px] border border-borde overflow-hidden">
                <div className="p-6 border-b border-borde flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setTabFilter('all')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${tabFilter === 'all' ? 'bg-white text-texto shadow-sm' : 'text-gris hover:text-texto'}`}
                    >
                      Todas ({importSummary.total})
                    </button>
                    <button 
                      onClick={() => setTabFilter('valid')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${tabFilter === 'valid' ? 'bg-white text-green-600 shadow-sm' : 'text-gris hover:text-texto'}`}
                    >
                      Válidas ({importSummary.valid - importSummary.warnings})
                    </button>
                    <button 
                      onClick={() => setTabFilter('warning')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${tabFilter === 'warning' ? 'bg-white text-orange-500 shadow-sm' : 'text-gris hover:text-texto'}`}
                    >
                      Advertencias ({importSummary.warnings})
                    </button>
                    <button 
                      onClick={() => setTabFilter('error')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${tabFilter === 'error' ? 'bg-white text-rojo shadow-sm' : 'text-gris hover:text-texto'}`}
                    >
                      Errores ({importSummary.errors})
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gris" size={14} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar producto, EAN..."
                        className="pl-10 pr-4 py-2.5 bg-gray-50 border border-borde rounded-xl text-xs font-bold focus:border-rojo outline-none min-w-[240px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FBFCFD] sticky top-0 z-10">
                      <tr className="border-b border-borde">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris">Paso/Fila</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris">Producto</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris">EAN / SKU</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris">Marca / Cat.</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris text-right">Costo Base</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris text-center">IVA %</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris text-center">Efectiva</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris">Estado</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris">Observaciones</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gris text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredPreviewRows.map((row) => (
                        <tr key={row.id} className={`hover:bg-gray-50/50 transition-colors ${row.status === 'error' ? 'bg-rojo/[0.02]' : row.status === 'advertencia' ? 'bg-orange-50/30' : ''}`}>
                          <td className="px-6 py-4 text-[11px] font-mono font-bold text-gris">{row.rowNumber}</td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-black text-texto">{row.productName || 'SIN NOMBRE'}</div>
                            <div className="text-[10px] font-bold text-gris uppercase">{row.presentation}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-[11px] font-mono text-texto">{row.barcode}</div>
                            <div className="text-[10px] font-bold text-gris uppercase">{row.internalSku}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-[11px] font-black text-texto">{row.brandName}</div>
                            <div className="text-[10px] font-bold text-gris uppercase">{row.category}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-xs font-black text-texto">{formatCOP(row.baseCost)}</div>
                            <div className="text-[10px] font-bold text-gris">{row.currency}</div>
                          </td>
                          <td className="px-6 py-4 text-center text-xs font-black text-texto">{row.taxRate}%</td>
                          <td className="px-6 py-4 text-center text-[11px] font-black text-texto">{row.effectiveFrom}</td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-flex ${
                              row.status === 'valido' ? 'bg-green-50 text-green-600' : 
                              row.status === 'advertencia' ? 'bg-orange-50 text-orange-600' : 
                              'bg-rojo/10 text-rojo'
                            }`}>
                              {row.status === 'valido' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                              {row.status}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-[200px] space-y-1">
                              {row.errors.map((err, i) => (
                                <p key={i} className="text-[10px] font-bold text-rojo leading-tight">• {err}</p>
                              ))}
                              {row.warnings.map((warn, i) => (
                                <p key={i} className="text-[10px] font-bold text-orange-600 leading-tight">• {warn}</p>
                              ))}
                              {!row.errors.length && !row.warnings.length && (
                                <p className="text-[10px] font-medium text-gris italic">Sin observaciones</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => {
                                setPreviewRows(prev => prev.filter(r => r.id !== row.id));
                                setImportSummary(prev => {
                                  const wasValid = row.status !== 'error';
                                  const wasWarning = row.status === 'advertencia';
                                  const wasError = row.status === 'error';
                                  return {
                                    ...prev,
                                    total: prev.total - 1,
                                    valid: wasValid ? prev.valid - 1 : prev.valid,
                                    warnings: wasWarning ? prev.warnings - 1 : prev.warnings,
                                    errors: wasError ? prev.errors - 1 : prev.errors
                                  };
                                });
                              }}
                              className="text-gris/40 hover:text-rojo transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {previewRows.length === 0 && (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 text-gris/30 rounded-full flex items-center justify-center mb-4">
                      <FileText size={32} />
                    </div>
                    <p className="text-sm font-black text-texto">No se encontraron filas válidas</p>
                    <p className="text-xs font-medium text-gris mt-1">Sube un archivo CSV con la estructura correcta.</p>
                  </div>
                )}
              </div>

              {/* Submit Block */}
              <div className="bg-white p-8 rounded-[32px] border border-borde shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          checked={disclaimerAccepted}
                          onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-rojo focus:ring-rojo cursor-pointer"
                        />
                      </div>
                      <p className="text-sm font-bold text-gris-oscuro group-hover:text-texto transition-colors leading-relaxed">
                        He revisado la información cargada y entiendo que esta solicitud no actualiza precios automáticamente. También acepto que los cambios deben enviarse con mínimo 15 días de anticipación a la fecha efectiva de facturación, salvo autorización excepcional de TBS.
                      </p>
                    </label>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <button 
                      onClick={() => setFile(null)}
                      className="px-8 py-4 bg-white border-2 border-borde text-gris font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSubmitImport}
                      disabled={!disclaimerAccepted || importSummary.errors > 0 || importSummary.valid === 0}
                      className={`px-10 py-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 tbs-shadow ${
                        disclaimerAccepted && importSummary.errors === 0 && importSummary.valid > 0
                          ? 'bg-rojo text-white hover:scale-[1.02] active:scale-[0.98]' 
                          : 'bg-gray-200 text-gris cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Send size={18} /> Enviar actualización de precios
                    </button>
                  </div>
                </div>
                {importSummary.errors > 0 && (
                  <div className="mt-6 p-4 bg-rojo/5 border border-rojo/10 rounded-2xl flex gap-3">
                    <AlertCircle size={18} className="text-rojo shrink-0" />
                    <p className="text-xs font-bold text-rojo">Corrige los {importSummary.errors} errores encontrados en el archivo para poder enviar la solicitud.</p>
                  </div>
                )}
                {importSummary.valid > 0 && !disclaimerAccepted && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-800">
                    <Info size={18} className="shrink-0" />
                    <p className="text-xs font-bold">Debes aceptar la política comercial antes de enviar la solicitud.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Prototype Notices */}
          <div className="pt-10 border-t border-borde space-y-3">
            <p className="text-[10px] font-black text-gris uppercase tracking-widest italic opacity-60">Notas del prototipo:</p>
            <p className="text-[10px] font-bold text-gris-oscuro flex items-center gap-2">• Esta carga es una simulación. Los archivos no se envían a un servidor real.</p>
            <p className="text-[10px] font-bold text-gris-oscuro flex items-center gap-2">• En producción, los archivos serán validados por Odoo y el equipo TBS.</p>
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-texto">Historial de importaciones</h2>
              <p className="text-sm font-medium text-gris">Consulta el estado de tus solicitudes previas de actualización de precios.</p>
            </div>
            <button 
              onClick={() => setView('import')}
              className="bg-rojo text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-texto transition-all flex items-center gap-2 tbs-shadow"
            >
              <Plus size={16} /> Nueva importación
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-borde overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FBFCFD] border-b border-borde">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-gris"># Solicitud</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gris">Marca / Archivo</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gris text-center">Carga</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gris text-center">Efectiva</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gris">Estado</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-gris text-center">Filas (V/A/E)</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-gris text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6 text-sm font-black text-texto">{batch.batchNumber}</td>
                      <td className="px-6 py-6">
                        <div className="text-xs font-black text-texto group-hover:text-rojo transition-colors">{batch.brandName}</div>
                        <div className="text-[10px] font-bold text-gris uppercase truncate max-w-[200px]">{batch.fileName}</div>
                      </td>
                      <td className="px-6 py-6 text-center text-xs font-bold text-gris">{batch.createdAt}</td>
                      <td className="px-6 py-6 text-center text-xs font-black text-texto">{batch.effectiveFrom}</td>
                      <td className="px-6 py-6">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                          batch.status === 'enviado' ? 'bg-blue-50 text-blue-600' :
                          batch.status === 'validando' ? 'bg-yellow-50 text-yellow-600' :
                          batch.status === 'aprobado' ? 'bg-green-50 text-green-600' :
                          batch.status === 'rechazado' ? 'bg-rojo/10 text-rojo' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {batch.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-black text-green-600">{batch.validRows - batch.warningRows}</span>
                          <span className="text-gris text-[14px]">/</span>
                          <span className="text-xs font-black text-orange-500">{batch.warningRows}</span>
                          <span className="text-gris text-[14px]">/</span>
                          <span className="text-xs font-black text-rojo">{batch.errorRows}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                          <button 
                            onClick={() => {
                              setSelectedBatch(batch);
                              setView('detail');
                              analytics.track('provider_price_import_batch_viewed', 'provider', { target: batch.batchNumber });
                            }}
                            className="bg-gray-50 text-gris hover:bg-rojo hover:text-white p-2 rounded-lg transition-all"
                            title="Ver detalle"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => onGoAdvisorChat('precios_portafolio', { label: 'Solicitud Precios', value: batch.batchNumber })}
                            className="bg-gray-50 text-gris hover:bg-rojo hover:text-white p-2 rounded-lg transition-all"
                            title="Hablar con asesor"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {batches.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 text-gris/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <History size={32} />
                        </div>
                        <p className="text-sm font-black text-texto">No hay importaciones previas</p>
                        <p className="text-xs font-medium text-gris mt-1">Tus solicitudes de actualización de precios aparecerán aquí.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'detail' && selectedBatch && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-texto">Detalle de solicitud {selectedBatch.batchNumber}</h2>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  selectedBatch.status === 'enviado' ? 'bg-blue-50 text-blue-600' :
                  selectedBatch.status === 'aprobado' ? 'bg-green-50 text-green-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  {selectedBatch.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm font-medium text-gris">Cargado el {selectedBatch.createdAt} · {selectedBatch.totalRows} filas totales.</p>
            </div>
            <div className="flex gap-4">
               <button 
                onClick={() => onGoAdvisorChat('precios_portafolio', { label: 'Solicitud Precios', value: selectedBatch.batchNumber })}
                className="bg-texto text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rojo transition-all flex items-center gap-3 tbs-shadow"
              >
                <MessageSquare size={18} /> Hablar con ejecutivo TBS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-borde border-l-4 border-l-rojo">
              <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Marca</p>
              <p className="text-lg font-black text-texto">{selectedBatch.brandName}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-borde">
              <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Fecha Efectiva</p>
              <p className="text-lg font-black text-texto">{selectedBatch.effectiveFrom}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-borde">
              <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Filas Válidas</p>
              <p className="text-lg font-black text-green-600">{selectedBatch.validRows}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-borde">
              <p className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Archivo</p>
              <p className="text-lg font-black text-texto truncate" title={selectedBatch.fileName}>{selectedBatch.fileName}</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-borde overflow-hidden">
            <div className="p-6 border-b border-borde bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-black text-texto uppercase tracking-widest">Vista previa de lo enviado</h3>
              {selectedBatch.disclaimerAccepted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Política aceptada</span>
                </div>
              )}
            </div>
            <div className="overflow-x-auto max-h-[500px]">
               <table className="w-full text-left">
                 <thead className="bg-white border-b border-borde sticky top-0 z-10 font-bold">
                    <tr>
                      <th className="px-6 py-4 text-[10px] uppercase text-gris">#</th>
                      <th className="px-6 py-4 text-[10px] uppercase text-gris">Producto</th>
                      <th className="px-6 py-4 text-[10px] uppercase text-gris">Costo Base</th>
                      <th className="px-6 py-4 text-[10px] uppercase text-gris">IVA %</th>
                      <th className="px-6 py-4 text-[10px] uppercase text-gris">Sugerido</th>
                      <th className="px-6 py-4 text-[10px] uppercase text-gris">Estado</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {selectedBatch.rows.map(row => (
                      <tr key={row.id}>
                        <td className="px-6 py-4 text-[10px] font-bold text-gris">{row.rowNumber}</td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-black text-texto">{row.productName}</div>
                          <div className="text-[10px] font-bold text-gris uppercase">{row.barcode}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-black text-texto">{formatCOP(row.baseCost)}</td>
                        <td className="px-6 py-4 text-xs font-black text-texto">{row.taxRate}%</td>
                        <td className="px-6 py-4 text-xs font-black text-texto">{formatCOP(row.suggestedPrice || 0)}</td>
                        <td className="px-6 py-4">
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                             row.status === 'valido' ? 'bg-green-50 text-green-600' : 
                             row.status === 'advertencia' ? 'bg-orange-50 text-orange-600' : 
                             'bg-rojo/10 text-rojo'
                           }`}>
                             {row.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        </div>
      )}

      {view === 'success' && selectedBatch && (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto tbs-shadow"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          
          <div>
            <h2 className="text-3xl font-black text-texto mb-4 tracking-tighter">Actualización de precios enviada</h2>
            <p className="text-lg font-medium text-gris leading-relaxed">
              La solicitud <span className="text-texto font-black">{selectedBatch.batchNumber}</span> fue enviada para revisión de TBS. Los precios no quedan aplicados automáticamente.
            </p>
            <p className="text-sm font-medium text-gris mt-4">
              El equipo TBS validará la información y podrá solicitar ajustes antes de aprobar la actualización.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-borde divide-y divide-gray-100">
            {[
              { label: 'Número de solicitud', value: selectedBatch.batchNumber },
              { label: 'Marca', value: selectedBatch.brandName },
              { label: 'Archivo', value: selectedBatch.fileName },
              { label: 'Filas Válidas', value: selectedBatch.validRows, color: 'text-green-600' },
              { label: 'Fecha Efectiva', value: selectedBatch.effectiveFrom },
              { label: 'Estado', value: 'Enviado para revisión', color: 'text-blue-600' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-4 first:pt-0 last:pb-0">
                <span className="text-xs font-bold text-gris uppercase tracking-widest">{item.label}</span>
                <span className={`text-sm font-black ${item.color || 'text-texto'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setView('history')}
              className="w-full md:w-auto px-10 py-5 bg-white border-2 border-borde rounded-2xl font-black text-sm uppercase tracking-widest text-texto hover:bg-gray-50 transition-all"
            >
              Ver historial
            </button>
            <button 
              onClick={() => onBackToProviderDashboard()}
              className="w-full md:w-auto px-10 py-5 bg-texto text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rojo transition-all tbs-shadow"
            >
              Volver a portafolio
            </button>
          </div>

          <button 
            onClick={() => onGoAdvisorChat('precios_portafolio', { label: 'Importación Precios', value: selectedBatch.batchNumber })}
            className="text-gris hover:text-rojo font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            <MessageSquare size={16} /> Hablar con asesor TBS
          </button>
        </div>
      )}
    </div>
  );
}

function Send(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
