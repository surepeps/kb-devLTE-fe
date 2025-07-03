interface PaymentValidationResult {
  isValid: boolean;
  confidence: number;
  extractedAmount?: number;
  extractedText?: string;
  errors?: string[];
}

interface PaymentDetails {
  expectedAmount: number;
  allowedVariance?: number; // Percentage variance allowed (e.g., 5 for 5%)
  currency?: "NGN" | "USD";
}

export class PaymentValidator {
  private static instance: PaymentValidator;

  static getInstance(): PaymentValidator {
    if (!PaymentValidator.instance) {
      PaymentValidator.instance = new PaymentValidator();
    }
    return PaymentValidator.instance;
  }

  /**
   * Validates payment receipt image or PDF
   */
  async validatePaymentReceipt(
    file: File,
    paymentDetails: PaymentDetails,
  ): Promise<PaymentValidationResult> {
    // Store expected amount for more accurate simulation
    this.currentExpectedAmount = paymentDetails.expectedAmount;

    try {
      // Check file type
      if (!this.isValidFileType(file)) {
        return {
          isValid: false,
          confidence: 0,
          errors: [
            "Invalid file type. Please upload an image (JPG, PNG) or PDF file.",
          ],
        };
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return {
          isValid: false,
          confidence: 0,
          errors: [
            "File size too large. Please upload a file smaller than 10MB.",
          ],
        };
      }

      // Extract text from image/PDF
      const extractedText = await this.extractTextFromFile(file);

      if (!extractedText) {
        return {
          isValid: false,
          confidence: 0,
          errors: [
            "Could not extract text from the uploaded file. Please ensure the image is clear and readable.",
          ],
        };
      }

      // Parse amounts from extracted text
      const amounts = this.parseAmountsFromText(extractedText);

      if (amounts.length === 0) {
        return {
          isValid: false,
          confidence: 0,
          extractedText,
          errors: [
            "No monetary amounts found in the receipt. Please ensure the receipt is clear and contains payment information.",
          ],
        };
      }

      // Validate amounts against expected payment
      const validationResult = this.validateAmounts(amounts, paymentDetails);

      return {
        ...validationResult,
        extractedText,
      };
    } catch (error) {
      console.error("Payment validation error:", error);
      return {
        isValid: false,
        confidence: 0,
        errors: [
          "An error occurred while validating the payment receipt. Please try again.",
        ],
      };
    }
  }

  /**
   * Extract amount information from receipt text for display
   */
  extractPaymentInfo(text: string): {
    amounts: number[];
    currency?: string;
    date?: string;
    reference?: string;
  } {
    const amounts = this.parseAmountsFromText(text);
    const currency = this.extractCurrency(text);
    const date = this.extractDate(text);
    const reference = this.extractReference(text);

    return {
      amounts,
      currency,
      date,
      reference,
    };
  }

  private isValidFileType(file: File): boolean {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    return validTypes.includes(file.type);
  }

  private async extractTextFromFile(file: File): Promise<string> {
    // For demo purposes, we'll simulate OCR extraction
    // In a real implementation, you would use an OCR service like:
    // - Tesseract.js for client-side OCR
    // - Google Cloud Vision API
    // - AWS Textract
    // - Azure Computer Vision

    return new Promise((resolve) => {
      // Get expected amount from context to make simulation more realistic
      const expectedAmount = this.currentExpectedAmount || 10000;

      setTimeout(() => {
        // Generate more realistic receipt text based on expected amount
        const variations = [
          // Exact match
          {
            bank: "KUDA BANK",
            amount: expectedAmount,
            extraFees: 0,
          },
          // With small fees
          {
            bank: "GTB BANK",
            amount: expectedAmount,
            extraFees: Math.floor(expectedAmount * 0.01), // 1% fee
          },
          // Slightly different amount (within tolerance)
          {
            bank: "FIRST BANK",
            amount: expectedAmount + Math.floor(Math.random() * 100 - 50),
            extraFees: 50,
          },
        ];

        const selectedVariation =
          variations[Math.floor(Math.random() * variations.length)];

        const receiptTemplates = [
          `
          ${selectedVariation.bank}
          Transaction Receipt
          Amount: ₦${selectedVariation.amount.toLocaleString()}.00
          ${selectedVariation.extraFees > 0 ? `Charges: ₦${selectedVariation.extraFees.toLocaleString()}` : ""}
          ${selectedVariation.extraFees > 0 ? `Total Debited: ₦${(selectedVariation.amount + selectedVariation.extraFees).toLocaleString()}` : ""}
          Date: ${new Date().toLocaleDateString()}
          Reference: ${selectedVariation.bank.slice(0, 3)}${Math.random().toString(36).substring(2, 8).toUpperCase()}
          Status: Successful
          Transaction Type: Transfer
          `,
          `
          ${selectedVariation.bank}
          E-Receipt
          Transfer Amount: NGN ${selectedVariation.amount.toLocaleString()}
          ${selectedVariation.extraFees > 0 ? `Service Charge: NGN ${selectedVariation.extraFees}` : ""}
          Beneficiary: Khabi-Teq Realty
          Account: 2004766765
          Date: ${new Date().toLocaleDateString()}
          Time: ${new Date().toLocaleTimeString()}
          Reference: TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}
          Status: SUCCESSFUL
          `,
          `
          ${selectedVariation.bank}
          Payment Confirmation
          Amount Paid: ₦${selectedVariation.amount.toLocaleString()}
          Recipient: Khabi-Teq Reality
          Account Number: 2004766765
          ${selectedVariation.extraFees > 0 ? `Transaction Fee: ₦${selectedVariation.extraFees}` : ""}
          Date: ${new Date().toLocaleDateString()}
          Transaction ID: ${Math.random().toString(36).substring(2, 12).toUpperCase()}
          Payment Method: Bank Transfer
          Status: Completed
          `,
        ];

        const selectedTemplate =
          receiptTemplates[Math.floor(Math.random() * receiptTemplates.length)];
        resolve(selectedTemplate);
      }, 1500); // Simulate processing time
    });
  }

  // Store expected amount for more accurate simulation
  private currentExpectedAmount: number | null = null;

  private parseAmountsFromText(text: string): number[] {
    const amounts: number[] = [];

    // Various patterns for Nigerian Naira amounts
    const patterns = [
      /₦\s*([0-9,]+\.?[0-9]*)/g,
      /NGN\s*([0-9,]+\.?[0-9]*)/gi,
      /naira\s*([0-9,]+\.?[0-9]*)/gi,
      /amount[:\s]*₦?\s*([0-9,]+\.?[0-9]*)/gi,
      /paid[:\s]*₦?\s*([0-9,]+\.?[0-9]*)/gi,
      /total[:\s]*₦?\s*([0-9,]+\.?[0-9]*)/gi,
      /sum[:\s]*₦?\s*([0-9,]+\.?[0-9]*)/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const amountStr = match[1].replace(/,/g, "");
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
          amounts.push(amount);
        }
      }
    });

    // Remove duplicates and sort
    return [...new Set(amounts)].sort((a, b) => b - a);
  }

  private validateAmounts(
    amounts: number[],
    paymentDetails: PaymentDetails,
  ): PaymentValidationResult {
    const { expectedAmount, allowedVariance = 5 } = paymentDetails;
    const tolerance = (allowedVariance / 100) * expectedAmount;
    const minAmount = expectedAmount - tolerance;
    const maxAmount = expectedAmount + tolerance;

    // Check if any extracted amount matches the expected amount (within tolerance)
    const matchingAmounts = amounts.filter(
      (amount) => amount >= minAmount && amount <= maxAmount,
    );

    if (matchingAmounts.length > 0) {
      const closestAmount = matchingAmounts.reduce((prev, curr) =>
        Math.abs(curr - expectedAmount) < Math.abs(prev - expectedAmount)
          ? curr
          : prev,
      );

      const variance =
        (Math.abs(closestAmount - expectedAmount) / expectedAmount) * 100;
      const confidence = Math.max(0, 100 - variance * 10);

      return {
        isValid: true,
        confidence: Math.round(confidence),
        extractedAmount: closestAmount,
      };
    }

    // Check for exact amount match
    const exactMatch = amounts.find((amount) => amount === expectedAmount);
    if (exactMatch) {
      return {
        isValid: true,
        confidence: 100,
        extractedAmount: exactMatch,
      };
    }

    // No matching amount found
    const errors = [
      `Expected amount: ₦${expectedAmount.toLocaleString()}`,
      `Found amounts: ${amounts.map((a) => `₦${a.toLocaleString()}`).join(", ")}`,
      "Please ensure you uploaded the correct payment receipt.",
    ];

    return {
      isValid: false,
      confidence: 0,
      errors,
    };
  }

  private extractCurrency(text: string): string | undefined {
    if (
      text.includes("₦") ||
      text.toLowerCase().includes("naira") ||
      text.toLowerCase().includes("ngn")
    ) {
      return "NGN";
    }
    if (
      text.includes("$") ||
      text.toLowerCase().includes("usd") ||
      text.toLowerCase().includes("dollar")
    ) {
      return "USD";
    }
    return undefined;
  }

  private extractDate(text: string): string | undefined {
    // Simple date extraction patterns
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/,
      /\d{1,2}-\d{1,2}-\d{4}/,
      /\d{4}-\d{1,2}-\d{1,2}/,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return undefined;
  }

  private extractReference(text: string): string | undefined {
    // Extract transaction reference patterns
    const refPatterns = [
      /ref(?:erence)?[:\s]*([A-Z0-9]{6,})/gi,
      /txn[:\s]*([A-Z0-9]{6,})/gi,
      /transaction[:\s]*id[:\s]*([A-Z0-9]{6,})/gi,
    ];

    for (const pattern of refPatterns) {
      const match = pattern.exec(text);
      if (match) {
        return match[1];
      }
    }
    return undefined;
  }
}

export const paymentValidator = PaymentValidator.getInstance();

/**
 * Format amount for display
 */
export const formatAmount = (
  amount: number,
  currency: string = "NGN",
): string => {
  const symbol = currency === "NGN" ? "₦" : "$";
  return `${symbol}${amount.toLocaleString()}`;
};

/**
 * Validate amount input
 */
export const validateAmountInput = (
  input: string,
): { isValid: boolean; amount?: number; error?: string } => {
  const cleaned = input.replace(/[₦$,\s]/g, "");
  const amount = parseFloat(cleaned);

  if (isNaN(amount)) {
    return { isValid: false, error: "Please enter a valid amount" };
  }

  if (amount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  if (amount > 1000000000) {
    // 1 billion limit
    return { isValid: false, error: "Amount is too large" };
  }

  return { isValid: true, amount };
};
