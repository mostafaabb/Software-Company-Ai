"use client";

import * as React from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {}
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-xs">
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
          <ScrollArea className="h-80">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="mb-2 h-8 w-8 opacity-30" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className={`w-full text-left p-3 transition-colors hover:bg-accent/50 ${
                      !n.read ? "bg-accent/30" : ""
                    }`}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.link) window.location.href = n.link;
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
