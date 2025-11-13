import ProductCarousel from "../components/ProductCarousel.jsx";
import ProductTitle from "../components/ProductTitle.jsx";
import DetailNavBar from "../components/DetailNavBar.jsx";
import ProductDescription from "../components/ProductDescription.jsx";
import { useEffect, useState } from "react";
import ProductBidPlace from "../components/ProductBidPlace.jsx";
import BidHistory from "../components/BidHistory.jsx";

const ProductDetails = () => {
  const product = {
    images: [
      "/image/detail_1.jpg",
      "/image/detail_2.jpg",
      "/image/detail_3.jpg",
    ],
    frontImage: "/image/detail_front.jpg",
    backImage: "/image/detail_back.jpg",
    name: "PATEK PHILIPPE GRAND COMPLICATIONS",
    code: "6104R-001H",
    isActive: "true",
    endingDate: "2025-11-19T12:05:00",
    price: "57,000",
    buyNowPrice: "100,000",
    descriptions: [
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
    ],
    bidHistory: [
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
    ],
  };

  const seller = {
    name: "Long Ngo",
    rate: "4.5",
  };

  const bidder = {
    name: "Long Ngo",
    highestBid: "57,000",
  };

  // Nho set isLoading ve true
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // const productId = useParams();
  // const [product, setProduct] = useState([]);
  const [curFrame, setCurFrame] = useState("description");

  // useEffect(() => {
  //   let isMounted = true;

  //   const loadProduct = async (productId) => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);

  //       // const res = await fetch(`https://localhost/api/products/${productId}`);
  //       // const data = res.json();

  //       // if (isMounted) {
  //       //   setProduct(data);
  //       // }
  //     } catch (error) {
  //       console.error("Error loading product");
  //       if (isMounted) setError(error.message || "Unable to load products");
  //     } finally {
  //       if (isMounted) setIsLoading(false);
  //     }
  //   };

  //   loadProduct();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const handleFrameChange = (frame) => {
    setCurFrame(frame);
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>{isError}</div>}
      {!isLoading && !isError && (
        <>
          <div className="p-10">
            <ProductCarousel images={product.images} />
          </div>
          <ProductTitle
            nameMain={product.name}
            nameSub={product.code}
            isActive={product.isActive}
          />

          <div className="flex">
            <div className="flex flex-col w-3/4 ">
              <DetailNavBar
                frame={curFrame}
                onFrameChange={handleFrameChange}
              ></DetailNavBar>
              {curFrame === "description" && (
                <ProductDescription
                  descriptions={product.descriptions}
                  frontImage={product.frontImage}
                  backImage={product.backImage}
                />
              )}

              {curFrame === "bidhistory" && (
                <BidHistory BidHistory={product.bidHistory} />
              )}
            </div>
            <ProductBidPlace
              endingDate={product.endingDate}
              price={product.price}
              buyNowPrice={product.buyNowPrice}
              seller={seller}
              bidder={bidder}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
