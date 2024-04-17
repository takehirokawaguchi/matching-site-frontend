import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { fetchProductList } from '../../features/product/productSlice';
import { useAppSelector, useAppDispatch } from "../../app/hooks";

interface Product {
  id: number;
  title: string;
  detail: string;
  thumbnail: string;
  detail_url: string;
  created_at: string;
  updated_at: string;
  user: number;
}

const ProductList: React.FC = () => {

  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(fetchProductList())
  }, [])

  const productListFromRedux = useAppSelector(
    (state) => state.product.productList
  ); 

  useEffect(() => {
    setProducts(productListFromRedux)
  }, [productListFromRedux]);

  const { user } = useAppSelector(
    (state) => state.auth
  );

  // 人事が学生にチャットを送る画面
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="text-center my-8">
        <h2 className="text-4xl font-bold">Products</h2>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {products.map((product) => (
            user ? (
            <>
              <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                <div className="border rounded shadow-sm overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out">
                  <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold">{product.title}</h3>
                    <p className="text-gray-600 text-sm">作成日: {new Date(product.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            </>
            ):(
            <>
              <div
                onClick={toggleModal}
                key={product.id}
                className="product-card border rounded shadow-sm overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out"
              >
                <img src={product.thumbnail} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold">{product.title}</h3>
                  <p className="text-gray-600 text-sm">作成日: {new Date(product.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {isModalOpen &&(
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 flex justify-center items-center">
                  <div className="bg-white p-8 rounded shadow-lg md:w-1/2 w-full flex flex-col items-center justify-center">
                    <h2 className="font-bold mb-4 flex justify-center">ログインすると、詳細情報が閲覧できるようになります。</h2>
                      <div className="text-center py-2 px-4">
                        <Link to="/login" className="text-blue-500">ログインはこちら</Link>
                      </div>
                      <div className="text-center py-2 px-4">
                        <Link to="/register" className="text-blue-500">新規会員登録はこちら</Link>
                      </div>
                    <button 
                      onClick={toggleModal}
                      className="mt-6 py-2 px-6 text-blue-500 flex justify-center"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              )}
            </>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;