import Stripe from 'stripe';
import { Logger } from '@medusajs/medusa';

interface StripePluginOptions {
  apiKey: string;
  webhookSecret: string;
  apiVersion?: string;
}

export default async function stripePlugin(
  container: any,
  options: StripePluginOptions
) {
  const logger: Logger = container.resolve('logger');

  try {
    // Initialize Stripe SDK
    const stripe = new Stripe(options.apiKey, {
      apiVersion: (options.apiVersion as any) || '2023-10-16',
      typescript: true,
    });

    // Register Stripe instance in container
    container.register({
      stripe: {
        resolve: () => stripe,
      },
      stripeWebhookSecret: {
        resolve: () => options.webhookSecret,
      },
    });

    logger.info('Stripe plugin initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Stripe plugin:', error);
    throw error;
  }
}
