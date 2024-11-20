import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'primereact/carousel';
import { Link } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getCategories } from '../../actions/categoryAction';

export default function CarouselLayout({ category }) {
    const { getcategory } = useSelector((state) => state.categoryState);
    const dispatch = useDispatch();
    const [cardWidth, setCardWidth] = useState(0); // Initial width
    // console.log("cardwidth",cardWidth)

    const responsiveOptions = [
        { breakpoint: '1600.5px', numVisible: 7, numScroll: 1 },
        { breakpoint: '1199.5px', numVisible: 6, numScroll: 1 },
        { breakpoint: '992.5px', numVisible: 5, numScroll: 1 },
        { breakpoint: '767.5px', numVisible: 4, numScroll: 1 },
        { breakpoint: '480.5px', numVisible: 3, numScroll: 1 },
    ];

    useEffect(() => {
        if (!getcategory) {
            dispatch(getCategories());
        }

        // Calculate card width based on screen width and numVisible value
        const updateCardWidth = () => {
            const width = window.innerWidth;
            // Find the matching responsive option based on current screen size
            const option = responsiveOptions.find(opt => width <= parseInt(opt.breakpoint)) || responsiveOptions[0];
            const calculatedWidth = (width) / option.numVisible; // Calculate based on screen width and number of visible items
            setCardWidth(calculatedWidth); // Set the new card width
        };

        // Call it initially
        updateCardWidth();

        // Add event listener to update card width on window resize
        window.addEventListener('resize', updateCardWidth);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', updateCardWidth);

    }, [getcategory, dispatch]);

    const filteredCategories = getcategory?.filter((item) => item.category !== category);

    const productTemplate = (product) => (
        <div style={{
            maxWidth: `${cardWidth}px`,
            minWidth: `${cardWidth}px`,
            minHeight: `${cardWidth}px`,
            // maxHeight: `${cardWidth}px`,
            margin: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px',
            boxSizing: 'border-box',
            // backgroundColor: '#fff',
        }}>
            <Link to={`/categories/${product.category}`} state={{ category: product.category }} style={{ textDecoration: 'none', padding: '0px', margin: '0px' }}>
                <div className="carosel-card" style={{
                    maxWidth: `${cardWidth}px`,
                    minWidth: `${cardWidth}px`,
                    height: `${cardWidth}px`,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '0px',
                    margin: '0px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                     backgroundColor: '#fff',
                }}>
                    {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].image} alt={product.name} style={{
                            width: '100%',
                            height: '70%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                        }} />
                    ) : (
                        <div style={{ textAlign: 'center', paddingTop: '40%' }}>No Image</div>
                    )}
                    <div style={{
                        color: 'black',
                        fontWeight: 'bold'
                    }} className="card-title-vegetable">{product.name}
                    </div>
                </div>
            </Link>
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '97vw', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f5f5', padding: '15px' }}>
            {
                filteredCategories && (
                    <Carousel
                        value={filteredCategories || []}
                        numScroll={1}
                        numVisible={responsiveOptions[0].numVisible} // First option is used for the initial visible count
                        responsiveOptions={responsiveOptions}
                        circular
                        autoplay // Enable autoplay
                        autoplayInterval={3000}
                        itemTemplate={productTemplate}
                        showIndicators={true}
                        showNavigators={true}
                        style={{ width: '100%', padding: '0px', margin: '3px', boxSizing: 'border-box', height: 'auto' }}
                    />
                )
            }

        </div>
    );
}
