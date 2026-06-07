"use client";

import * as React from "react";
import {
  Gift,
  Copy,
  Check,
  Mail,
  Users,
  Clock,
  Trophy,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  rewards: { label: string; earned: boolean }[];
}

export function ReferralPanel() {
  const [stats, setStats] = React.useState<ReferralStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const data = await res.json();
        setStats({
          referralCode: data.referral?.code || "",
          referralLink: `${window.location.origin}/signup?ref=${data.referral?.code || ""}`,
          totalReferrals: data.referralCount || 0,
          completedReferrals: data.referralCount || 0,
          pendingReferrals: 0,
          rewards: [
            { label: "1 referral — Free Starter month", earned: (data.referralCount || 0) >= 1 },
            { label: "5 referrals — Free Pro month", earned: (data.referralCount || 0) >= 5 },
            { label: "10 referrals — Free year of Pro", earned: (data.referralCount || 0) >= 10 },
          ],
        });
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (stats) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendInvite = async () => {
    if (!email) return;
    setSending(true);
    try {
      await fetch("/api/referrals/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
      setEmail("");
      setTimeout(() => setSent(false), 3000);
    } catch {} finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Gift className="h-5 w-5" />
        Referral Program
      </h2>

      <Card className="overflow-hidden border-indigo-500/20">
        <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Share BuildForge AI</span>
          </div>
          <p className="text-xs text-white/80">
            Invite friends and earn rewards! Get 1 free month for each friend who signs up.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={stats?.referralLink || ""}
              className="font-mono text-xs"
            />
            <Button size="icon" onClick={copyLink} variant="outline">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Your code: <span className="font-mono font-medium">{stats?.referralCode}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Share via Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Friend&apos;s email</Label>
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={sendInvite} disabled={sending || !email} className="gradient">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </div>
          {sent && (
            <p className="mt-2 text-xs text-emerald-500">Invitation sent!</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-1 h-5 w-5 text-blue-500" />
            <p className="text-2xl font-bold">{stats?.totalReferrals ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Check className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
            <p className="text-2xl font-bold">{stats?.completedReferrals ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-amber-500" />
            <p className="text-2xl font-bold">{stats?.pendingReferrals ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {stats?.rewards && stats.rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.rewards.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{r.label}</span>
                {r.earned ? (
                  <Badge variant="success">Earned</Badge>
                ) : (
                  <Badge variant="outline">Locked</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
