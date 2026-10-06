/** Addresses tab: address book derived from past orders. */
import type { AccountAddress } from "@/lib/api/account";
import { useI18n } from "@/lib/i18n/react";

import { dateLabel } from "./account-format";
import { AddressLines, EmptyState, SectionTitle } from "./AccountParts";

export function AddressesTab({ addresses }: { addresses: AccountAddress[] }) {
  const { t } = useI18n();
  return (
    <div>
      <SectionTitle note={`${addresses.length} ${t("commerce.account.onFile", "on file")}`}>
        {t("commerce.account.addressBook", "Address book")}
      </SectionTitle>
      {addresses.length === 0 ? (
        <EmptyState
          title={t("commerce.account.empty.addressesTitle", "No addresses yet")}
          body={t(
            "commerce.account.empty.addressesBody",
            "Addresses are saved automatically from your orders, so your next checkout is faster.",
          )}
          ctaLabel={t("commerce.account.empty.cta", "Shop the collection")}
          to="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 gap-px border hairline bg-ink/[0.08] md:grid-cols-2">
          {addresses.map((a, idx) => (
            <div key={a.id} className="bg-paper p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {idx === 0
                    ? t("commerce.account.defaultMostRecent", "Default · most recent")
                    : t("commerce.account.previous", "Previous")}
                </p>
                <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  {t("commerce.account.used", "Used")} {a.usedCount}×
                </p>
              </div>
              <AddressLines a={a} />
              <p className="mt-4 text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                {t("commerce.account.lastUsed", "Last used")} {dateLabel(a.lastUsedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 text-[11px] text-muted-foreground">
        {t(
          "commerce.account.addressNote",
          "To add or change an address, enter it at checkout — it is stored with the order and appears here.",
        )}
      </p>
    </div>
  );
}
