/* eslint-disable no-undef */
import './HomeComponent.css';
import React, {useRef, useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faTwitter, faFacebook, faWhatsappSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import WOW from "wow.js";

const HomeComponent = (location) => {
  const [data, setData] = useState([]);
  const [wrapSlideData, setSlideData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const copyrightYear = new Date().getFullYear();
  const settings = {
    dots: false, // Hide dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Auto-play slides
    autoplaySpeed: 3000, // Change slide every 3 seconds
    fade: true, // Use fade effect for smoother transitions
    arrows: false // Hide arrows if you don't need them  
  };

  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  
  const images = [
    "/assets/media/cover/slide-1.jpg", // Path from your public folder
    "/assets/media/cover/slide-2.jpg",
    "/assets/media/cover/slide-3.jpg"
  ]

  const wrapData = (data) => {
    const wraped = {};
    console.log('wrapdata =>' + data.count)
    let index =0;
    data.results.forEach(element => {
      if(element.type === 'slide')
      {
        wraped[index]=element;
        index = index + 1;
      }
    });
  
    Object.keys(wraped).map((key) => {
      console.log(wraped[key]);
    });
    setSlideData(wraped);
  }

  useEffect(() => {
    const apiUrl = '/api/home/appdetailslist/';
    //Initialize wow.js
    new WOW({mobile: false}).init();

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        // 'Authorization': 'Basic ${token}',
        'Content-Type': 'application/json'
      }
    })
    .then(response => { 
      if(!response.ok){
          throw new Error('Network response was not ok, status code: ' + response.status)
        }
     return response.json()
    })
    .then(data => {
      console.log('Fetched data:',data); // Log the response to check its structure
      if(data){
        setData(data);
        wrapData(data);
      }
      else{
        console.error('Data is not defined');
      }
      setLoading(false);
      setError(null);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setError({message: error.message});
      setLoading(false);
    });


    // Preload images and handle errors (important!)
    images.forEach(image => {
      const img = new Image();
      img.src = image;
      img.onerror = () => {
          console.error("Error loading image:", image);
          setImageError(true); // Set error state if any image fails
      };
    });

  }, [location]); //add error message to the dependency array

  return (
    <>
    {
      loading ? (
        <>
          <div className="loader"></div>
          <section className="preloader">
            <div className="sk-circle">
              <div className="sk-circle1 sk-child"></div>
              <div className="sk-circle2 sk-child"></div>
              <div className="sk-circle3 sk-child"></div>
              <div className="sk-circle4 sk-child"></div>
              <div className="sk-circle5 sk-child"></div>
              <div className="sk-circle6 sk-child"></div>
              <div className="sk-circle7 sk-child"></div>
              <div className="sk-circle8 sk-child"></div>
              <div className="sk-circle9 sk-child"></div>
              <div className="sk-circle10 sk-child"></div>
              <div className="sk-circle11 sk-child"></div>
              <div className="sk-circle12 sk-child"></div>
            </div>    
          </section>
        </>
      ) : error ? (
        <div className='error'>Error: {error.message}</div>
      ) : (
          <>
            <div className="background-slider">
              <Slider {...settings}>
                  {images.map((image, index) => (
                      <div key={index} className="slide-container">
                          <div className="background-image" style={
                            {
                              backgroundImage: `url(${image})`,
                                // Add className to the slider and the slides:
                              slideClassName: "my-custom-slide", // Add a class to each slide
                            }}></div>
                      </div>
                  ))}
              </Slider>
            </div>

            <section id="home">
              <div className="container">
                <div className="row">
                  <div className="offset-md-2 col-md-8 col-sm-12" id="appheading">
                    <div className="home-thumb">
                      {
                      // Inside your map:
                        // Inside your map:
                        data.results.map((item, index) => {
                            if (item.type === "header") {
                                return (
                                    /* The key MUST be on this outermost element */
                                    <Fragment key={item.id || index}>
                                        <h1 className='wow bounceInUp appHeading' data-wow-delay='0.4s'>
                                            {item.heading}
                                        </h1>
                                        <h3 className='wow bounceInUp appSubHeading' data-wow-delay='0.6s'>
                                            {item.sub_heading}
                                        </h3>
                                    </Fragment>
                                );
                            } else {
                                return null;
                            }
                        })
                      }
                  </div>
                </div>
              </div>		
              </div>
            </section>

            <section id="about">
                <Swiper
                    centeredSlides={true}
                    spaceBetween={50} // Space between slides
                    pagination={{
                    clickable: true,
                    }}
                    navigation={true} // If you want navigation buttons
                    effect='slide'
                    speed={1000}
                    autoplay={{
                        delay: 3000, // Time between slides in milliseconds
                        disableOnInteraction: false // Prevent autoplay on user interaction
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    onAutoplayTimeLeft={onAutoplayTimeLeft}
                    className="mySwiper"
                    >
                         {Object.values(wrapSlideData).map((images) => (
                            <SwiperSlide>
                              <div className='container'>
                                  <div className='row'>
                                    <div className='col-md-6 col-sm-12'> 
                                        <img src={images.url} alt="NoImage" /> 
                                    </div>
                                    <div className='col-md-6 col-sm-12'>
                                        <div className="about-thumb">
                                            <div className="section-title">
                                              <h1 key={images.id} className="wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.1s"> {images.heading} </h1>
                                              <h3 key={images.id+1} className="wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s"> {images.sub_heading} </h3>
                                            </div> 
                                        </div>
                                        <div className="wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.4s">
                                          <p key={images.id+2}> {images.content} </p>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                            </SwiperSlide>
                        ))} 
                    <div className="autoplay-progress" slot="container-end">
                        <svg viewBox="0 0 48 48" ref={progressCircle}>
                            <circle cx="24" cy="24" r="20"></circle>
                        </svg>
                        <span ref={progressContent}></span>
                    </div>
                </Swiper>
            </section>
            
            <section id="feature">
              <div className="container">
                <div className="row">
                  <svg preserveAspectRatio="none" viewBox="0 0 100 102" height="100" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" className="svgcolor-light">
                    <path d="M0 0 L50 100 L100 0 Z"></path>
                  </svg>
                  <div className='grid-container'>
                  {
                  
                  data.results.map((item, index) => {
                    if(item.type === "quote"){
                      return(
                        <div className="media wow fadeInUp" data-wow-delay="0.4s" key={index}>
                        <div className="media-object media-left" key={index}>
                          <div className="media-body grid-item" key={index+1}>
                                <h2 key={index+2} className="whiteColorHeading"> {item.heading} </h2>
                                <p key={index+3} >{item.sub_heading}</p>
                              </div>
                              </div></div>
                      )   
                      }
                      else
                      {
                        return null;
                      }
                    })
                    
                  }
                  </div>
                </div>
              </div>
            </section>  

            <section id="contact">
              <div className="container">
                <div className="row">
                  <div className="offset-md-2 col-md-8 col-sm-12">
                    <div className="section-title">
                      <h1 className="wow fadeInUp" data-wow-delay="0.3s">{data.results[6].heading}</h1>
                      <p className="wow fadeInUp" data-wow-delay="0.6s">{data.results[7].sub_heading}</p>
                    </div>
                    <div className="contact-form wow fadeInUp" data-wow-delay="1.0s">
                        <div className="offset-md-4 col-md-4 offset-sm-4 col-sm-8">
                           <Link to='/login'>
                            <button className="form-control welcomeClass text-xs-center btn btn-secondary">உள்நுழைய</button>
                          </Link> 
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer>
              <div className="container">
                <div className="row">
                  <svg className="svgcolor-light" preserveAspectRatio="none" viewBox="0 0 100 102" height="100" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0 L50 100 L100 0 Z"></path>
                  </svg>

                  <div className="col-md-7 col-sm-6">
                    <h2 className='whiteColorHeading'>{data.results[7].heading}</h2>
                      <div className="wow fadeInUp" data-wow-delay="0.3s">
                        <p className="whiteColorHeading">{data.results[7].sub_heading}</p>
                        <p className="copyright-text whiteColorHeading">காப்புரிமை &copy; {copyrightYear} நாம் தமிழர் கட்சி, வீரபாண்டி தொகுதி, சேலம் மாவட்டம்.<br />
                          வடிவமைத்தவர் :  <a rel="nofollow" href="http://pairchikoodam.com/" target="_blank">Pairchikoodam</a></p>
                      </div>
                  </div>

                  <div className="col-md-1 col-sm-1"></div>

                  <div className="col-md-3 col-sm-4">
                    <h2 className='whiteColorHeading'>தொடர்புக்கு</h2>
                    <p className="wow fadeInUp whiteColorHeading" data-wow-delay="0.6s">
                    +919739856191
                    </p>
                    <ul className="social-icon">
                      <li>
                        <a href="https://ntkveerapandi.org" className="youtube" target='_blank' rel="noreferrer" title="வலையொளி">
                          <FontAwesomeIcon icon={faYoutube} />
                        </a>
                      </li>
                      <li>
                        <a href="https://ntkveerapandi.org" className="facebook" target='_blank' rel="noreferrer" title="முகநூல்">
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      </li>
                      <li>
                        <a href="https://ntkveerapandi.org" className="instagram" target='_blank' rel="noreferrer" title="படவரி">
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com" className="twitter" target='_blank' rel="noreferrer" title="கீச்சகம்">
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                      </li>
                      <li>
                        <a href="https://ntkveerapandi.org" className="whatsapp" target='_blank' rel="noreferrer" title="பகிரி">
                          <FontAwesomeIcon icon={faWhatsappSquare} />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>  
          </>
         ) 
    };
    </>
  );
}

export default HomeComponent;
