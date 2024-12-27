import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router';
import io, { Socket } from 'socket.io-client';

function useSocket({ deploymentId }: { deploymentId: string }) {
  const [logs, setLogs] = useState<string[]>([]);
  //   const navigate = useNavigate();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io('http://localhost:9001', {
      reconnectionAttempts: 10000,
      timeout: 1000,
    });
  }, []);

  useEffect(() => {
    socket.current?.emit('subscribe_logs', deploymentId);

    socket.current?.on('log', (data) => {
      setLogs((prevLogs) => [...prevLogs, data]);
      console.log(data);
    });

    socket.current?.on('deployment_success', () => {
      //   navigate(`/projects/success`);
    });

    return () => {
      socket.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { logs };
}

export default useSocket;
