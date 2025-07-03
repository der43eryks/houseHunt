class AdminEventStream {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners = new Map<string, Function[]>();

  connect() {
    try {
      const API_BASE_URL = 'http://localhost:4002/api';
      // No token, rely on cookies for authentication
      this.eventSource = new EventSource(`${API_BASE_URL}/stream/admin/stream`, { withCredentials: true });

      this.eventSource.onopen = () => {
        console.log('Admin SSE connection established');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Admin SSE connection error:', error);
        this.reconnect();
      };

    } catch (error) {
      console.error('Failed to create admin SSE connection:', error);
    }
  }

  handleMessage(data: any) {
    switch (data.type) {
      case 'new_inquiry':
        this.notifyListeners('new_inquiry', data.data);
        this.showNotification('New Inquiry', 'You have a new property inquiry.');
        break;
        
      case 'notification':
        this.notifyListeners('notification', data.data);
        this.showNotification('Notification', data.data.message);
        break;
        
      case 'heartbeat':
        // Keep connection alive
        break;
        
      default:
        console.log('Unknown admin SSE message type:', data.type);
    }
  }

  addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  removeListener(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in admin event listener:', error);
        }
      });
    }
  }

  showNotification(title: string, message: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.disconnect();
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const adminEventStream = new AdminEventStream(); 