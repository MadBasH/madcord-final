"use client";

import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // URL'i dinamik olarak al (localhost:3000 mi, yoksa başka bir yer mi?)
    // Bu yöntem process.env hatalarını tamamen ortadan kaldırır.
    const url = window.location.origin;

    const socketInstance = new (ClientIO as any)(url, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      // Polling'i başa alıyoruz, websocket'e upgrade etsin.
      // Bu sıra Next.js dev server için daha sağlıklıdır.
      transports: ["polling", "websocket"], 
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ SOCKET KOPTU");
      setIsConnected(false);
    });
    
    socketInstance.on("connect_error", (err: any) => {
      // Tarayıcı konsolunda (F12) bu hatayı görürsen bana söylemelisin
      console.log("⚠️ BAĞLANTI HATASI:", err); 
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}