import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../actions/categoryAction';
import Loader from './Layouts/Loader';
import MetaData from './Layouts/MetaData';

const Groceries = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.productsState);
  const { getcategory } = useSelector((state) => state.categoryState);

  useEffect(() => {
    if (!getcategory) {
      dispatch(getCategories());
    }
  }, [dispatch, getcategory]);

  return (
    <div>
      <MetaData
        title="Jas Groceries"
        description="Discover a wide variety of Groceries at our store. Search, filter, and explore and high-quality products."
      />
      <div className="products_heading">Groceries</div>
      <div className="container " style={{ marginTop: '60px' }}>
        {loading ? (
          <Loader />
        ) : (
          <div className="row d-flex justify-content-center">
            {getcategory
              ?.filter((categoryItem) => categoryItem.type === 'Groceries') // Filter by type "fresh"
              .map((categoryItem) => (
                <div
                  key={categoryItem._id}
                  className="col-6 col-xs-5 col-sm-6 col-md-4 col-lg-3 my-3 landingpage-category-card "
                >
                  <Link
                    to={`/categories/${categoryItem.category}`} // Dynamic link based on category name
                    state={{ category: categoryItem.category }}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card p-1 rounded">
                      <div className="d-flex justify-content-center align-items-center square-card">
                        <div className="card-content">
                          {categoryItem.images && categoryItem.images.length > 0 ? (
                            <img
                              className="card-img-top-vegetable"
                              src={categoryItem.images[0].image} // Adjust if the image path differs
                              alt={categoryItem.name}
                            />
                          ) : (
                            <div className="card-img-top-vegetable">No Image</div>
                          )}
                          <div className="card-body d-flex flex-column">
                            <h3 className="card-title-vegetable">{categoryItem.name}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groceries;
