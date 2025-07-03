/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/general-components/button";
import Image from "next/image";
import arrowIcon from "@/svgs/arrowIcon.svg";
import Card from "../general-components/card";
import { motion, useInView } from "framer-motion";
import toast from "react-hot-toast";
import imgSample from "@/assets/assets.png";
import { URLS } from "@/utils/URLS";
import { usePageContext } from "@/context/page-context";
import "ldrs/react/Trio.css";
import { Trio } from "ldrs/react";
import { epilogue } from "@/styles/font";
import { shuffleArray } from "@/utils/shuffleArray";
import axios from "axios";
import { GET_REQUEST } from "@/utils/requests";
import { useRouter } from "next/navigation";

const Section2 = () => {
  const [buttons, setButtons] = useState({
    button1: true,
    button2: false,
    button3: false,
    button4: false,
  });
  const { setCardData } = usePageContext();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedMarketPlace, setSelectedMarketPlace] =
    useState("Buy a property");
  const housesRef = useRef<HTMLDivElement>(null);

  const areHousesVisible = useInView(housesRef, { once: true });
  const [isAddForInspectionModalOpened, setIsAddForInspectionModalOpened] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchAllRentProperties = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(URLS.BASE + URLS.rentersFetchBriefs);

      if (response.status !== 200) {
        setIsLoading(false);
        throw new Error("Failed to fetch data");
      }

      const data = response.data.data;
      console.log(response, data);
      const shuffled = shuffleArray(data);
      setProperties(
        shuffled.slice(0, 4).map((item: any) => ({
          ...item,
          price: item?.rentalPrice,
          propertyFeatures: {
            additionalFeatures: item?.features?.map(
              (item: { featureName: string }) => item.featureName,
            ),
            noOfBedrooms: item.noOfBedrooms,
          },
          docOnProperty: item?.tenantCriteria?.map(
            ({ criteria, _id }: { criteria: string; _id: string }) => ({
              docName: criteria,
              _id: _id,
              isProvided: true,
            }),
          ),
        })),
      );
      setCardData(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleShowMoreClick = () => {
    if (buttons.button1) return (window.location.href = "/market-place");
    if (buttons.button2) return (window.location.href = "/market-place");
    if (buttons.button3) return (window.location.href = "/market-place");
    if (buttons.button4) return (window.location.href = "/market-place");
  };

  const handleSubmitInspection = (property: any) => {
    if (buttons.button1) {
      //Retrieve existing selectedBriefs from localStorage
      const existingBriefs = JSON.parse(
        localStorage.getItem("selectedBriefs") || "[]",
      );

      //check if the new property exists
      const isPropertyExisting = existingBriefs.find(
        (brief: any) => brief._id === property._id,
      );

      if (isPropertyExisting) {
        //apply toast warning
        toast.error("Property already selected");
        return;
      }

      //check if the properties selected has exceeded 3
      if (existingBriefs.length >= 3) {
        //apply toast warning
        toast.error("Maximum properties selected");
        return;
      }

      //Ensure it's an array and add the new property
      const updatedBriefs = Array.isArray(existingBriefs)
        ? [...existingBriefs, property]
        : [property];

      //Save back to localStorage
      localStorage.setItem("selectedBriefs", JSON.stringify(updatedBriefs));
      toast.success("Successfully added for inspection");
    } else if (buttons.button2) {
      //
      toast.error("Feature not available yet");
    } else if (buttons.button3) {
      //apply toast warning
      toast.error("Feature not available yet");
    }
  };

  const getBriefType = (marketPlace: string) => {
    switch (marketPlace) {
      case "Buy a property":
        return "Outright Sales";
      case "Find property for joint venture":
        return "Joint Venture";
      case "Rent/Lease a property":
        return "Rent";
      default:
        return "Outright Sales";
    }
  };

  const sanitizeUrl = (url: string) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("/")
    ) {
      return url;
    }
    return "https://" + url.replace(/^\/+/, "");
  };

  useEffect(() => {
    const briefType = getBriefType(selectedMarketPlace);
    const url = `${URLS.BASE}${
      URLS.fetchBriefs
    }?page=1&limit=4&briefType=${encodeURIComponent(briefType)}`;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check if BASE URL is available
        if (!URLS.BASE || URLS.BASE === "undefined") {
          console.warn("API URL not configured, using mock data");
          setProperties([]);
          setCardData([]);
          return;
        }

        const data = await GET_REQUEST(url);

        // Handle API error response
        if (data.error) {
          console.warn("API request failed:", data.error);
          setProperties([]);
          setCardData([]);
          return;
        }

        let approved = Array.isArray(data.data)
          ? data.data.filter((item: any) => item.isApproved === true)
          : [];

        if (buttons.button2) {
          approved = approved.filter(
            (item: any) => item.propertyType === "Land",
          );
        }

        const sanitizedApproved = shuffleArray(approved)
          .slice(0, 4)
          .map((item: any) => ({
            ...item,
            pictures: item?.pictures?.map((img: string) => sanitizeUrl(img)),
          }));

        setProperties(sanitizedApproved);
        setCardData(approved);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setProperties([]);
        setCardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMarketPlace, setCardData, buttons.button2]);

  return (
    <section className="flex justify-center items-center bg-[#8DDB901A] pb-[30px]">
      <div className="container min-h-[700px] flex flex-col justify-center items-center gap-[20px] px-[10px] overflow-hidden">
        <div className="min-h-[128px] w-full lg:w-[870px] flex flex-col justify-center items-center gap-[9px] pt-[40px]">
          <h2 className="text-[24px] leading-[28.13px] lg:text-[36px] lg:leading-[57.6px] md:leading-[32px] text-[#09391C] text-center font-semibold">
            See what other buyers are exploring
          </h2>
          <p className="text-[#5A5D63] text-base md:text-[18px] leading-[28.8px] tracking-[5%] font-normal text-center">
            Discover properties recently viewed by buyers like you. Stay
            inspired by trending options and explore opportunities you might
            have missed
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`md:min-w-[466px] min-h-[38px] py-[10px] gap-[15px] flex flex-wrap justify-center`}
        >
          <Button
            value="House for sale"
            green={buttons.button1}
            onClick={() => {
              setButtons({
                button1: true,
                button2: false,
                button3: false,
                button4: false,
              });
              setSelectedMarketPlace("Buy a property");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button1 ? "" : "text-[#5A5D63]"
            }`}
          />
          <Button
            green={buttons.button2}
            value="Land for sale"
            onClick={() => {
              setButtons({
                button1: false,
                button2: true,
                button3: false,
                button4: false,
              });
              setSelectedMarketPlace("Buy a property");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[168px] ${
              buttons.button2 ? "" : "text-[#5A5D63]"
            }`}
          />
          <Button
            green={buttons.button3}
            value="Rent/Lease a house"
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: true,
                button4: false,
              });
              setSelectedMarketPlace("Rent/Lease a property");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[200px] ${
              buttons.button3 ? "" : "text-[#5A5D63] "
            }`}
          />
          <Button
            green={buttons.button4}
            value="Property for Joint Venture"
            onClick={() => {
              setButtons({
                button1: false,
                button2: false,
                button3: false,
                button4: true,
              });
              setSelectedMarketPlace("Find property for joint venture");
            }}
            className={`border-[1px] h-[38px] md:h-[initial] md:py-[15px] md:px-[24px] text-[12px] text-xs md:text-[14px] transition-all duration-500 border-[#D6DDEB] w-[105px] md:min-w-[220px] ${
              buttons.button4 ? "" : "text-[#5A5D63] "
            }`}
          />
        </motion.div>
        <motion.div
          ref={housesRef}
          initial={{ opacity: 0, x: 20 }}
          animate={areHousesVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3 }}
          className={`min-h-[446px] overflow-y-clip hide-scrollbar w-full md:min-h-[412px] flex flex-wrap justify-center md:justify-center items-center gap-[10px]`}
        >
          {isLoading ? (
            <div className="w-[inherit] flex justify-center items-center">
              <Trio size={50} speed={1.3} color="#09391C" />
            </div>
          ) : properties.length !== 0 ? (
            properties?.map((property: any, idx: number) => {
              return (
                <Card
                  isAddForInspectionModalOpened={isAddForInspectionModalOpened}
                  images={property?.pictures}
                  isPremium={property?.isPremium}
                  onCardPageClick={() => {
                    if (buttons.button1) {
                      return router.push(`/property/${"Buy"}/${property?._id}`);
                    } else if (buttons.button3) {
                      return router.push(`property/${"Rent"}/${property?._id}`);
                    }
                  }}
                  onClick={() => {
                    handleSubmitInspection(property);
                  }}
                  cardData={[
                    {
                      header: "Property Type",
                      value: property?.propertyType || "N/A",
                    },
                    {
                      header: "Price",
                      value: `₦${Number(
                        property?.price || 0,
                      ).toLocaleString()}`,
                    },
                    {
                      header: "Bedrooms",
                      value: property?.additionalFeatures.noOfBedrooms || "N/A",
                    },
                    {
                      header: "Location",
                      value: `${property?.location?.state || "N/A"}, ${
                        property?.location?.localGovernment || "N/A"
                      }`,
                    },
                    // {
                    //   header: 'Documents',
                    //   value: `<div>${property?.docOnProperty?.map(
                    //     (item: { _id: string; docName: string }) =>
                    //       `<span key={${item._id}>${item.docName}</span>`
                    //   )}</div>`,
                    // },
                    {
                      header: "Documents",
                      value: (
                        <div>
                          {property?.docOnProperty?.map(
                            (item: { _id: string; docName: string }) => (
                              <span key={item._id} style={{ marginRight: 8 }}>
                                {item.docName}
                              </span>
                            ),
                          )}
                        </div>
                      ),
                    },
                  ]}
                  key={idx}
                />
              );
            })
          ) : (
            <div className="w-[inherit] flex justify-center items-center">
              <p
                className={`text-[#09391C] text-base font-semibold ${epilogue.className}`}
              >
                No properties available at the moment
              </p>
            </div>
          )}
        </motion.div>
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={handleShowMoreClick}
            type="button"
            className="flex justify-center items-center gap-2"
          >
            <span className="text-base font-display text-[#09391C] leading-[25px] font-semibold">
              View more
            </span>{" "}
            {/* <Image
              src={arrowIcon}
              width={12}
              height={15}
              alt=''
              className='w-[12px] h-[15px]'
            /> */}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section2;
