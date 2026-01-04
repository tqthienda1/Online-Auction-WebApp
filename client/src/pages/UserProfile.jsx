import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import ProfileReviews from "../components/ProfileReviews";
import ProfileTab from "../components/ProfileTab";
import ProductList from "@/components/ProductList";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";

const UserProfile = () => {
  const [tab, setTab] = useState("watchList");
  const [info, setInfo] = useState(null);
  const { user, loading } = useAuth();
  const [loadUpgrade, setLoadUpgrade] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadUserInfo = async () => {
      try {
        const res = await http.get("/upgrade/me");

        user.data.upgrade = res.data;

        setInfo(user.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoadUpgrade(false);
      }
    };

    loadUserInfo();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    console.log(info);
  }, [info]);

  // determine if this account is a seller (case-insensitive checks against several possible fields)
  const _role =
    info?.role ||
    info?.data?.role ||
    user?.role ||
    user?.data?.role ||
    info?.upgrade?.role;

  const isSeller = Boolean(
    (_role && String(_role).toUpperCase() === "SELLER") ||
      info?.isSeller ||
      info?.seller ||
      info?.upgrade?.isSeller ||
      info?.upgrade?.seller
  );

  // Ensure tab validity when role changes
  useEffect(() => {
    if (!isSeller && (tab === "selling" || tab === "sold")) {
      setTab("watchList");
    }
  }, [isSeller, tab]);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [sellingItems, setSellingItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [biddingItems, setBiddingItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wonLoading, setWonLoading] = useState(false);
  const [sellingLoading, setSellingLoading] = useState(false);
  const [soldLoading, setSoldLoading] = useState(false);
  const [biddingLoading, setBiddingLoading] = useState(false);

  useEffect(() => {
    if (loading || !user?.id) return; // wait for auth

    let mounted = true;

    const loadWatchlist = async () => {
      setWishlistLoading(true);
      try {
        const res = await http.get("/watchlist");

        console.debug("/watchlist response:", res?.data);

        // API responds with { data: products, ... }
        if (mounted) setWishlistItems(res.data?.data || []);
      } catch (err) {
        // If request was cancelled by axios it has code 'ERR_CANCELED' or message 'canceled'
        const isCanceled =
          err?.code === "ERR_CANCELED" || /canceled/i.test(err?.message || "");
        if (isCanceled) {
          console.debug("Watchlist request canceled");
          return;
        }

        console.error(
          "Failed to load watchlist:",
          err?.response?.data || err.message || err
        );

        // If unauthorized or forbidden, ensure empty list and optionally show UI later
        if (mounted) setWishlistItems([]);
      }
      finally {
        if (mounted) setWishlistLoading(false);
      }
    };

    const loadWonAuctions = async () => {
      setWonLoading(true);
      try {
        const res = await http.get("/orders/won/orders");

        console.debug("/orders/won/orders response:", res?.data);

        // API responds with { orders: products, total, ... }
        if (mounted) setWonAuctions(res.data?.orders || []);
      } catch (err) {
        // If request was cancelled by axios it has code 'ERR_CANCELED' or message 'canceled'
        const isCanceled =
          err?.code === "ERR_CANCELED" || /canceled/i.test(err?.message || "");
        if (isCanceled) {
          console.debug("Won auctions request canceled");
          return;
        }

        console.error(
          "Failed to load won auctions:",
          err?.response?.data || err.message || err
        );

        // If unauthorized or forbidden, ensure empty list and optionally show UI later
        if (mounted) setWonAuctions([]);
      }
      finally {
        if (mounted) setWonLoading(false);
      }
    };

    // const loadSellingItems = async () => {
    //   try {
    //     // determine user id from available places
    //     const userId = user?.id || user?.data?.id || info?.id;
    //     if (!userId) {
    //       setSellingItems([]);
    //       return;
    //     }

    //     const res = await http.get(`/products?sellerID=${userId}`);

    //     // API may return { data: products } or an array directly
    //     const products = res.data?.data || res.data || [];

    //     // filter for unsold and not expired
    //     const now = Date.now();
    //     const active = (products || []).filter(
    //       (p) => p && !p.sold && new Date(p.endTime).getTime() > now
    //     );

    //     setSellingItems(active);
    //   } catch (err) {
    //     const isCanceled = err?.code === "ERR_CANCELED" || /canceled/i.test(err?.message || "");
    //     if (isCanceled) return;
    //     console.error("Failed to load selling items:", err?.response?.data || err.message || err);
    //     setSellingItems([]);
    //   }
    // };

    const loadSellingItems = async () => {
      setSellingLoading(true);
      try {
        // Ưu tiên lấy info.id hoặc user.id (đây là Primary Key trong DB của bạn)
        // Thay vì lấy user.id chung chung có thể bị nhầm với supabaseId từ AuthContext
        const userId = info?.id || user?.id || user?.data?.id;

        if (!userId) {
          console.warn("No UserID found to fetch selling items");
          return;
        }

        console.debug("Fetching selling products for Seller ID:", userId);

        const res = await http.get(`/products`, {
          params: {
            sellerId: userId,
            sold: false, // Explicitly request unsold products
            sortBy: "startTime",
            order: "desc",
          },
        });

        const products = res.data?.data || [];
        const now = Date.now();
        const active = products.filter(
          (p) => p && !p.sold && new Date(p.endTime).getTime() > now
        );

        console.debug("Active selling items count:", active.length);
        if (mounted) setSellingItems(active);
      } catch (err) {
        console.error("Failed to load selling items:", err);
        if (mounted) setSellingItems([]);
      }
      finally {
        if (mounted) setSellingLoading(false);
      }
    };

    const loadSoldItems = async () => {
      setSoldLoading(true);
      try {
        const userId = info?.id || user?.id || user?.data?.id;

        if (!userId) {
          console.warn("No UserID found to fetch sold items");
          return;
        }

        console.debug("Fetching sold products for Seller ID:", userId);

        const res = await http.get(`/products`, {
          params: {
            sellerId: userId,
            sold: true, // Explicitly request sold products only
          },
        });

        const products = res.data?.data || [];
        console.debug("Sold items count:", products.length);
        if (mounted) setSoldItems(products);
      } catch (err) {
        console.error("Failed to load sold items:", err);
        if (mounted) setSoldItems([]);
      }
      finally {
        if (mounted) setSoldLoading(false);
      }
    };

    const loadBiddingItems = async () => {
      setBiddingLoading(true);
      try {
        const userId = info?.id || user?.id || user?.data?.id;

        if (!userId) {
          console.warn("No UserID found to fetch bidding items");
          return;
        }

        console.debug("Fetching bidding products for User ID:", userId);

        // Fetch products where user has placed bids
        const res = await http.get(`/bids/bidding`);

        const products = res.data?.data || [];
        console.debug("Active bidding items count:", products.length);
        if (mounted) setBiddingItems(products);
      } catch (err) {
        console.error("Failed to load bidding items:", err);
        if (mounted) setBiddingItems([]);
      }
      finally {
        if (mounted) setBiddingLoading(false);
      }
    };
    loadWatchlist();
    loadWonAuctions();
    loadSellingItems();
    loadSoldItems();
    loadBiddingItems();

    return () => {
      mounted = false;
    };
  }, [loading, user, info]);

  return (
    <>
      {(loading || loadUpgrade) && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
      {!loading && !loadUpgrade && (
        <div className="flex flex-col items-center justify-center">
          {info ? (
            <ProfileInfo info={info} setInfo={setInfo} />
          ) : (
            <div className="w-3/4 p-6 bg-white rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500">User information not available.</p>
            </div>
          )}
          <ProfileReviews />
          <ProfileTab tab={tab} setTab={setTab} isSeller={isSeller} />
          <div className="my-10 w-3/4 ">
            {((tab === "watchList" && wishlistLoading) ||
              (tab === "bidding" && biddingLoading) ||
              (tab === "won" && wonLoading) ||
              (tab === "selling" && sellingLoading) ||
              (tab === "sold" && soldLoading)) ? (
              <div className="flex flex-col justify-center p-4 md:p-5 text-center">
                <Spinner className="size-8 w-full text-yellow-500" />
                <h3 className="font-semibold my-6 text-body">Loading</h3>
              </div>
            ) : (
              <ProductList
                showType={
                  tab === "watchList"
                    ? 2
                    : tab === "bidding"
                    ? 3
                    : tab === "won"
                    ? 4
                    : tab === "selling"
                    ? 5
                    : 6
                }
                products={
                  tab === "watchList"
                    ? wishlistItems
                    : tab === "bidding"
                    ? biddingItems
                    : tab === "selling"
                    ? sellingItems
                    : tab === "sold"
                    ? soldItems
                    : wonAuctions
                }
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
