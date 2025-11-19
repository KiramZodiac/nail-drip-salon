import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle,
  Clock4,
  Eye,
  Phone,
  Search,
  Trash2,
  User2,
  XCircle
} from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  service_id: string | null;
  service_name: string | null;
  service_price: number | null;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: BookingStatus;
  source: string | null;
  created_at: string;
  updated_at: string | null;
}

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: BookingStatus) => {
  switch (status) {
    case "pending":
      return <Clock4 className="h-4 w-4 text-yellow-600" />;
    case "confirmed":
      return <CalendarDays className="h-4 w-4 text-blue-600" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <CalendarClock className="h-4 w-4 text-gray-600" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const formatDateTime = (dateString: string, time: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })} at ${time}`;
};

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("appointment_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings((data as BookingRequest[]) || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.service_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Booking updated");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
      toast.success("Booking deleted");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  const handleView = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nail-purple mx-auto" />
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600">
          Review and manage appointment requests submitted from the website.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, phone, or service..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as "all" | BookingStatus)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    {booking.service_name || "Custom Service"}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {formatDateTime(booking.appointment_date, booking.appointment_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {booking.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </Badge>
                  <Select
                    value={booking.status}
                    onValueChange={(value) =>
                      handleStatusChange(booking.id, value as BookingStatus)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => handleView(booking)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          This booking will be permanently removed. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(booking.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <User2 className="h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Client Name</p>
                    <p className="font-medium text-gray-900">{booking.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarClock className="h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Requested</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.created_at)}</p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">Client Notes</p>
                  <p>{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-16">
          <CalendarClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No bookings match the selected filters.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Full snapshot of the appointment request submitted by the client.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Client Name</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{selectedBooking.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500">Service</p>
                <p className="font-semibold text-gray-900">
                  {selectedBooking.service_name || "Custom Service"}
                  {selectedBooking.service_price
                    ? ` • ${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(selectedBooking.service_price)}`
                    : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Appointment Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDateTime(
                      selectedBooking.appointment_date,
                      selectedBooking.appointment_time
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Requested On</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedBooking.created_at)}
                  </p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className="text-gray-500">Client Notes</p>
                  <p className="font-semibold text-gray-900 whitespace-pre-wrap">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <p className="text-gray-500">Status</p>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {getStatusIcon(selectedBooking.status)}
                  <span className="ml-1 capitalize">{selectedBooking.status}</span>
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsAdmin;


