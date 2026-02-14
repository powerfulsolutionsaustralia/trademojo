import Anthropic from '@anthropic-ai/sdk';
import type { TradeCategory } from '@/types/database';
import { tradeCategoryLabel } from '@/lib/utils';

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic();
  }
  return _anthropic;
}

export interface VerificationResult {
  score: number; // 0-100
  recommendation: 'auto_approve' | 'needs_review' | 'likely_spam';
  flags: string[];
  reasoning: string;
}

/**
 * Validate an Australian Business Number (ABN) using the modulus 89 checksum.
 * Returns true if the ABN is structurally valid.
 */
export function validateABN(abn: string): boolean {
  // Remove spaces and check length
  const cleaned = abn.replace(/\s/g, '');
  if (!/^\d{11}$/.test(cleaned)) return false;

  // ABN validation weights
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = cleaned.split('').map(Number);

  // Subtract 1 from the first digit
  digits[0] -= 1;

  // Calculate weighted sum
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);

  return sum % 89 === 0;
}

/**
 * Use AI to verify a business signup for legitimacy.
 * Checks ABN format, business name plausibility, and trade match.
 */
export async function verifyBusiness(
  businessName: string,
  abn: string | undefined,
  trade: TradeCategory,
  state: string,
  ownerName: string,
  description: string
): Promise<VerificationResult> {
  const flags: string[] = [];
  let score = 50; // Start neutral

  // --- Static checks ---

  // ABN validation
  if (abn && abn.trim()) {
    if (validateABN(abn)) {
      score += 20;
    } else {
      score -= 15;
      flags.push('Invalid ABN checksum');
    }
  } else {
    flags.push('No ABN provided');
    // Not having an ABN is OK for sole traders, slight penalty
    score -= 5;
  }

  // Business name basic checks
  if (businessName.length < 3) {
    score -= 20;
    flags.push('Business name too short');
  }
  if (/^(test|asdf|abc|xxx|fake)/i.test(businessName)) {
    score -= 30;
    flags.push('Suspicious business name');
  }

  // Owner name check
  if (ownerName.length < 2) {
    score -= 10;
    flags.push('Owner name too short');
  }

  // Description check
  if (description && description.length > 20) {
    score += 10;
  }

  // --- AI verification ---
  try {
    const tradeLabel = tradeCategoryLabel(trade);

    const response = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are a business verification assistant for TradeMojo, an Australian trade services directory. Evaluate this business signup for legitimacy.

Business: ${businessName}
Owner: ${ownerName}
Trade: ${tradeLabel}
State: ${state}
ABN: ${abn || 'Not provided'}
Description: ${description || 'Not provided'}

Evaluate:
1. Does the business name sound like a real trade business?
2. Does the name match the trade category?
3. Are there any red flags (spam, test submissions, nonsensical info)?
4. Overall, is this likely a legitimate business?

Respond with a JSON object (no markdown):
{
  "legitimate": true/false,
  "confidence": 0-100,
  "concerns": ["list of any concerns"],
  "reasoning": "one sentence explanation"
}`,
        },
      ],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    try {
      const aiResult = JSON.parse(text);
      const aiScore = aiResult.confidence || 50;

      // Blend static checks with AI assessment
      score = Math.round(score * 0.4 + aiScore * 0.6);

      if (aiResult.concerns && aiResult.concerns.length > 0) {
        flags.push(...aiResult.concerns);
      }

      return {
        score: Math.max(0, Math.min(100, score)),
        recommendation:
          score >= 65
            ? 'auto_approve'
            : score >= 35
              ? 'needs_review'
              : 'likely_spam',
        flags,
        reasoning:
          aiResult.reasoning || 'AI verification completed',
      };
    } catch {
      // If AI response isn't parseable, use static score only
      console.error('AI verification response not parseable:', text);
      return {
        score: Math.max(0, Math.min(100, score)),
        recommendation: score >= 60 ? 'auto_approve' : 'needs_review',
        flags: [...flags, 'AI response parse error — manual review recommended'],
        reasoning: 'Static checks completed, AI response was not parseable',
      };
    }
  } catch (error) {
    console.error('AI verification error:', error);
    // If AI fails entirely, use static score
    return {
      score: Math.max(0, Math.min(100, score)),
      recommendation: score >= 60 ? 'auto_approve' : 'needs_review',
      flags: [...flags, 'AI verification unavailable — manual review recommended'],
      reasoning: 'Static checks only — AI verification service unavailable',
    };
  }
}
