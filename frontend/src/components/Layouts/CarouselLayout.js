
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Carousel } from 'primereact/carousel';
// import { Link } from 'react-router-dom';
// import 'primereact/resources/themes/saga-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';
// import { getCategories } from '../../actions/categoryAction';

// export default function CarouselLayout({ category , type}) {
//     const { getcategory } = useSelector((state) => state.categoryState);
//     const dispatch = useDispatch();
//     const [cardWidth, setCardWidth] = useState(0); // Initial width
//     // console.log("cardwidth",cardWidth)

//     const responsiveOptions = [
//         { breakpoint: '2000.5px', numVisible: 8, numScroll: 1 },
//         { breakpoint: '1600.5px', numVisible: 7, numScroll: 1 },
//         { breakpoint: '1199.5px', numVisible: 6, numScroll: 1 },
//         { breakpoint: '992.5px', numVisible: 5, numScroll: 1 },
//         { breakpoint: '767.5px', numVisible: 4, numScroll: 1 },
//         { breakpoint: '480.5px', numVisible: 3, numScroll: 1 },
//     ];

//     // const carouselElement = document.querySelector('.carosel-content');
//     useEffect(() => {
//         if (!getcategory) {
//             dispatch(getCategories());
//         }

//         // Calculate card width based on screen width and numVisible value
//         const updateCardWidth = () => {
//             const carouselElement = document.querySelector('.carosel-content'); // Get carousel container
//             if (!carouselElement) return;

//             const innerWidth = window.innerWidth;
//             const width = innerWidth * 0.97;
//             // const width = carouselElement.offsetWidth;
//             const option = responsiveOptions.find(opt => width <= parseInt(opt.breakpoint)) || responsiveOptions[0];
//             const calculatedWidth = width / option.numVisible; // Calculate the card width based on visible items
//             setCardWidth(calculatedWidth); // Update the state with the calculated width
//         };

//         // const updateCardWidth = () => {
//         //     const width = window.innerWidth;
//         //     // Find the matching responsive option based on current screen size
//         //     const option = responsiveOptions.find(opt => width <= parseInt(opt.breakpoint)) || responsiveOptions[0];
//         //     const calculatedWidth = (width) / option.numVisible; // Calculate based on screen width and number of visible items
//         //     setCardWidth(calculatedWidth); // Set the new card width
//         // };
//         // Call it initially
//         updateCardWidth();

//         // Add event listener to update card width on window resize
//         window.addEventListener('resize', updateCardWidth);

//         // Cleanup event listener on component unmount
//         return () => window.removeEventListener('resize', updateCardWidth);

//     }, [getcategory, dispatch]);
    

//     const filteredCategories = getcategory?.filter((item) => item.category !== category && item.type === type);

//     const productTemplate = (product) => (
//         <div style={{
//             maxWidth: `${cardWidth}px`,
//             // width:`${cardWidth}px`,
//             // height:`${cardWidth}px`,
//             minWidth: `${cardWidth}px`,
//             minHeight: `${cardWidth}px`,
//             maxHeight: `${cardWidth}px`,
//             margin: '5px',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             // padding: '5px',
//             boxSizing: 'border-box',
//             // backgroundColor: '#fff',
//         }}>
//             <Link to={`/categories/${product.category}`} state={{ category: product.category , type:product.type}} style={{ textDecoration: 'none', padding: '0px', margin: '0px' }}>
//                 <div className="carosel-card" style={{
//                     maxWidth: `${cardWidth}px`,
//                     // width:`${cardWidth}px`,
//                     // height:`${cardWidth}px`,
//                     minWidth: `${cardWidth}px`,
//                     height: `${cardWidth}px`,
//                     border: '1px solid #ddd',
//                     borderRadius: '5px',
//                     padding: '0px',
//                     margin: '0px',
//                     overflow: 'hidden',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                      backgroundColor: '#fff',
//                 }}>
//                     {product.images && product.images.length > 0 ? (
//                         <img src={product.images[0].image} alt={product.name} style={{
//                             width: '100%',
//                             height: '70%',
//                             objectFit: 'contain',
//                             objectPosition: 'center',
//                         }} />
//                     ) : (
//                         <div style={{ textAlign: 'center', paddingTop: '40%' }}>No Image</div>
//                     )}
//                     <div style={{
//                         color: 'black',
//                         fontWeight: 'bold'
//                     }} className="card-title-carousel">{product.name}
//                     </div>
//                 </div>
//             </Link>
//         </div>
//     );

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',maxWidth:'97vw', width: 'auto', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f5f5', padding: '15px' }}>
//             {
//                 filteredCategories && (
//                     <Carousel
//                         value={filteredCategories || []}
//                         numScroll={1}
//                         numVisible={ responsiveOptions[0].numVisible} // Dynamically set based on card width
//                         // responsiveOptions={responsiveOptions}
//                         responsiveOptions={responsiveOptions}
//                         circular
//                         autoplay // Enable autoplay
//                         autoplayInterval={3000}
//                         itemTemplate={productTemplate}
//                         showIndicators={true}
//                         showNavigators={true}
//                         className='carosel-content'
//                         style={{maxWidth: '100%', width: 'auto', padding: '0px', margin: '3px', boxSizing: 'border-box', height: 'auto' }}
//                     />
//                 )
//             }

//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'primereact/carousel';
import { Link } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getCategories } from '../../actions/categoryAction';
import LoaderButton from './LoaderButton';

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);

      window.addEventListener('resize', handleResize);

      // Cleanup event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowWidth;
  };

export default function CarouselLayout({ category,type }) {
    const { getcategory } = useSelector((state) => state.categoryState);
    const dispatch = useDispatch();
    const windowWidth = useWindowWidth();
    const [isLoading, setIsLoading] = useState(true); // State to manage loading
    console.log("windowWidth",windowWidth)
    // console.log("cardwidth",cardWidth)

    useEffect(() => {
        // Simulate a delay of 3 seconds before showing the carousel
        const timer = setTimeout(() => setIsLoading(false), 300);

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, []);
  

    const responsiveOptions = [
        { breakpoint: '2000.5px', numVisible: 8, numScroll: 1 },
        { breakpoint: '1600.5px', numVisible: 7, numScroll: 1 },
        { breakpoint: '1199.5px', numVisible: 6, numScroll: 1 },
        { breakpoint: '992.5px', numVisible: 5, numScroll: 1 },
        { breakpoint: '767.5px', numVisible: 4, numScroll: 1 },
        { breakpoint: '585.5px', numVisible: 3, numScroll: 1 },
        { breakpoint: '380.5px', numVisible: 2, numScroll: 1 },
    ];

    const [cardHeight, setCardHeight] = useState(0);
    const cardRef = React.useRef();

    const handleCardSize = () =>{
        // if (!getcategory) {
        //     dispatch(getCategories());
        // }
        if (cardRef.current) {
            setCardHeight(cardRef.current.offsetWidth);
        }

        const handleResize = () => {
            if (cardRef.current) {
                setCardHeight(cardRef.current.offsetWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }

    useEffect(()=>{
        handleCardSize();
    },[cardRef.current])


    useEffect(() => {
        
        if(windowWidth < 480.5 && cardHeight < 88 ){
            handleCardSize();
        }
        
        if(windowWidth < 767.5 && windowWidth > 480.5 && cardHeight < 120 ){
            handleCardSize();
        }
        if(windowWidth < 992.5 && windowWidth > 767.5 && cardHeight < 140 ){
            handleCardSize();
        }
        if(windowWidth < 1199.5 && windowWidth > 992.5 && cardHeight < 150 ){
            handleCardSize();
        }
        if(windowWidth < 1600.5 && windowWidth > 1199.5 && cardHeight < 160 ){
            handleCardSize();
        }
        if( windowWidth > 1600.5 && cardHeight < 199 ){
            handleCardSize();
        }
       
    }, [cardRef,cardHeight,getcategory,windowWidth,cardRef.current,isLoading]);
    


    const filteredCategories = getcategory?.filter((item) => item.category !== category && item.type === type);

    const productTemplate = (product) => (
        <div ref={cardRef}
            style={{
                minWidth: '95%',
                // minWidth:`${cardHeight}px`,
                maxWidth:`${cardHeight}px`,
                minHeight: `${cardHeight}px`,
                height: `${cardHeight}px`,
                margin: '3px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
            }}>
            <Link to={`/categories/${product.category}/type/${product.type}`} state={{ category: product.category, type: product.type }} style={{ textDecoration: 'none', padding: '0px', margin: '0px' }}>
                <div className="carosel-card" style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '0px',
                    width: '100%',
                    maxWidth:`${cardHeight}px`,
                    minWidth:`${cardHeight}px`,
                    minHeight: `${cardHeight}px`,
                    height: `${cardHeight}px`,
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
                    }} className="card-title-carousel">{product.name}
                    </div>
                </div>
            </Link>
        </div>
    );


    return (
        <>
        {
            isLoading ? (
                <div style={{ margin: '20px' }}>
                <LoaderButton fullPage={false} size={30}/>
                </div>
            ): (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth:'97vw', width: 'auto',height:'auto', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f5f5', padding: '15px' }}>
                {
                    filteredCategories && (
                        <Carousel
                            value={filteredCategories || []}
                            numScroll={1}
                            numVisible={responsiveOptions[0].numVisible} // Dynamically set based on card width
                            // responsiveOptions={responsiveOptions}
                            responsiveOptions={responsiveOptions}
                            circular
                            autoplay // Enable autoplay
                            autoplayInterval={3000}
                            itemTemplate={productTemplate}
                            showIndicators={true}
                            showNavigators={true}
                            className='carosel-content'
                            style={{ maxWidth: '100%', width: 'auto',height:'auto', padding: '0px', margin: '3px', boxSizing: 'border-box', height: 'auto' }}
                        />
                    )
                }
    
            </div>
            )
        }
      
        </>
        
    );
}