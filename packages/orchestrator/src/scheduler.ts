import cron from 'node-cron';
import { Logger } from 'pino';

import { Config } from './config';
import { ExplorationManager } from './exploration-manager';
import { BuybackExecutor } from './buyback-executor';

interface ScheduledTask {
  blockId: number;
  explorationIndex: bigint;
  type: 'finalize' | 'start_next';
  executeAt: number;
  timeoutId?: NodeJS.Timeout;
}

export class Scheduler {
  private explorationManager: ExplorationManager;
  private buybackExecutor: BuybackExecutor;
  private config: Config;
  private logger: Logger;
  private tasks: Map<string, ScheduledTask> = new Map();
  private cronJob: cron.ScheduledTask | null = null;

  constructor(
    explorationManager: ExplorationManager,
    buybackExecutor: BuybackExecutor,
    config: Config,
    logger: Logger
  ) {
    this.explorationManager = explorationManager;
    this.buybackExecutor = buybackExecutor;
    this.config = config;
    this.logger = logger.child({ component: 'Scheduler' });
  }

  async start(): Promise<void> {
    this.logger.info('Starting scheduler...');

    // Check every minute for tasks that need attention
    this.cronJob = cron.schedule('* * * * *', async () => {
      await this.checkAndExecuteTasks();
    });

    // Initial check of all blocks
    for (const block of this.config.blocks) {
      await this.checkBlockState(block.blockId);
    }

    this.logger.info('Scheduler started');
  }

  async stop(): Promise<void> {
    this.logger.info('Stopping scheduler...');
    
    if (this.cronJob) {
      this.cronJob.stop();
    }

    // Clear all scheduled tasks
    for (const [key, task] of this.tasks.entries()) {
      if (task.timeoutId) {
        clearTimeout(task.timeoutId);
      }
    }
    this.tasks.clear();
  }

  async checkBlockState(blockId: number): Promise<void> {
    try {
      const exploration = await this.explorationManager.getCurrentExploration(blockId);
      
      if (!exploration) {
        // No active exploration - start one
        this.logger.info({ blockId }, 'No active exploration, starting new one');
        await this.explorationManager.startExploration(blockId);
        return;
      }

      const now = Date.now() / 1000;

      // Check if we need to finalize
      if (exploration.status === 'active' && now >= exploration.activeEndTs) {
        this.scheduleTask({
          blockId,
          explorationIndex: exploration.explorationIndex,
          type: 'finalize',
          executeAt: Date.now(),
        });
      }
    } catch (error) {
      this.logger.error({ blockId, error }, 'Error checking block state');
    }
  }

  scheduleTask(task: ScheduledTask): void {
    const key = `${task.blockId}-${task.explorationIndex}-${task.type}`;
    
    if (this.tasks.has(key)) {
      this.logger.debug({ key }, 'Task already scheduled');
      return;
    }

    const delay = Math.max(0, task.executeAt - Date.now());
    
    const timeoutId = setTimeout(async () => {
      await this.executeTask(task);
      this.tasks.delete(key);
    }, delay);

    task.timeoutId = timeoutId;
    this.tasks.set(key, task);

    this.logger.info(
      { blockId: task.blockId, type: task.type, delay: Math.round(delay / 1000) },
      'Task scheduled'
    );
  }

  private async executeTask(task: ScheduledTask): Promise<void> {
    this.logger.info({ task }, 'Executing scheduled task');

    try {
      switch (task.type) {
        case 'finalize':
          await this.explorationManager.finalizeExploration(
            task.blockId,
            task.explorationIndex
          );
          break;
        case 'start_next':
          await this.explorationManager.startExploration(task.blockId);
          break;
      }
    } catch (error) {
      this.logger.error({ task, error }, 'Task execution failed');
    }
  }

  private async checkAndExecuteTasks(): Promise<void> {
    const now = Date.now();
    
    for (const [key, task] of this.tasks.entries()) {
      if (task.executeAt <= now && !task.timeoutId) {
        await this.executeTask(task);
        this.tasks.delete(key);
      }
    }
  }

  // Event handlers
  onExplorationStarted(data: any): void {
    const activeEndMs = Number(data.activeEndTs) * 1000;
    const cooldownEndMs = Number(data.cooldownEndTs) * 1000;

    // Schedule finalization after active phase
    this.scheduleTask({
      blockId: data.blockId,
      explorationIndex: BigInt(data.explorationIndex.toString()),
      type: 'finalize',
      executeAt: activeEndMs + 5000, // 5 second buffer
    });

    this.logger.info(
      { blockId: data.blockId, explorationIndex: data.explorationIndex.toString() },
      'Exploration started, finalization scheduled'
    );
  }

  onExplorationSettled(data: any): void {
    const blockId = data.blockId;

    // Schedule next exploration start after cooldown
    // In practice, you might want some buffer time
    this.scheduleTask({
      blockId,
      explorationIndex: BigInt(data.explorationIndex.toString()) + 1n,
      type: 'start_next',
      executeAt: Date.now() + 2400 * 1000 + 5000, // cooldown + buffer
    });

    this.logger.info(
      { blockId, winningRig: data.winningRig },
      'Exploration settled, next exploration scheduled'
    );
  }

  onExplorationRolledOver(data: any): void {
    // Similar to settled - schedule next exploration
    this.scheduleTask({
      blockId: data.blockId,
      explorationIndex: BigInt(data.explorationIndex.toString()) + 1n,
      type: 'start_next',
      executeAt: Date.now() + 2400 * 1000 + 5000,
    });

    this.logger.info(
      { blockId: data.blockId, totalDeposits: data.totalDeposits.toString() },
      'Exploration rolled over, next exploration scheduled'
    );
  }
}
