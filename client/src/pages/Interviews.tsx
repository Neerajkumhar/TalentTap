import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInterviewSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const interviewFormSchema = insertInterviewSchema.extend({
  applicationId: z.number().min(1, "Application is required"),
  scheduledAt: z.date({
    required_error: "Date and time are required",
  }),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  type: z.string().min(1, "Interview type is required"),
});

export default function Interviews() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const { data: interviews, isLoading } = useQuery({
    queryKey: ["/api/interviews"],
    retry: false,
  });

  const { data: applications } = useQuery({
    queryKey: ["/api/applications"],
    retry: false,
  });

  const { data: todayInterviews, isLoading: todayLoading } = useQuery({
    queryKey: ["/api/interviews/today"],
    retry: false,
  });

  const form = useForm<z.infer<typeof interviewFormSchema>>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      duration: 60,
      type: "",
      meetingUrl: "",
      notes: "",
    },
  });

  const createInterviewMutation = useMutation({
    mutationFn: async (interviewData: z.infer<typeof interviewFormSchema>) => {
      await apiRequest("POST", "/api/interviews", interviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews/today"] });
      setIsCreateDialogOpen(false);
      form.reset();
      setSelectedDate(undefined);
      toast({
        title: "Success",
        description: "Interview scheduled successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof interviewFormSchema>) => {
    createInterviewMutation.mutate(data);
  };

  const getInterviewTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-primary-100 text-primary-800';
      case 'phone':
        return 'bg-warning-100 text-warning-800';
      case 'in-person':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary-100 text-primary-800';
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      case 'rescheduled':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Interviews</h1>
          <p className="text-gray-600">Manage interview schedules and track progress</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-600">
              <span className="material-icons mr-2">schedule</span>
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Set up an interview with a candidate
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="applicationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Application</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a candidate application" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {applications?.map((app: any) => (
                            <SelectItem key={app.id} value={app.id.toString()}>
                              {app.candidateName} - {app.jobTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP 'at' p")
                                ) : (
                                  <span>Pick a date and time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  const newDate = new Date(date);
                                  newDate.setHours(9, 0, 0, 0); // Default to 9 AM
                                  field.onChange(newDate);
                                }
                              }}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                            {field.value && (
                              <div className="p-3 border-t">
                                <Input
                                  type="time"
                                  value={format(field.value, "HH:mm")}
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDate = new Date(field.value);
                                    newDate.setHours(parseInt(hours), parseInt(minutes));
                                    field.onChange(newDate);
                                  }}
                                />
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="60" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select interview type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">Video Call</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meetingUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://zoom.us/j/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Additional notes for the interview..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createInterviewMutation.isPending}
                    className="bg-primary hover:bg-primary-600"
                  >
                    {createInterviewMutation.isPending ? "Scheduling..." : "Schedule Interview"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Interviews */}
      <Card className="material-elevation-1">
        <CardHeader>
          <CardTitle>Today's Interviews</CardTitle>
          <CardDescription>Interviews scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {todayInterviews?.length ? todayInterviews.map((interview: any) => (
                <div key={interview.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">
                        {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                      <Badge className={getInterviewTypeColor(interview.type)}>
                        {interview.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                    <p className="text-xs text-gray-500">with {interview.interviewerName} • {interview.duration} min</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <span className="material-icons text-lg">videocam</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="material-icons text-lg">edit</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="material-icons text-lg">more_vert</span>
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-gray-400 text-2xl">schedule</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews today</h3>
                  <p className="text-gray-600">You have no interviews scheduled for today</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Interviews */}
      <Card className="material-elevation-1">
        <CardHeader>
          <CardTitle>All Interviews</CardTitle>
          <CardDescription>Complete list of scheduled interviews</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {interviews?.length ? interviews.map((interview: any) => (
                <div key={interview.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {interview.candidateName?.split(' ').map((n: string) => n[0]).join('') || 'N/A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                      <Badge className={getInterviewTypeColor(interview.type)}>
                        {interview.type}
                      </Badge>
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(interview.scheduledAt).toLocaleDateString()} at {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {interview.duration} min
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {interview.meetingUrl && (
                      <Button variant="ghost" size="sm">
                        <span className="material-icons text-lg">videocam</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <span className="material-icons text-lg">edit</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="material-icons text-lg">more_vert</span>
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-gray-400 text-2xl">schedule</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
                  <p className="text-gray-600 mb-4">Get started by scheduling your first interview</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary-600">
                    <span className="material-icons mr-2">schedule</span>
                    Schedule Your First Interview
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
