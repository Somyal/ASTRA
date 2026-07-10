export interface IAnalyticsService {
  getStats(): Record<string, unknown>;
  getDailyTotals(): unknown[];
}

export class AnalyticsService implements IAnalyticsService {
  getStats(): Record<string, unknown> {
    // Placeholder - no business logic implemented in Milestone 1.2
    return {};
  }

  getDailyTotals(): unknown[] {
    // Placeholder
    return [];
  }
}
