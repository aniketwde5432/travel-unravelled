import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, X, Download } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export function DocumentHub() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const doc: Document = {
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          uploadedAt: new Date(),
        };
        setDocuments(prev => [...prev, doc]);
      });
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(docs => docs.filter(d => d.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Travel Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload documents
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Tickets, passports, visas, insurance
            </p>
          </label>
        </div>

        <AnimatePresence>
          {documents.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.uploadedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.url, '_blank')}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(doc.id)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
