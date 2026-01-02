import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import ProfileReviews from "../components/ProfileReviews";
import ProfileTab from "../components/ProfileTab";
import ProductList from "@/components/ProductList";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";

const MOCK_PRODUCTS = [
  {
    id: "p1-1111-aaaa-bbbb-0001",
    sellerID: "u-seller-001",
    highestBidderID: null,
    productName: "iPhone 14 Pro Max 256GB",
    productAvt: "/image/camera.png",
    categoryID: "cate-electronics",
    startingPrice: 15000000,
    bidStep: 200000,
    buyNowPrice: 23000000,
    currentPrice: 15000000,
    startTime: "2025-01-01T10:00:00.000Z",
    endTime: "2025-01-05T10:00:00.000Z",
    autoExtend: true,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p2-1111-aaaa-bbbb-0002",
    sellerID: "u-seller-002",
    highestBidderID: "u-bidder-777",
    productName: "Macbook Air M2 2023",
    productAvt: "/image/camera.png",
    categoryID: "cate-electronics",
    startingPrice: 18000000,
    bidStep: 300000,
    buyNowPrice: 28000000,
    currentPrice: 19600000,
    startTime: "2025-01-03T12:00:00.000Z",
    endTime: "2025-01-07T12:00:00.000Z",
    autoExtend: true,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p3-1111-aaaa-bbbb-0003",
    sellerID: "u-seller-003",
    highestBidderID: null,
    productName: "Giày Nike Air Jordan 1 Retro",
    productAvt: "/image/camera.png",
    categoryID: "cate-fashion",
    startingPrice: 2500000,
    bidStep: 100000,
    buyNowPrice: 4500000,
    currentPrice: 2500000,
    startTime: "2025-01-04T08:00:00.000Z",
    endTime: "2025-01-09T08:00:00.000Z",
    autoExtend: false,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p4-1111-aaaa-bbbb-0004",
    sellerID: "u-seller-004",
    highestBidderID: null,
    productName: "Đồng hồ Casio G-Shock GA-2100",
    productAvt: "/image/camera.png",
    categoryID: "cate-accessories",
    startingPrice: 1200000,
    bidStep: 50000,
    buyNowPrice: 2500000,
    currentPrice: 1200000,
    startTime: "2025-01-02T09:30:00.000Z",
    endTime: "2025-01-06T09:30:00.000Z",
    autoExtend: false,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p5-1111-aaaa-bbbb-0005",
    sellerID: "u-seller-002",
    highestBidderID: "u-bidder-999",
    productName: "Tai nghe Sony WH-1000XM5",
    productAvt: "/image/camera.png",
    categoryID: "cate-electronics",
    startingPrice: 5000000,
    bidStep: 150000,
    buyNowPrice: 8000000,
    currentPrice: 5450000,
    startTime: "2025-01-03T07:00:00.000Z",
    endTime: "2025-01-06T07:00:00.000Z",
    autoExtend: true,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p6-1111-aaaa-bbbb-0006",
    sellerID: "u-seller-001",
    highestBidderID: null,
    productName: "Bàn phím cơ Keychron K6",
    productAvt: "/image/camera.png",
    categoryID: "cate-computer-accessories",
    startingPrice: 1500000,
    bidStep: 50000,
    buyNowPrice: 3000000,
    currentPrice: 1500000,
    startTime: "2025-01-01T15:00:00.000Z",
    endTime: "2025-01-04T15:00:00.000Z",
    autoExtend: false,
    sold: false,
    ratingRequired: false,
  },
];

const UserProfile = () => {
  const [tab, setTab] = useState("love");
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

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [sellingItems, setSellingItems] = useState([]);
  const biddingItems = MOCK_PRODUCTS.slice(2, 4);

  useEffect(() => {
    if (loading || !user?.id) return; // wait for auth

    let mounted = true;

    const loadWatchlist = async () => {
      try {
        const res = await http.get("/watchlist");

        console.debug("/watchlist response:", res?.data);

        // API responds with { data: products, ... }
        if (mounted) setWishlistItems(res.data?.data || []);
      } catch (err) {
        // If request was cancelled by axios it has code 'ERR_CANCELED' or message 'canceled'
        const isCanceled = err?.code === "ERR_CANCELED" || /canceled/i.test(err?.message || "");
        if (isCanceled) {
          console.debug("Watchlist request canceled");
          return;
        }

        console.error("Failed to load watchlist:", err?.response?.data || err.message || err);

        // If unauthorized or forbidden, ensure empty list and optionally show UI later
        if (mounted) setWishlistItems([]);
      }
    };

    const loadWonAuctions = async () => {
      try {
        const res = await http.get("/orders/won/orders");

        console.debug("/orders/won/orders response:", res?.data);

        // API responds with { orders: products, total, ... }
        if (mounted) setWonAuctions(res.data?.orders || []);
      } catch (err) {
        // If request was cancelled by axios it has code 'ERR_CANCELED' or message 'canceled'
        const isCanceled = err?.code === "ERR_CANCELED" || /canceled/i.test(err?.message || "");
        if (isCanceled) {
          console.debug("Won auctions request canceled");
          return;
        }

        console.error("Failed to load won auctions:", err?.response?.data || err.message || err);

        // If unauthorized or forbidden, ensure empty list and optionally show UI later
        if (mounted) setWonAuctions([]);
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
  try {
    // Ưu tiên lấy info.id hoặc user.id (đây là Primary Key trong DB của bạn)
    // Thay vì lấy user.id chung chung có thể bị nhầm với supabaseId từ AuthContext
    const userId = info?.id || user?.id || user?.data?.id;

    if (!userId) {
      console.warn("No UserID found to fetch selling items");
      return;
    }

    console.debug("Fetching products for Seller ID:", userId);

    const res = await http.get(`/products`, {
      params: {
        sellerId: userId, // Truyền UserID thực tế vào đây
        sortBy: "startTime",
        order: "desc",
      }
    });

    const products = res.data?.data || [];
    const now = Date.now();
    const active = products.filter(
      (p) => p && !p.sold && new Date(p.endTime).getTime() > now
    );

    setSellingItems(active);
  } catch (err) {
    console.error("Failed to load selling items:", err);
  }
};
    loadWatchlist();
    loadWonAuctions();
    loadSellingItems();

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
          <ProfileTab tab={tab} setTab={setTab} />
          <div className="my-10 w-3/4 ">
            <ProductList
  showType={
    tab === "watchList" || tab === "selling" ? 2 : tab === "bidding" ? 3 : 4
  }
  products={
    tab === "watchList"
      ? wishlistItems
      : tab === "bidding"
      ? biddingItems
      : tab === "selling"
      ? sellingItems
      : wonAuctions
  }
/>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
