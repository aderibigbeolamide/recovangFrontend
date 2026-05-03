import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X } from "lucide-react";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        scannerRef.current?.clear();
        onClose();
      },
      (error) => {
        // Silent error for scanning frames
      }
    );

    return () => {
      scannerRef.current?.clear().catch(e => console.warn("Failed to clear scanner", e));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-bordergray p-5">
          <div>
            <h3 className="text-lg font-extrabold text-charcoal">Scan Drop QR</h3>
            <p className="text-xs text-textgray">Position the collector's QR code within the frame</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-cream p-2 text-textgray hover:text-charcoal transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
            <div id="qr-reader" className="overflow-hidden rounded-2xl border-2 border-dashed border-bordergray bg-cream"></div>
            
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-mint/30 p-4 border border-mint">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">!</div>
                <p className="text-[11px] text-charcoal/80 leading-snug">
                    <b>Pro tip:</b> Hold the phone steady. If the lighting is poor, ask the collector to increase their screen brightness.
                </p>
            </div>
        </div>

        <div className="border-t border-bordergray p-5 text-center">
            <button onClick={onClose} className="btn-outline w-full">Cancel scanning</button>
        </div>
      </div>
    </div>
  );
}
