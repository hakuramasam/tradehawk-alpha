import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';

export type PlanItem = { step: string; status: 'pending' | 'in_progress' | 'completed' };

let currentPlan: PlanItem[] = [];

export function getPlan(): PlanItem[] {
  return currentPlan;
}

export function resetPlan(): void {
  currentPlan = [];
}

export const planTool = tool({
  name: 'plan',
  description:
    'Record or update the multi-step plan for the current task. Send the full list every time. At most one step may be in_progress.',
  inputSchema: z.object({
    items: z
      .array(
        z.object({
          step: z.string().describe('Description of the step'),
          status: z.enum(['pending', 'in_progress', 'completed']),
        }),
      )
      .describe('The complete plan, in order'),
  }),
  execute: async ({ items }) => {
    const inProgress = items.filter((i) => i.status === 'in_progress').length;
    if (inProgress > 1) {
      return { error: `Only one step may be in_progress (got ${inProgress}).`, plan: currentPlan };
    }
    currentPlan = items as PlanItem[];
    return {
      plan: currentPlan,
      completed: currentPlan.filter((i) => i.status === 'completed').length,
      total: currentPlan.length,
    };
  },
});