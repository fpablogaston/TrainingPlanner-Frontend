import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
 
export function VideoDialog({ open, onOpenChange, videoUrl }) {
  // Convertir URL de YouTube a formato embed si es necesario
  const getEmbedUrl = (url) => {
    if (!url) return '';
 
    // Si ya es una URL embed, retornarla
    if (url.includes('embed')) return url;
 
    // Convertir URLs de YouTube estándar a embed
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = url.match(youtubeRegex);
 
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
 
    return url;
  };
 
  const embedUrl = getEmbedUrl(videoUrl);
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Video Demostrativo</DialogTitle>
          <DialogDescription>
            Observa la técnica correcta para realizar este ejercicio.
          </DialogDescription>
        </DialogHeader>
 
        <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="Video del ejercicio"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No hay video disponible para este ejercicio
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}