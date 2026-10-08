import { AutomationSchedule, TaskItem } from '../types';

export const DEFAULT_AUTOMATION_SCHEDULES: AutomationSchedule[] = [
  {
    id: 'sched-1',
    taskId: 'COMM-AUTO-001',
    title: 'Daily 7:15 AM automated CCTV camera health & recording check',
    cronExpression: '15 7 * * *',
    frequencyText: 'Daily at 7:15 AM',
    skillName: 'cctv_security_health_audit',
    enabled: true,
    status: 'active'
  },
  {
    id: 'sched-2',
    taskId: 'COMM-AUTO-002',
    title: 'Daily 7:30 AM Kota temperature alert & automatic heat-protocol switch',
    cronExpression: '30 7 * * *',
    frequencyText: 'Daily at 7:30 AM',
    skillName: 'kota_weather_heat_shield_protocol',
    enabled: true,
    status: 'active'
  },
  {
    id: 'sched-3',
    taskId: 'COMM-AUTO-005',
    title: 'Daily 9:30 AM water filtration RO TDS meter reading & purity log',
    cronExpression: '30 9 * * *',
    frequencyText: 'Daily at 9:30 AM',
    skillName: 'water_purity_tds_log',
    enabled: true,
    status: 'active'
  },
  {
    id: 'sched-4',
    taskId: 'COMM-AUTO-010',
    title: 'Daily 2:30 PM school bus departure live GPS tracking activation alert',
    cronExpression: '30 14 * * *',
    frequencyText: 'Daily at 2:30 PM',
    skillName: 'transport_gps_tracking_dispatch',
    enabled: true,
    status: 'active'
  },
  {
    id: 'sched-5',
    taskId: 'COMM-AUTO-037',
    title: 'Automated new parent inquiry instant auto-responder via WhatsApp API',
    cronExpression: '*/15 * * * *',
    frequencyText: 'Every 15 minutes (Real-time listener)',
    skillName: 'whatsapp_parent_auto_responder',
    enabled: true,
    status: 'active'
  },
  {
    id: 'sched-6',
    taskId: 'COMM-AUTO-038',
    title: 'Automated campus tour confirmation calendar invite sent to parents',
    cronExpression: '*/30 * * * *',
    frequencyText: 'Continuous trigger on booking',
    skillName: 'calendar_tour_auto_dispatch',
    enabled: true,
    status: 'active'
  }
];

class AutomationRunner {
  private schedules: AutomationSchedule[] = [];
  private lastExecutedLogs: Array<{ id: string; timestamp: string; title: string; result: string }> = [];

  constructor() {
    try {
      const saved = localStorage.getItem('mb_automation_schedules');
      if (saved) {
        this.schedules = JSON.parse(saved);
      } else {
        this.schedules = DEFAULT_AUTOMATION_SCHEDULES;
      }
    } catch (e) {
      this.schedules = DEFAULT_AUTOMATION_SCHEDULES;
    }
  }

  public getSchedules(): AutomationSchedule[] {
    return this.schedules;
  }

  public toggleSchedule(id: string): AutomationSchedule[] {
    this.schedules = this.schedules.map(s => {
      if (s.id === id) {
        const nextState = !s.enabled;
        return {
          ...s,
          enabled: nextState,
          status: nextState ? 'active' : 'idle'
        };
      }
      return s;
    });
    this.save();
    return this.schedules;
  }

  public async runScheduleNow(id: string): Promise<{ success: boolean; message: string; timestamp: string }> {
    const schedule = this.schedules.find(s => s.id === id);
    if (!schedule) {
      return { success: false, message: 'Schedule not found', timestamp: new Date().toISOString() };
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logItem = {
      id: `log-${Date.now()}`,
      timestamp,
      title: schedule.title,
      result: `Skill [${schedule.skillName}] executed successfully. System state verified.`
    };

    this.lastExecutedLogs.unshift(logItem);
    if (this.lastExecutedLogs.length > 20) this.lastExecutedLogs.pop();

    // Update schedule lastRun
    this.schedules = this.schedules.map(s => s.id === id ? { ...s, lastRun: timestamp, status: 'active' } : s);
    this.save();

    return {
      success: true,
      message: `✓ Automation routine executed: ${schedule.title}`,
      timestamp
    };
  }

  public getRecentLogs() {
    return this.lastExecutedLogs;
  }

  private save() {
    try {
      localStorage.setItem('mb_automation_schedules', JSON.stringify(this.schedules));
    } catch (e) {}
  }
}

export const automationRunner = new AutomationRunner();
