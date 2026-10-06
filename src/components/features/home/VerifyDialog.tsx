/**
 * Modal shell for scratch-code verification results (checking state, then the
 * verdict panel). Lazy-loaded by HomeVerifyForm so Radix Dialog and the result
 * panels stay out of the initial homepage JS. Needs an <I18nProvider> above it
 * with the `verify.` prefix.
 */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VerifyCheckingPanel, VerifyResultPanel } from "@/components/react/VerifyResultPanel";
import type { VerifyResult } from "@/lib/api/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checking: boolean;
  result: VerifyResult | null;
};

export default function VerifyDialog({ open, onOpenChange, checking, result }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-none border-0 bg-transparent p-0 shadow-none data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-2xl">
        {checking && !result && <VerifyCheckingPanel />}
        {result && !checking && <VerifyResultPanel result={result} />}
      </DialogContent>
    </Dialog>
  );
}
