import 'dotenv/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import pino from 'pino';

import { Config, loadConfig } from './config';
import { EventListener } from './event-listener';
import { ExplorationManager } from './exploration-manager';
import { BuybackExecutor } from './buyback-executor';
import { Scheduler } from './scheduler';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

async function main() {
  logger.info('Starting Rig It Orchestrator...');

  // Load configuration
  const config = loadConfig();
  logger.info({ rpcUrl: config.rpcUrl, programId: config.programId }, 'Configuration loaded');

  // Initialize connection
  const connection = new Connection(config.rpcUrl, {
    commitment: 'confirmed',
    wsEndpoint: config.wsUrl,
  });

  // Load operator wallet
  const operatorKeypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(config.operatorPrivateKey))
  );
  logger.info({ operator: operatorKeypair.publicKey.toBase58() }, 'Operator wallet loaded');

  // Initialize components
  const eventListener = new EventListener(connection, config.programId, logger);
  const explorationManager = new ExplorationManager(
    connection,
    operatorKeypair,
    config.programId,
    logger
  );
  const buybackExecutor = new BuybackExecutor(
    connection,
    operatorKeypair,
    config,
    logger
  );
  const scheduler = new Scheduler(
    explorationManager,
    buybackExecutor,
    config,
    logger
  );

  // Start event listener
  await eventListener.start((event) => {
    logger.info({ event: event.name }, 'Event received');
    
    // Handle specific events
    switch (event.name) {
      case 'ExplorationStarted':
        scheduler.onExplorationStarted(event.data);
        break;
      case 'ExplorationSettled':
        scheduler.onExplorationSettled(event.data);
        break;
      case 'ExplorationRolledOver':
        scheduler.onExplorationRolledOver(event.data);
        break;
      case 'BuybackBudgetAllocated':
        buybackExecutor.scheduleBuyback(event.data);
        break;
    }
  });

  // Start scheduler
  await scheduler.start();

  logger.info('Orchestrator running. Press Ctrl+C to stop.');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    await eventListener.stop();
    await scheduler.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error({ err }, 'Fatal error');
  process.exit(1);
});
