import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formattedDate } from "@/helper/formatDate";
import { Link, useNavigate } from "react-router-dom";

const SimilarProducts = ({ products, onBuyNow, user }) => {
  const navigate = useNavigate();
  const handleBuyNowClick = ({ productId, end, start }) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const now = new Date();

    if (end <= now || start > now) return;

    onBuyNow?.(productId);
  };
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center gap-10">
        <p className="text-4xl font-bold font-playfair underline decoration-yellow-400 decoration-3 underline-offset-8">
          You May Like
        </p>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-[90%]"
        >
          <CarouselContent>
            {products.map((p, index) => {
              return (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      {/* <Link
                        to={`/products/${p.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={`View product ${p.productName}`}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      /> */}

                      <CardContent className="relative z-0 flex flex-col aspect-square items-center justify-center p-6">
                        <Link
                          to={`/products/${p.id}`}
                          onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                          className="flex flex-col items-center text-center"
                        >
                          <img
                            src={p.productAvt}
                            alt={p.productName}
                            className="w-58 h-68 object-contain transition-transform duration-200 hover:scale-105"
                          />

                          <p className="text-xl font-playfair font-medium mt-5 text-center line-clamp-2 min-h-[3.5rem]">
                            {p.productName}
                          </p>
                        </Link>

                        <p className="text-xl font-bold text-yellow-400">
                          <span className="font-bold">$</span>{" "}
                          {p.currentPrice ?? p.startingPrice}
                        </p>

                        <div className="flex flex-col w-full justify-center items-center">
                          <div className="flex w-full justify-between items-end">
                            <p>Buy Now Price</p>
                            <p className="text-yellow-400 font-medium">
                              <span className="font-bold">$ </span>
                              {p.buyNowPrice}
                            </p>
                          </div>

                          <div className="flex w-full justify-between items-end">
                            <p>Ending Date</p>
                            <p>{formattedDate(p.endTime)}</p>
                          </div>

                          <div className="relative z-20 flex mt-5 justify-between items-center w-full gap-5">
                            <button
                              type="button"
                              onClick={(e) => {
                                handleBuyNowClick({
                                  productId: p.id,
                                  end: p.endTime,
                                  start: p.startTime,
                                });
                              }}
                              className="text-lg font-bold w-1/2 h-12 border border-black transition duration-200 ease-out hover:scale-105 rounded-sm uppercase cursor-pointer"
                            >
                              Buy Now
                            </button>

                            <Link
                              to={`/products/${p.id}`}
                              className="flex items-center justify-center text-lg font-bold w-1/2 h-12 bg-yellow-400 transition duration-200 ease-out hover:scale-105 rounded-sm uppercase"
                            >
                              Bid Now
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};

export default SimilarProducts;
