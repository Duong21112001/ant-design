import Text from "@/components/Text";
import { useTranslation } from "next-i18next";
import styles from "./index.module.scss";
import Carousel, { StateCallBack } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRequest } from "@umijs/hooks";
import { listTeacher } from "./service";
import PlaceholderBox from "@/components/placeholderBox";
import { IlistTeacher } from "@/utils/model/teacher";
import Button from "@/components/Button";
import classNames from "classnames";

const Lecturers = () => {
  const { loading, data } = useRequest(
    async () => {
      const result = await listTeacher();
      return result;
    },
    {
      onError: () => {},
    }
  );
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 769 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 480 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 540, min: 0 },
      items: 1,
    },
  };

  const Lecturer = ({
    teacher,
    active,
  }: {
    teacher: IlistTeacher;
    active: boolean;
  }) => {
    return (
      <div className={styles.oneLecturers}>
        <div className={styles.lecturers}>
          {teacher?.image && (
            <Image
              className={styles.imgAvatar}
              src={teacher?.image}
              alt="avatar-lecturers.png"
              layout="fixed"
              width={150}
              height={150}
              style={{
                marginBottom: 8,
                borderRadius: "100%",
                objectFit: "cover",
              }}
            />
          )}

          <Text
            type="heading-h4"
            color="neutral-1"
            className={styles.name}
            bottom={4}
          >
            {teacher?.name}
          </Text>
          <Text type="body-16-semibold" color="neutral-3" bottom={12}>
            Trình độ: N1
          </Text>

          <Text
            type="body-16-regular"
            color="primary-light"
            // bottom={active ? 30 : 14}
            bottom={24}
            maxWidth={188}
            marginAuto
            height={40}
            overFlowHidden
            className="text-content-lecturer"
          >
            {teacher?.content}
          </Text>
          <div className="button-lecturer">
            <Button className={styles.button} type="btn-blue">
              <Text type="body-14-semibold" color="neutral-10">
                Xem chi tiết
              </Text>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // const ref = useRef(null);

  const next = () => {
    // ref?.current?.
  };

  const previous = () => {
    // ref?.current?.slickPrev();
  };

  const settings = {
    className: "section-outstanding__slider",
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    infinite: true,
    rows: 1,
    variableWidth: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          slidesToShow: 3,

          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          rows: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.lecturersPadding}>
      <div className={styles.lecturersWrap}>
        <div className={styles.lecturersContainer}>
          <Text
            type="heading-h2"
            color="shade-primary-5"
            center
            bottom={10}
            className={styles.lecturersTitle}
          >
            Đội ngũ giảng viên tại Kosei
          </Text>
          <Text type="body-16-regular" color="neutral-3" center bottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet
            tempus felis vitae sit est quisque.
          </Text>
          <div>
            {/* <Slider
              ref={ref}
              {...settings}
              className="slider-lecturer"
              initialSlide={2}
              dotsClass="dotsClass-lecturer"
              nextArrow={
                <div onClick={next} className={styles.lecturersArrowsRight}>
                  <Image
                    src="/svg/caret-right-active.svg"
                    alt="arrow-right"
                    layout="fixed"
                    width={20}
                    height={20}
                  />
                </div>
              }
              prevArrow={
                <div
                  onClick={previous}
                  style={{ marginRight: 12 }}
                  className={styles.lecturersArrowsLeft}
                >
                  <Image
                    src="/svg/caret-left-active.svg"
                    alt="arrow-left"
                    layout="fixed"
                    width={20}
                    height={20}
                  />
                </div>
              }
            >
              {(loading ? [...Array(3)] : data)?.map(
                (teacher: IlistTeacher, index: number) => {
                  return (
                    <div key={`lecturer-${teacher?.id}`} className={`${index}`}>
                      <PlaceholderBox loading={loading}>
                        <Lecturer active={false} teacher={teacher} />
                      </PlaceholderBox>
                    </div>
                  );
                }
              )}
            </Slider> */}
            <Carousel
              responsive={responsive}
              showDots={false}
              containerClass={classNames(
                "container-class-course",
                styles.carousel
              )}
              centerMode={false}
              renderArrowsWhenDisabled={true}
              arrows={true}
            >
              {/* {!loading &&
                data?.map((teacher: IlistTeacher, index: number) => {
                  return (
                    <div key={`lecturer-${teacher?.id}`} className={`${index}`}>
                      <PlaceholderBox loading={loading}>
                        {!loading && (
                          <Lecturer active={false} teacher={teacher} />
                        )}
                      </PlaceholderBox>
                    </div>
                  );
                })} */}
              {(loading ? [...Array(3)] : data)?.map(
                (teacher: IlistTeacher, index: number) => {
                  return (
                    <div key={`lecturer-${teacher?.id}`} className={`${index}`}>
                      <PlaceholderBox loading={loading}>
                        {!loading && (
                          <Lecturer active={false} teacher={teacher} />
                        )}
                      </PlaceholderBox>
                    </div>
                  );
                }
              )}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecturers;
