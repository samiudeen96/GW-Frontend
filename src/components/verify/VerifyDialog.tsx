/**
 * Purpose: Lazily-loaded modal shell for scratch-code verification results.
 * Users: Visitors verifying an authenticity code from the homepage strip.
 * Key actions: show the checking state, then the verification verdict panel.
 * Integration points: loaded via React.lazy so Radix Dialog + the result panels
 *   stay out of the initial homepage JS payload (PageSpeed / TBT).
 */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VerifyResultPanel, VerifyCheckingPanel } from "@/components/verify/VerifyResultPanel";
import type { VerifyResult } from "@/lib/verify.functions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checking: boolean;
  result: VerifyResult | null;
};

export default function VerifyDialog({ open, onOpenChange, checking, result }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl rounded-none border-0 bg-transparent p-0 shadow-none data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
        {checking && !result && <VerifyCheckingPanel />}
        {result && !checking && <VerifyResultPanel result={result} />}
      </DialogContent>
    </Dialog>
  );
}
