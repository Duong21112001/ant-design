import React from "react";
import classNames from "classnames";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

interface ButtonProps {
  children: React.ReactNode;
  numberItemShow: number;
  itemNumber: number;
}

const CarouselComponent: React.FC<ButtonProps> = ({
  children,
  numberItemShow,
  itemNumber,
}) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: numberItemShow,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: numberItemShow,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
    const {
      carouselState: { currentSlide, slidesToShow, totalItems, transform },
    } = rest;

    return (
      <div className="carousel-button-group">
        <div
          className={
            currentSlide === 0
              ? "disable-button-carousel"
              : "able-button-carousel"
          }
          onClick={() => previous()}
          style={{ marginRight: 12 }}
        >
          <Image
            src={
              currentSlide === 0
                ? "/svg/caret-left.svg"
                : "/svg/caret-left-active.svg"
            }
            alt="caret-left"
            width={24}
            height={24}
            layout="fixed"
            color="red"
          />
        </div>
        <div
          onClick={() => next()}
          className={
            currentSlide + slidesToShow === itemNumber
              ? "disable-button-carousel"
              : "able-button-carousel"
          }
        >
          <Image
            src={
              currentSlide + slidesToShow === itemNumber
                ? "/svg/caret-right.svg"
                : "/svg/caret-right-active.svg"
            }
            alt="caret-right"
            width={24}
            height={24}
            layout="fixed"
          />
        </div>
      </div>
    );
  };
  const CustomDot = ({ onClick, ...rest }: any) => {
    const { active } = rest;
    const classes = classNames(
      "dotCarousel",
      { activeDot: active },
      { inactiveDot: !active }
    );
    return <div className={classes} onClick={() => onClick()} />;
  };
  return (
    <div className="carousel-container">
      <Carousel
        responsive={responsive}
        arrows={false}
        renderButtonGroupOutside={true}
        renderDotsOutside={true}
        showDots={true}
        customButtonGroup={<ButtonGroup />}
        customDot={<CustomDot />}
        dotListClass="dotListClass"
        containerClass="containerClass"
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
