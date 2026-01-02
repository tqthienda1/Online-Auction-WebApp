import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"; // Bỏ useSearchParams nếu chưa dùng
import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import AdminPagination from "@/components/AdminPagination";
import { useAuth } from "@/context/AuthContext";

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSide, setIsLoadingSide] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [order, setOrder] = useState("asc");
  const [sort, setSort] = useState("startTime");

  const [filterTrigger, setFilterTrigger] = useState(0);

  const [searchParamS, setSearchParamS] = useSearchParams();

  useEffect(() => {
    setSearchParamS({
      page: page.toString(),
      limit: limit.toString(),
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      order: order,
      sortBy: sort,
    });
  }, [id, page, limit, minPrice, maxPrice, order, sort]);

  useEffect(() => {
    const getProductsData = async () => {
      const controller = new AbortController();
      try {
        setIsLoading(true);
        console.log(keyword);

        if (keyword) {
          const data = await http.get(`products/search/${keyword}`, {
            params: {
              page,
              limit,
              sortBy: sort,
              order,
              minPrice,
              maxPrice,
            },
            signal: controller.signal,
          });

          console.log(data.data);
          setTotalPages(data.data.total);
          setProducts(data.data.data);
        } else {
          const data = await http.get(
            `products?category=${id}&page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${order}&sortBy=${sort}`,
            {
              signal: controller.signal,
            }
          );

          console.log(data.data.data);

          setTotalPages(data.data.totalPages);
          setProducts(data.data.data);
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error(error);
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getProductsData();
  }, [id, page, limit, sort, order, filterTrigger, keyword]);

  const handlePriceChange = (priceValue) => {
    const [min, max] = priceValue;
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleViewResult = () => {
    setPage(1);
    setFilterTrigger((prev) => prev + 1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    console.log(newSort);
    setPage(1);
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    console.log(newOrder);
    setPage(1);
  };

  const handleDeleteFromWatchList = async (id) => {
    const controller = new AbortController();
    try {
      setIsLoadingSide(true);
      await http.delete(`/watchlist/${id}`, { signal: controller.signal });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isLiked: false } : p))
      );
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoadingSide(false);
    }
  };

  const handleAddToWatchList = async (id) => {
    const controller = new AbortController();
    try {
      setIsLoadingSide(true);
      await http.post(
        `/watchlist`,
        { productId: id },
        { signal: controller.signal }
      );

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isLiked: true } : p))
      );
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoadingSide(false);
    }
  };

  return (
    <>
      {!error && (
        <div>
          <main className="grid grid-cols-10 gap-8 px-5 py-10">
            <div className="col-span-2">
              <Sidebar
                onPriceChange={handlePriceChange}
                onViewResult={handleViewResult}
                onSortChange={handleSortChange}
                onOrderChange={handleOrderChange}
              />
            </div>

            <div className="col-span-8 flex flex-col min-h-[600px]">
              {isLoading ? (
                <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
                  <Spinner className="size-8 w-full text-yellow-500" />
                  <h3 className="font-semibold my-6 text-body">Loading</h3>
                </div>
              ) : (
                <>
                  <div className="grow mb-4">
                    <ProductList
                      showType={1}
                      products={products}
                      onRemoveFromWatchList={handleDeleteFromWatchList}
                      onAddToWatchList={handleAddToWatchList}
                      isLoading={isLoadingSide}
                    />
                  </div>

                  <AdminPagination
                    totalPages={totalPages}
                    page={page}
                    onPageChange={setPage}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
