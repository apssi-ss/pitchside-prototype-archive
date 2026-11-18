import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Btn } from "@/components/kit";

/** Camera QR scanner. Calls onScan once per distinct code (same code ignored for 3s). */
export function QrScanner({ onScan, disabled }: { onScan: (text: string) => void; disabled?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;
    let last = { text: "", at: 0 };

    (async () => {
      try {
        const { default: jsQR } = await import("jsqr");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        const video = videoRef.current;
        if (!video || stopped) return;
        video.srcObject = stream;
        await video.play();
        const tick = () => {
          if (stopped) return;
          const canvas = canvasRef.current;
          if (canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const w = video.videoWidth;
            const h = video.videoHeight;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, w, h);
              const img = ctx.getImageData(0, 0, w, h);
              const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
              const now = Date.now();
              if (code?.data && (code.data !== last.text || now - last.at > 3000)) {
                last = { text: code.data, at: now };
                onScanRef.current(code.data);
              }
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setError("Kamera tidak dapat dibuka. Izinkan akses kamera atau gunakan input manual.");
        setActive(false);
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-pitch-deep">
        <video
          ref={videoRef}
          className={active ? "h-full w-full object-cover" : "hidden"}
          muted
          playsInline
        />
        {!active && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-pitch-foreground/80">
            <CameraOff className="h-8 w-8" />
            <p className="text-sm">Kamera belum aktif</p>
          </div>
        )}
        {active && (
          <div
            className="pointer-events-none absolute inset-[18%] rounded-2xl border-2 border-signal"
            aria-hidden
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <Btn
        className="mt-3 w-full"
        variant={active ? "outline" : "signal"}
        disabled={disabled}
        onClick={() => {
          setError(null);
          setActive((a) => !a);
        }}
      >
        {active ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {active ? "Matikan kamera" : "Mulai pindai QR"}
      </Btn>
    </div>
  );
}
