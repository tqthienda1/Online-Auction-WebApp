import React, { useState, useEffect } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { http as axios } from "../../lib/utils";

const schema = z.object({
  descriptionRating: z.string().optional(),
});

const Rating = ({ type = "item", productID, onRated }) => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existing, setExisting] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fetching, setFetching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    let mounted = true;
    const fetchExisting = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`/rating/${productID}`);
        if (!mounted) return;
        
        if (res.data && res.data.found && res.data.rating) {
          setExisting(res.data.rating);
        } else {
          setExisting(null);
        }
      } catch (err) {
        console.error("Fetch rating failed", err);
      } finally {
        if (mounted) setFetching(false);
      }
    };

    if (productID) fetchExisting();
    return () => { mounted = false; };
  }, [productID]);

  const onSubmit = async (data) => {
    setError(null);
    if (![1, -1].includes(score)) {
      setError('Please select + or - rating');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/rating/${productID}/rate`, {
        score,
        comment: data.descriptionRating, 
      });

      if (typeof onRated === 'function') onRated();

      setExisting({ isPos: score === 1, comment: data.descriptionRating });
      setEditMode(false);
      reset({ descriptionRating: data.descriptionRating }); 
    } catch (err) {
      console.error('Submit rating failed', err);
      setError(err?.response?.data?.message || err.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-2xl font-serif font-semibold mb-4 tracking-tight">Rate this {type}</h3>

      {fetching ? (
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FBBC04] mb-3"></div>
          <div className="text-sm text-gray-500">Loading rating...</div>
        </div>
      ) : (
        <>
          {existing && !editMode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-lg font-medium">
                    Your rating:{" "}
                    <span className={`font-bold ${existing.isPos ? 'text-[#FBBC04]' : 'text-gray-500'}`}>
                      {existing.isPos ? '+' : '-'}
                    </span>
                  </div>
                  {existing.comment && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{existing.comment}"</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(true);
                    setScore(existing.isPos ? 1 : -1);
                    reset({ descriptionRating: existing.comment || '' });
                  }}
                  className="bg-[#FBBC04] hover:bg-[#e0a800] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Edit Rating
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-500">Select your sentiment:</span>
                <div className="flex items-center gap-6 justify-center">
                  <button
                    type="button"
                    onClick={() => setScore(-1)}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      score === -1 ? "bg-gray-500 border-gray-600 text-white shadow-inner" : "bg-gray-100 border-transparent text-gray-600"
                    }`}
                    disabled={loading}
                  >
                    -
                  </button>

                  <div className="text-2xl font-bold w-8 text-center">
                    {score === 0 ? "?" : score > 0 ? "+" : "-"}
                  </div>

                  <button
                    type="button"
                    onClick={() => setScore(1)}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      score === 1 ? "bg-[#FBBC04] border-[#e0a800] text-white shadow-inner" : "bg-gray-100 border-transparent text-gray-600"
                    }`}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  {...register("descriptionRating")}
                  placeholder={`Write your experience about the ${type}...`}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm h-28 resize-none focus:ring-2 focus:ring-[#FBBC04] focus:border-transparent"
                  disabled={loading}
                />
                {errors.descriptionRating && (
                  <p className="text-red-500 text-sm mt-1">{errors.descriptionRating.message}</p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <div className="flex justify-end gap-3">
                {editMode && (
                  <button
                    type="button"
                    className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setEditMode(false);
                      setScore(0);
                      reset();
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FBBC04] hover:bg-[#e0a800] text-white px-6 py-2 rounded-md shadow transition-colors disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : (existing ? 'Update Rating' : 'Submit Rating')}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Rating;