import { Connection, PublicKey, Logs } from '@solana/web3.js';
import { Logger } from 'pino';
import { BorshCoder, EventParser } from '@coral-xyz/anchor';

export interface ParsedEvent {
  name: string;
  data: any;
}

type EventCallback = (event: ParsedEvent) => void;

export class EventListener {
  private connection: Connection;
  private programId: PublicKey;
  private logger: Logger;
  private subscriptionId: number | null = null;
  private callback: EventCallback | null = null;

  constructor(connection: Connection, programId: PublicKey, logger: Logger) {
    this.connection = connection;
    this.programId = programId;
    this.logger = logger.child({ component: 'EventListener' });
  }

  async start(callback: EventCallback): Promise<void> {
    this.callback = callback;
    this.logger.info('Starting event listener...');

    this.subscriptionId = this.connection.onLogs(
      this.programId,
      (logs: Logs) => {
        this.processLogs(logs);
      },
      'confirmed'
    );

    this.logger.info({ subscriptionId: this.subscriptionId }, 'Event listener started');
  }

  async stop(): Promise<void> {
    if (this.subscriptionId !== null) {
      await this.connection.removeOnLogsListener(this.subscriptionId);
      this.subscriptionId = null;
      this.logger.info('Event listener stopped');
    }
  }

  private processLogs(logs: Logs): void {
    if (logs.err) {
      this.logger.warn({ signature: logs.signature, err: logs.err }, 'Transaction error');
      return;
    }

    // Parse events from logs
    // In production, you'd use the generated IDL with BorshCoder/EventParser
    // For now, we do simple log parsing
    
    for (const log of logs.logs) {
      if (log.startsWith('Program data:')) {
        try {
          // Extract base64 data after "Program data: "
          const base64Data = log.slice(14);
          const event = this.parseEventFromBase64(base64Data);
          
          if (event && this.callback) {
            this.callback(event);
          }
        } catch (error) {
          // Not all program data logs are events
          this.logger.debug({ log }, 'Could not parse log as event');
        }
      }

      // Also check for specific log patterns
      const eventMatch = this.matchLogPattern(log);
      if (eventMatch && this.callback) {
        this.callback(eventMatch);
      }
    }
  }

  private parseEventFromBase64(base64Data: string): ParsedEvent | null {
    // In production, use EventParser from Anchor with generated IDL
    // This is a simplified stub
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      // First 8 bytes are discriminator
      const discriminator = buffer.slice(0, 8);
      
      // Map discriminators to event names
      // These would be generated from the IDL
      const eventMap: Record<string, string> = {
        // Add discriminator mappings here
      };

      // For now, return null - real implementation needs IDL
      return null;
    } catch {
      return null;
    }
  }

  private matchLogPattern(log: string): ParsedEvent | null {
    // Simple pattern matching for common log messages
    // This is a fallback/debug mechanism
    
    const patterns: Array<{ pattern: RegExp; eventName: string; extractor: (match: RegExpMatchArray) => any }> = [
      {
        pattern: /Exploration (\d+) started for Block (\d+)/,
        eventName: 'ExplorationStarted',
        extractor: (match) => ({
          explorationIndex: parseInt(match[1]),
          blockId: parseInt(match[2]),
        }),
      },
      {
        pattern: /Exploration (\d+) settled\. Winning rig: (\d+)/,
        eventName: 'ExplorationSettled',
        extractor: (match) => ({
          explorationIndex: parseInt(match[1]),
          winningRig: parseInt(match[2]),
        }),
      },
      {
        pattern: /Exploration (\d+) rolled over/,
        eventName: 'ExplorationRolledOver',
        extractor: (match) => ({
          explorationIndex: parseInt(match[1]),
        }),
      },
      {
        pattern: /Deposit of (\d+) to rig (\d+)/,
        eventName: 'DepositMade',
        extractor: (match) => ({
          amount: parseInt(match[1]),
          rigIndex: parseInt(match[2]),
        }),
      },
    ];

    for (const { pattern, eventName, extractor } of patterns) {
      const match = log.match(pattern);
      if (match) {
        return {
          name: eventName,
          data: extractor(match),
        };
      }
    }

    return null;
  }
}
