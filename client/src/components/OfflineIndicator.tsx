import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline message if starting offline
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide online message after 3 seconds
  useEffect(() => {
    if (isOnline && !showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <Card className={`fixed top-4 left-4 right-4 z-50 shadow-lg ${
      isOnline ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'
    }`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-orange-600" />
          )}
          <div>
            <p className={`font-medium text-sm ${
              isOnline ? 'text-green-800' : 'text-orange-800'
            }`}>
              {isOnline ? 'متصل بالإنترنت' : 'غير متصل بالإنترنت'}
            </p>
            <p className={`text-xs ${
              isOnline ? 'text-green-600' : 'text-orange-600'
            }`}>
              {isOnline 
                ? 'تم استعادة الاتصال بالإنترنت' 
                : 'يمكنك الاستمرار في استخدام التطبيق'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}