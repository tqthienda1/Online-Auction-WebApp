import React, { useEffect, useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import ProfileReviews from "../components/ProfileReviews";
import ProfileTab from "../components/ProfileTab";
import ProductList from "@/components/ProductList";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

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
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      setLoading(true);
      try {
        const res = await Promise.all([
          http.get("/user/"),
          http.get("/upgrade/me"),
        ]);

        res[0].data.upgrade = res[1].data;

        console.log(res[0].data);

        setInfo(res[0].data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);


  const wishlistItems = MOCK_PRODUCTS.slice(0, 2);
  const biddingItems = MOCK_PRODUCTS.slice(2, 4);
  const wonAuctions = MOCK_PRODUCTS.slice(4, 6);

  return (
    <>
      {loading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
      {!loading && (
        <div className="flex flex-col items-center justify-center">
          <ProfileInfo info={info} setInfo={setInfo} />
          <ProfileReviews />
          <ProfileTab tab={tab} setTab={setTab} />
          <div className="my-10 w-3/4 ">
            <ProductList
              showType={tab === "love" ? 2 : tab === "bidding" ? 3 : 4}
              products={
                tab === "love"
                  ? wishlistItems
                  : tab === "bidding"
                  ? biddingItems
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
