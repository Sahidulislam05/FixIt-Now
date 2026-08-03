"use client";

import { useState, useEffect } from "react";
import { getMyPayments } from "@/lib/api/payments";
import { Payment } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/shared/simple-pagination";
import { CreditCard } from "lucide-react";

const PAGE_SIZE = 10;

// আগে এই ব্যাজটা সবসময় সবুজ "PAID" স্টাইলে দেখাতো, pmt.status যা-ই হোক না কেন —
// এখন FAILED/PENDING/CANCELLED স্ট্যাটাসের জন্যও সঠিক রঙ ও লেবেল দেখায়
function renderPaymentStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          PAID
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          PENDING
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
          FAILED
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20">
          CANCELLED
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function CustomerPaymentsHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getMyPayments({ page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setPayments(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .catch((err: Error) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          View all your completed transaction records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : payments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((pmt) => (
                      <TableRow key={pmt.id}>
                        <TableCell className="font-mono text-xs">
                          {pmt.tranId || pmt.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {pmt.booking?.service?.title || "Service"}
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          ৳{pmt.amount}
                        </TableCell>
                        <TableCell>
                          {renderPaymentStatusBadge(pmt.status || "PAID")}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {pmt.createdAt
                            ? new Date(pmt.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <SimplePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No payment transactions found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
