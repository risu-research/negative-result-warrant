import {
  checkNegativePremise,
  deriveZeroProposition,
  type NegativePremiseGateVerdict,
  type ZeroProposition,
} from "../frozen/phase2.1/src/index.ts";
import { authorityContextIdForCredential, credentialBinding } from "./capture.ts";
import { hasAlgoliaRealSourceValidationMark } from "./real-source-evidence.ts";
import type {
  AlgoliaActionInputs,
  ReceiverValidatedAlgoliaRealSourceEvidence,
} from "./types.ts";

export const FIXED_MATCHING_CONTROLS = {
  enableABTest: false,
  typoTolerance: false,
  enableRules: false,
} as const;

export interface AlgoliaActionResult {
  verdict: NegativePremiseGateVerdict;
  requiredProposition?: ZeroProposition;
  sourceInstanceId: string;
  authorityContextId: string;
}

/** Derives the required premise from action inputs; callers cannot supply a proposition. */
export function executeFallbackIfNoAlgoliaMatch(input: AlgoliaActionInputs & {
  evidence?: ReceiverValidatedAlgoliaRealSourceEvidence;
  effect: () => void;
}): AlgoliaActionResult {
  const authorityContextId = authorityContextIdForCredential(input.credential);
  const sourceInstanceId = `algolia-app:${input.applicationId}`;
  const path = `/1/indexes/${encodeURIComponent(input.index)}/query`;
  const requiredProposition = deriveZeroProposition({
    profile: "algolia-search",
    request: {
      path,
      index: input.index,
      query: input.query,
      ...FIXED_MATCHING_CONTROLS,
    },
    authorityContextId,
    sourceScope: {
      provider: "algolia",
      endpoint: path,
      entitySet: "index-records",
      requestedIndex: input.index,
      effectiveIndex: input.index,
    },
  });
  const evidence = input.evidence;
  const outerValid = evidence !== undefined
    && hasAlgoliaRealSourceValidationMark(evidence)
    && evidence.sourceInstance.applicationId === input.applicationId
    && evidence.sourceInstance.sourceInstanceId === sourceInstanceId
    && evidence.authorityContextId === authorityContextId
    && evidence.credentialBinding.digest === credentialBinding(input.credential).digest;
  const verdict = requiredProposition !== undefined && outerValid
    ? checkNegativePremise({
        requiredProposition,
        evidence: evidence.boundEvidence,
      })
    : "BLOCK";
  if (verdict === "PASS") input.effect();
  return {
    verdict,
    ...(requiredProposition === undefined ? {} : { requiredProposition }),
    sourceInstanceId,
    authorityContextId,
  };
}
