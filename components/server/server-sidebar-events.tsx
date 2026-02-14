"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/providers/socket-provider";

interface ServerSidebarEventsProps {
  serverId: string;
}

export const ServerSidebarEvents = ({
  serverId
}: ServerSidebarEventsProps) => {
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const memberEventKey = `server:${serverId}:members`;
    const channelEventKey = `server:${serverId}:channels`;

    const handleMemberUpdate = (data: any) => {

       router.refresh();
    };

    const handleChannelUpdate = (data: any) => {

       router.refresh();
    };

    socket.on(memberEventKey, handleMemberUpdate);
    socket.on(channelEventKey, handleChannelUpdate);

    return () => {
      socket.off(memberEventKey, handleMemberUpdate);
      socket.off(channelEventKey, handleChannelUpdate);
    }
  }, [socket, router, serverId, isConnected]);

  return null;
}