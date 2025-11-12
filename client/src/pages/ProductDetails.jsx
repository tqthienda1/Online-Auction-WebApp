import ProductCarousel from "../components/ProductCarousel.jsx";
import ProductTitle from "../components/ProductTitle.jsx";
import DetailNavBar from "../components/DetailNavBar.jsx";
import ProductDescription from "../components/ProductDescription.jsx";
import { useState } from "react";
import ProductBidPlace from "../components/ProductBidPlace.jsx";
import BidHistory from "../components/BidHistory.jsx";

const ProductDetails = () => {
  const images = [
    "/image/detail_1.jpg",
    "/image/detail_2.jpg",
    "/image/detail_3.jpg",
  ];

  const frontImage = "/image/detail_front.jpg";
  const backImage = "/image/detail_back.jpg";

  const nameMain = "PATEK PHILIPPE GRAND COMPLICATIONS";
  const nameSub = "6104R-001H";

  const endingDate = "2025-11-19T12:05:00";
  const price = "57,000";
  const buyNowPrice = "100,000";

  const descriptions = [
    {
      title: "Heavenly radiance",
      content: `Thanks to its three superimposed ultra-thin sapphire crystal disks - one for the Moon - this self-winding watch with date display enables ohne to admire the configuration of the nightvhmoment. A stunning show enhanced on this rose gold version by a bezel set with baguette-cut diamonds.

      The dial shows the exact configuration of the sky in the northern hemisphere. Apparent movement of the stars and the phases and orbit of the Moon.

      An ellipse deposited on the underside of the sapphire glass frames the portion of the sky visible from Geneva and all other cities located at the same latitude.

      Skeletonized hands showing the hours and minutes of mean solar time. Shiny black alligator leather strap with rose gold diamond-set fold-over clasp.`,
    },
    {
      title: "Technical characteristics",
      content: `Thanks to its three superimposed ultra-thin sapphire crystal disks - one for the Moon - this self-winding watch with date display enables ohne to admire the configuration of the nightvhmoment. A stunning show enhanced on this rose gold version by a bezel set with baguette-cut diamonds.

      The dial shows the exact configuration of the sky in the northern hemisphere. Apparent movement of the stars and the phases and orbit of the Moon.

      An ellipse deposited on the underside of the sapphire glass frames the portion of the sky visible from Geneva and all other cities located at the same latitude.

      Skeletonized hands showing the hours and minutes of mean solar time. Shiny black alligator leather strap with rose gold diamond-set fold-over clasp.`,
    },
  ];

  const seller = {
    name: "Long Ngo",
    rate: "4.5",
  };

  const bidder = {
    name: "Long Ngo",
    highestBid: "57,000",
  };

  const bidHistory = [
    {
      id: "1",
      bidderName: "Sarah Investor",
      date: "2025-11-12T14:32:00Z",
      price: 230.0,
    },
    {
      id: "2",
      bidderName: "Michael Tran",
      date: "2025-11-12T14:45:00Z",
      price: 245.5,
    },
    {
      id: "3",
      bidderName: "Anna Lee",
      date: "2025-11-12T15:02:00Z",
      price: 250.0,
    },
    {
      id: "4",
      bidderName: "Long Ngo",
      date: "2025-11-12T15:15:00Z",
      price: 257.5,
    },
    {
      id: "5",
      bidderName: "David Nguyen",
      date: "2025-11-12T15:29:00Z",
      price: 263.0,
    },
  ];

  const [curFrame, setCurFrame] = useState("description");

  const handleFrameChange = (frame) => {
    setCurFrame(frame);
  };

  return (
    <>
      <div className="p-10">
        <ProductCarousel images={images} />
      </div>
      <ProductTitle nameMain={nameMain} nameSub={nameSub} isActive={true} />

      <div className="flex ">
        <div className="flex flex-col w-3/4 ">
          <DetailNavBar
            frame={curFrame}
            onFrameChange={handleFrameChange}
          ></DetailNavBar>
          {curFrame === "description" && (
            <ProductDescription
              descriptions={descriptions}
              frontImage={frontImage}
              backImage={backImage}
            />
          )}

          {curFrame === "bidhistory" && <BidHistory BidHistory={bidHistory} />}
        </div>
        <ProductBidPlace
          endingDate={endingDate}
          price={price}
          buyNowPrice={buyNowPrice}
          seller={seller}
          bidder={bidder}
        />
      </div>
    </>
  );
};

export default ProductDetails;
