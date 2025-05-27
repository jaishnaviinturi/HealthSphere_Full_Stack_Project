export interface Reminder {
    pill_name: string;
    frequency: number;
    times: string[];
    days: number[];
  }
  
  export interface ReminderFormData {
    phone: string;
    reminder: Reminder;
  }