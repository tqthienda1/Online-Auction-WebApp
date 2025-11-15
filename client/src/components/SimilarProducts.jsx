import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formattedDate } from "@/helper/formatDate";

const SimilarProducts = ({ products }) => {
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
            {products.map((p, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <img
                        src={p.img}
                        alt={`image product ${index}`}
                        className="w-58 h-68 object-contain"
                      />
                      <p className="text-xl font-playfair font-medium mt-5">
                        {p.name}
                      </p>

                      <p className="text-xl font-bold text-yellow-400">
                        <span className="font-bold">$</span> {p.price}
                      </p>

                      <div className="flex flex-col w-full justify-center items-center">
                        <div className="flex w-full justify-between items-end">
                          <p className="">Highest Bidder</p>
                          <p>{p.highestBid}</p>
                        </div>

                        <div className="flex w-full justify-between items-end">
                          <p>Buy Now Price</p>
                          <p className="text-yellow-400 font-medium">
                            <span className="font-bold">$ </span>
                            {p.buyNowPrice}
                          </p>
                        </div>

                        <div className="flex w-full justify-between items-end">
                          <p>Ending Date</p>
                          <p>{formattedDate(p.endingDate)}</p>
                        </div>

                        <div className="flex mt-5 justify-between items-center gap-5 w-full">
                          <button
                            type="button"
                            className="text-lg font-bold w-1/2 h-12 border border-black transition duration-200 ease-out hover:scale-105 rounded-sm uppercase"
                          >
                            Buy Now
                          </button>

                          <button
                            type="button"
                            className="text-lg font-bold w-1/2 h-12 bg-yellow-400 transition duration-200 ease-out hover:scale-105 rounded-sm uppercase"
                          >
                            Bid Now
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};

export default SimilarProducts;
