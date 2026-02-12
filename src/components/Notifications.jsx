import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Bell, BellRing, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    // In a real Supabase app, you would fetch from a 'notifications' table
    // For now, we'll simulate empty or mock notifications if the table doesn't exist
    // or implement a basic fetch if you have a notifications table.
    // Assuming a simple structure for now or returning empty to prevent errors.
    
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            // Table might not exist yet, just ignore
            return;
        }

        if (data) {
            setNotifications(data);
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        }
    } catch (e) {
        console.error("Error fetching notifications", e);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Optional: Realtime subscription could go here
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        fetchNotifications();
    } catch (e) {
        console.error("Error marking as read", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
        fetchNotifications();
    } catch (e) {
        console.error("Error marking all as read", e);
    }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
          {isOpen || unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleMarkAllAsRead}>Mark all as read</Button>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map(n => (
            <DropdownMenuItem key={n.id} className={`flex items-start gap-3 p-2 ${!n.is_read ? 'bg-primary/5' : ''}`} onSelect={(e) => { e.preventDefault(); if(!n.is_read) handleMarkAsRead(n.id)}}>
              <div className="mt-1">
                {!n.is_read ? <Badge variant="success" className="h-2 w-2 p-0" /> : <Mail className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">You have no new notifications.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;