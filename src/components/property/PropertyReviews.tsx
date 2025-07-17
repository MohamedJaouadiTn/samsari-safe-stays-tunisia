
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Review = Tables<"reviews">;

interface PropertyReviewsProps {
  propertyId: string;
}

const PropertyReviews = ({ propertyId }: PropertyReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    checkReviewEligibility();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has completed bookings for this property and hasn't reviewed yet
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, status, actual_check_in, actual_check_out")
        .eq("property_id", propertyId)
        .eq("guest_id", user.id);

      if (error) throw error;

      const eligibleBookings = bookings?.filter(booking => {
        // Can review if completed and checked out
        if (booking.status === 'completed' && booking.actual_check_out) {
          return true;
        }
        // Can review if cancelled but checked in less than 5 hours ago
        if (booking.status === 'cancelled' && booking.actual_check_in) {
          const checkInTime = new Date(booking.actual_check_in);
          const now = new Date();
          const hoursDiff = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
          return hoursDiff <= 5;
        }
        return false;
      });

      // Check if already reviewed
      const { data: existingReviews } = await supabase
        .from("reviews")
        .select("booking_id")
        .eq("property_id", propertyId)
        .eq("user_id", user.id);

      const reviewedBookingIds = existingReviews?.map(r => r.booking_id) || [];
      const unreviewed = eligibleBookings?.filter(b => !reviewedBookingIds.includes(b.id));

      setCanReview((unreviewed?.length || 0) > 0);
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  const submitReview = async () => {
    if (!rating || rating < 1 || rating > 5) {
      toast({
        title: "Invalid Rating",
        description: "Please select a rating between 1 and 5 stars",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to leave a review",
          variant: "destructive"
        });
        return;
      }

      // Get eligible booking
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("property_id", propertyId)
        .eq("guest_id", user.id)
        .limit(1);

      if (!bookings || bookings.length === 0) {
        toast({
          title: "No Eligible Booking",
          description: "You need to complete a stay to leave a review",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("reviews")
        .insert({
          booking_id: bookings[0].id,
          property_id: propertyId,
          user_id: user.id,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!"
      });

      setComment("");
      setRating(0);
      setCanReview(false);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews & Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length > 0 ? (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} reviews)</span>
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet</p>
        )}
        
        <Separator />
        
        {canReview && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Leave a Review</h4>
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <Button onClick={submitReview} disabled={!rating}>
              Submit Review
            </Button>
          </div>
        )}
        
        {reviews.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Reviews</h4>
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Guest</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;
