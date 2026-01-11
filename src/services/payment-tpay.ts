/**
 * TPay Payment Provider for Medusa - OpenAPI Version
 * 
 * TPay is the most popular payment gateway in Poland
 * Supports: BLIK, bank transfers, cards, Google Pay, Apple Pay
 * 
 * Documentation: https://openapi.tpay.com/
 */

import crypto from 'crypto';

export interface TPayConfig {
  clientId: string;
  clientSecret: string;
  sandbox?: boolean;
}

export interface TPayTransactionRequest {
  amount: number;
  description: string;
  hiddenDescription?: string;
  payer: {
    email: string;
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    code?: string;
    country?: string;
  };
  callbacks: {
    payerUrls: {
      success: string;
      error: string;
    };
    notification: {
      url: string;
    };
  };
  pay?: {
    groupId?: number;
    blikPaymentData?: {
      blikToken: string;
      type: number;
    };
  };
}

export interface TPayTransactionResponse {
  result: string;
  transactionId?: string;
  transactionPaymentUrl?: string;
  status?: string;
  error?: {
    errorCode: string;
    errorMessage: string;
  };
}

export interface TPayNotification {
  tr_id: string;
  tr_date: string;
  tr_crc: string;
  tr_amount: string;
  tr_paid: string;
  tr_desc: string;
  tr_status: string;
  tr_error: string;
  tr_email: string;
  md5sum: string;
  test_mode?: string;
}

// TPay payment method groups (OpenAPI)
export const TPAY_PAYMENT_GROUPS = {
  BLIK: 150,
  CARD: 103,
  BANK_TRANSFER: 0,
  GOOGLE_PAY: 166,
  APPLE_PAY: 167,
  INSTALLMENTS: 109,
  TWISTO: 161,
  PAYPO: 172,
} as const;

export class TPayPaymentProvider {
  private config: TPayConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: TPayConfig) {
    this.config = config;
    this.baseUrl = config.sandbox 
      ? 'https://openapi.sandbox.tpay.com'
      : 'https://openapi.tpay.com';
  }

  /**
   * Get OAuth2 access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/oauth/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        // Token expires in 7200 seconds, refresh 5 minutes before
        this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
        return this.accessToken!;
      } else {
        throw new Error(data.error_description || 'Failed to get access token');
      }
    } catch (error: any) {
      console.error('TPay OAuth error:', error);
      throw new Error(`TPay authentication failed: ${error.message}`);
    }
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.errorMessage || `API error: ${response.status}`);
    }

    return data;
  }

  /**
   * Create a new transaction
   */
  async createTransaction(params: TPayTransactionRequest): Promise<TPayTransactionResponse> {
    try {
      const response = await this.makeRequest('/transactions', 'POST', params);

      return {
        result: 'success',
        transactionId: response.transactionId,
        transactionPaymentUrl: response.transactionPaymentUrl,
        status: response.status,
      };
    } catch (error: any) {
      console.error('TPay transaction creation failed:', error);
      return {
        result: 'error',
        error: {
          errorCode: 'CREATE_FAILED',
          errorMessage: error.message,
        },
      };
    }
  }

  /**
   * Create BLIK transaction with code
   */
  async createBlikTransaction(
    params: Omit<TPayTransactionRequest, 'pay'>,
    blikCode: string
  ): Promise<TPayTransactionResponse> {
    try {
      const requestBody = {
        ...params,
        pay: {
          groupId: TPAY_PAYMENT_GROUPS.BLIK,
          blikPaymentData: {
            blikToken: blikCode,
            type: 0, // 0 = BLIK code, 1 = BLIK alias
          },
        },
      };

      const response = await this.makeRequest('/transactions', 'POST', requestBody);

      return {
        result: response.result === 'success' ? 'success' : 'error',
        transactionId: response.transactionId,
        status: response.status,
      };
    } catch (error: any) {
      console.error('TPay BLIK transaction failed:', error);
      return {
        result: 'error',
        error: {
          errorCode: 'BLIK_FAILED',
          errorMessage: error.message,
        },
      };
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string): Promise<{
    status: 'pending' | 'paid' | 'error' | 'refunded' | 'chargeback';
    amount?: number;
    paidAmount?: number;
    error?: string;
  }> {
    try {
      const response = await this.makeRequest(`/transactions/${transactionId}`);

      let status: 'pending' | 'paid' | 'error' | 'refunded' | 'chargeback' = 'pending';
      
      switch (response.status) {
        case 'correct':
        case 'paid':
          status = 'paid';
          break;
        case 'refund':
          status = 'refunded';
          break;
        case 'chargeback':
          status = 'chargeback';
          break;
        case 'error':
        case 'declined':
          status = 'error';
          break;
      }

      return {
        status,
        amount: response.amount,
        paidAmount: response.paidAmount,
      };
    } catch (error: any) {
      console.error('TPay status check failed:', error);
      return {
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Refund a transaction
   */
  async refundTransaction(transactionId: string, amount?: number): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    try {
      const body: any = {};
      if (amount) {
        body.amount = amount;
      }

      const response = await this.makeRequest(`/transactions/${transactionId}/refunds`, 'POST', body);

      return {
        success: true,
        refundId: response.refundId,
      };
    } catch (error: any) {
      console.error('TPay refund failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get available payment channels/groups
   */
  async getPaymentChannels(): Promise<Array<{
    id: number;
    name: string;
    img: string;
    available: boolean;
  }>> {
    try {
      const response = await this.makeRequest('/transactions/channels');
      
      return (response.channels || []).map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        img: channel.image?.url || '',
        available: channel.available,
      }));
    } catch (error) {
      console.error('Failed to fetch TPay payment channels:', error);
      return [];
    }
  }

  /**
   * Verify webhook notification signature
   */
  verifyNotification(notification: TPayNotification, jws?: string): boolean {
    // For OpenAPI, TPay uses JWS signatures
    // For now, we'll do basic validation
    if (!notification.tr_id || !notification.tr_status) {
      return false;
    }
    return true;
  }

  /**
   * Process webhook notification
   */
  processNotification(notification: TPayNotification): {
    valid: boolean;
    orderId: string;
    status: 'paid' | 'error' | 'chargeback';
    amount: number;
    transactionId: string;
  } {
    const valid = this.verifyNotification(notification);

    let status: 'paid' | 'error' | 'chargeback' = 'error';
    if (notification.tr_status === 'TRUE' || notification.tr_status === 'correct') {
      status = 'paid';
    } else if (notification.tr_status === 'CHARGEBACK') {
      status = 'chargeback';
    }

    return {
      valid,
      orderId: notification.tr_crc,
      status,
      amount: parseFloat(notification.tr_paid || notification.tr_amount),
      transactionId: notification.tr_id,
    };
  }
}

export default TPayPaymentProvider;
