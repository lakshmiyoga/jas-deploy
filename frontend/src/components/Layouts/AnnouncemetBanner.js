import React, { useState, useEffect } from 'react';

const AnnouncementBanner = ({ bannerAnnouncement, setShowAnnouncement }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tracks the current image being displayed
  const [timeLeft, setTimeLeft] = useState(5); // Tracks the time left before the close button becomes available
  const [isCloseEnabled, setIsCloseEnabled] = useState(false); // Controls whether close button is enabled

  useEffect(() => {
    // Reset the timeLeft and isCloseEnabled state when currentImageIndex changes
    setTimeLeft(5);
    setIsCloseEnabled(false);

    // Countdown timer every second
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer); // Clear the timer when it reaches 0
          setIsCloseEnabled(true); // Enable the close button
          return 0;
        }
        return prevTime - 1; // Decrement time
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer when the component unmounts or updates
  }, [currentImageIndex]); // Runs every time currentImageIndex changes

  const handleNextImage = () => {
    if (currentImageIndex < bannerAnnouncement.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1); // Move to the next image
    } else {
      // Close modal once all banners are completed
      setShowAnnouncement(false);
    }
  };

  const handleCancelDelete = () => {
    if (isCloseEnabled) {
      handleNextImage(); // Only close when the close button is enabled
    }
  };

  const currentBanner = bannerAnnouncement[currentImageIndex];

  return (
    <>
      <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
        <div  role="document">
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title">Announcement</h5>
              {
                isCloseEnabled ? (
                  <button
                    type="button"
                    className="close"
                    onClick={handleCancelDelete}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                ) : (
                  <p>{timeLeft}</p> // Display the timer
                )
              }
            </div> */}
            <div >
            {
                isCloseEnabled ? (
                  <button
                    type="button"
                    // className="close"
                    style={{outline:'none',border:'none' ,fontSize:'18px',fontWeight:'100px',display:'flex',position:'absolute',top:'10px',right:'10px',backgroundColor:'#fff',zIndex:'999'}}
                    onClick={handleCancelDelete}
                    // style={{outline:'none',border:'none'}}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                ) : (
                    <button
                    // type="button"
                    // className="close"

                    style={{outline:'none',border:'none' ,fontSize:'8px',fontWeight:'100px',display:'flex',position:'absolute',top:'10px',right:'10px',backgroundColor:'#fff',zIndex:'999'}}
                    // onClick={handleCancelDelete}
                  >
                    <span aria-hidden="true" style={{fontSize:'13px',fontWeight:'100px',zIndex:'999'}}> {timeLeft}</span>
                  </button>
                 // Display the timer
                )
              }
              <div className="modal-image-container-banner">
                <img
                  src={currentBanner?.images[0]?.image}
                  alt={`Banner ${currentImageIndex + 1}`}
                //   style={imageStyle}
                className='bannerimg'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const modalStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const imageStyle = {
  minWidth:'100%',
//   minHight:'85vh',
  maxHight:'85vh',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
//   hight:'auto',
  position:'relative',
  overflow: 'hidden',
  objectFit: 'contain', // Ensures the image is fully contained within the defined space
//   margin: 'auto', // Centers the image within the modal
};

export default AnnouncementBanner;