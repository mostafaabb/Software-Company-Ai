import { ReferralPanel } from "@/components/projects/referral-panel";

export const metadata = { title: "Referrals" };

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Referral Program</h1>
        <p className="mt-1 text-sm text-muted-foreground">Invite friends and earn rewards.</p>
      </div>
      <ReferralPanel />
    </div>
  );
}