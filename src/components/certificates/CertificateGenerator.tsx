import React from 'react';
import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  studentName: string;
  experimentName: string;
  completionDate: string;
  score: number;
  onDownload?: () => void;
}

export function CertificateGenerator({
  studentName,
  experimentName,
  completionDate,
  score,
  onDownload
}: CertificateProps) {
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      // Create canvas from the certificate div
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      // Convert to PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Download PDF
      pdf.save(`${experimentName.replace(/\s+/g, '_')}_Certificate.pdf`);

      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="bg-white rounded-lg shadow-lg p-12 max-w-4xl mx-auto relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <Award className="h-16 w-16 text-blue-600 mx-auto" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Certificate of Completion
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            This is to certify that
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            {studentName}
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            has successfully completed the experiment
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {experimentName}
          </h3>

          <div className="flex justify-center items-center gap-8 mb-8">
            <div>
              <p className="text-gray-600">Completion Date</p>
              <p className="text-lg font-semibold">{completionDate}</p>
            </div>
            <div>
              <p className="text-gray-600">Score Achieved</p>
              <p className="text-lg font-semibold">{score}%</p>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-gray-500">
              Virtual Lab - Fluid Mechanics Experiments
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={downloadCertificate}
        className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download className="h-5 w-5" />
        Download Certificate
      </motion.button>
    </div>
  );
} 